import { createPrivateKey, createSign } from 'node:crypto';

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const sheetsScope = 'https://www.googleapis.com/auth/spreadsheets';
const defaultSheetRange = 'Leads!A:K';
const demoAccessSource = 'index-demo-access';
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
  if (lead.source === demoAccessSource) {
    if (!lead.email) {
      throw Object.assign(new Error('Missing required fields: email'), {
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
    return {
      ...lead,
      partner_type: 'demo_access',
      details: lead.details || 'Requested live demo access.',
    };
  }
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

function demoAccessCode() {
  const value = env('DEMO_ACCESS_CODE');
  if (!value) {
    throw Object.assign(new Error('DEMO_ACCESS_CODE is not configured'), {
      statusCode: 500,
      code: 'demo_access_code_not_configured',
      publicMessage: 'Demo access code is not configured yet.',
    });
  }
  return value;
}

function demoUrl() {
  return env('VITE_DEMO_URL') || env('DEMO_URL');
}

function requestOrigin(req) {
  const host = String(req.headers.host || '').trim();
  if (!host) return 'https://www.neuralint.io';
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const proto = forwardedProto || (host.startsWith('127.0.0.1') || host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

function demoAuthCheckUrl(rawDemoUrl, req) {
  if (!rawDemoUrl) {
    throw Object.assign(new Error('VITE_DEMO_URL is not configured'), {
      statusCode: 500,
      code: 'demo_url_not_configured',
      publicMessage: 'The product demo URL is not configured yet.',
    });
  }
  try {
    const parsedDemoUrl = new URL(rawDemoUrl, requestOrigin(req));
    const returnTo = parsedDemoUrl.searchParams.get('return_to') || '/portal';
    const authCheckUrl = new URL('/auth/me', parsedDemoUrl.origin);
    authCheckUrl.searchParams.set(
      'return_to',
      new URL(returnTo, parsedDemoUrl.origin).toString(),
    );
    return authCheckUrl;
  } catch (error) {
    throw Object.assign(error, {
      statusCode: 500,
      code: 'invalid_demo_url',
      publicMessage: 'The product demo URL is invalid.',
    });
  }
}

async function requireDemoAccessProductSupport(rawDemoUrl, req) {
  const endpoint = demoAuthCheckUrl(rawDemoUrl, req);
  const response = await fetch(endpoint, {
    headers: { accept: 'application/json' },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(`Product auth check failed with status ${response.status}`), {
      statusCode: 502,
      code: 'product_auth_check_failed',
      publicMessage: data.detail || data.message || `Product auth check failed with status ${response.status}`,
    });
  }
  if (data.access_code_auth_enabled !== true) {
    throw Object.assign(new Error('Product demo access-code sign-in is not configured'), {
      statusCode: 503,
      code: 'product_access_code_auth_not_configured',
      publicMessage: 'The product demo is not configured for access-code sign-in yet.',
    });
  }
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
      publicMessage: data.error_description || data.error || `Google auth failed with status ${response.status}`,
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
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(`Google Sheets append failed with status ${response.status}`), {
      statusCode: 502,
      code: 'google_sheets_append_failed',
      publicMessage: data.error?.message || `Google Sheets append failed with status ${response.status}`,
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
    const payload = await readRequestJson(req);
    const lead = validateLead(payload);
    const revealedDemoCode = lead.source === demoAccessSource ? demoAccessCode() : '';
    if (lead.source === demoAccessSource) {
      await requireDemoAccessProductSupport(demoUrl(), req);
    }
    const config = requireGoogleConfig();
    const accessToken = await getAccessToken(config);
    await appendLead(config, accessToken, lead, req);
    json(res, 200, lead.source === demoAccessSource
      ? { ok: true, demo_access_code: revealedDemoCode }
      : { ok: true });
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    console.error(error);
    json(res, statusCode, {
      ok: false,
      error: error.code || 'contact_submit_failed',
      message: error.publicMessage || (statusCode < 500 ? error.message : 'Could not save contact details'),
    });
  }
}
