import { createPrivateKey, createSign } from 'node:crypto';

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const sheetsScope = 'https://www.googleapis.com/auth/spreadsheets';
const defaultSheetRange = 'Leads!A:K';
const maxFieldLengths = {
  name: 160,
  email: 254,
  company: 180,
  partner_type: 80,
  client_volume: 120,
  details: 4000,
  source: 120,
  page: 500,
};

const requiredFields = ['name', 'email', 'company', 'partner_type'];

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function base64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function normalizePrivateKey(value) {
  let trimmed = value.trim();
  if (trimmed.startsWith('GOOGLE_PRIVATE_KEY=')) {
    trimmed = trimmed.slice('GOOGLE_PRIVATE_KEY='.length).trim();
  }
  if (trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.private_key !== 'string') {
      throw Object.assign(new Error('GOOGLE_PRIVATE_KEY JSON must include private_key'), {
        statusCode: 500,
        code: 'invalid_private_key_format',
      });
    }
    return normalizePrivateKey(parsed.private_key);
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1);
  }
  return trimmed.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
}

function privateKeyObject(value) {
  try {
    return createPrivateKey(normalizePrivateKey(value));
  } catch (error) {
    throw Object.assign(error, {
      statusCode: 500,
      code: 'invalid_private_key_format',
    });
  }
}

function env(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function readServiceAccountJson() {
  const value = env('GOOGLE_SERVICE_ACCOUNT_JSON') || env('GOOGLE_PRIVATE_KEY');
  if (!value) return {};
  if (!value.trim().startsWith('{')) return {};
  try {
    const parsed = JSON.parse(value);
    return {
      serviceAccountEmail: typeof parsed.client_email === 'string' ? parsed.client_email : '',
      privateKey: typeof parsed.private_key === 'string' ? parsed.private_key : '',
    };
  } catch (error) {
    throw Object.assign(error, {
      statusCode: 500,
      code: 'invalid_service_account_json',
    });
  }
}

function requireGoogleConfig() {
  const serviceAccount = readServiceAccountJson();
  const config = {
    sheetId: env('GOOGLE_SHEET_ID'),
    serviceAccountEmail: env('GOOGLE_SERVICE_ACCOUNT_EMAIL') || serviceAccount.serviceAccountEmail,
    privateKey: env('GOOGLE_PRIVATE_KEY') || serviceAccount.privateKey,
    range: env('GOOGLE_SHEET_RANGE') || defaultSheetRange,
  };
  const missing = Object.entries(config)
    .filter(([key, value]) => key !== 'range' && !value)
    .map(([key]) => key);
  if (missing.length) {
    throw Object.assign(new Error(`Missing Google Sheets configuration: ${missing.join(', ')}`), {
      statusCode: 500,
      code: 'google_sheets_not_configured',
    });
  }
  return config;
}

async function readRequestJson(req) {
  try {
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8'));
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body);

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON'), {
      statusCode: 400,
      code: 'invalid_json',
    });
  }
}

function cleanField(payload, field) {
  const raw = payload[field];
  if (raw == null) return '';
  const value = String(raw).trim();
  const maxLength = maxFieldLengths[field] ?? 500;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function sheetSafe(value) {
  if (/^[=+\-@]/.test(value)) return `'${value}`;
  return value;
}

function validateLead(payload) {
  const lead = Object.fromEntries(Object.keys(maxFieldLengths).map((field) => [field, cleanField(payload, field)]));
  const missing = requiredFields.filter((field) => !lead[field]);
  if (missing.length) {
    throw Object.assign(new Error(`Missing required fields: ${missing.join(', ')}`), {
      statusCode: 400,
      code: 'missing_required_fields',
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    throw Object.assign(new Error('Invalid email address'), {
      statusCode: 400,
      code: 'invalid_email',
    });
  }
  return lead;
}

function createJwt(config) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: config.serviceAccountEmail,
    scope: sheetsScope,
    aud: googleTokenUrl,
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(header)}.${base64url(claims)}`;
  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(privateKeyObject(config.privateKey), 'base64url');
  return `${unsigned}.${signature}`;
}

async function getAccessToken(config) {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: createJwt(config),
  });
  const response = await fetch(googleTokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw Object.assign(new Error(`Google auth failed with status ${response.status}`), {
      statusCode: 502,
      code: 'google_auth_failed',
    });
  }
  return data.access_token;
}

async function appendLead(config, accessToken, lead, req) {
  const submittedAt = new Date().toISOString();
  const row = [
    submittedAt,
    lead.name,
    lead.email,
    lead.company,
    lead.partner_type,
    lead.client_volume,
    lead.details,
    lead.source || 'index-partner-landing',
    lead.page,
    req.headers.referer || '',
    req.headers['user-agent'] || '',
  ].map(sheetSafe);
  const endpoint = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values/${encodeURIComponent(config.range)}:append`);
  endpoint.searchParams.set('valueInputOption', 'USER_ENTERED');
  endpoint.searchParams.set('insertDataOption', 'INSERT_ROWS');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });
  if (!response.ok) {
    throw Object.assign(new Error(`Google Sheets append failed with status ${response.status}`), {
      statusCode: 502,
      code: 'google_sheets_append_failed',
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    json(res, 405, { ok: false, error: 'method_not_allowed' });
    return;
  }

  try {
    const config = requireGoogleConfig();
    const payload = await readRequestJson(req);
    const lead = validateLead(payload);
    const accessToken = await getAccessToken(config);
    await appendLead(config, accessToken, lead, req);
    json(res, 200, { ok: true });
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    console.error(error);
    json(res, statusCode, {
      ok: false,
      error: error.code || 'contact_submit_failed',
      message: statusCode < 500 ? error.message : 'Could not save contact details',
    });
  }
}
