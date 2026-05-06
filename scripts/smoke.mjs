import { createReadStream } from 'node:fs';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = join(root, 'dist');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webp': 'image/webp',
};

const normalizeBasePath = (value) => {
  if (!value || value === '/') return '/';
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};
const basePath = normalizeBasePath(process.env.VITE_BASE || '/');
const stripBasePath = (pathname) => {
  if (basePath === '/') return pathname;
  if (pathname === basePath.slice(0, -1)) return '/';
  if (pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length - 1) || '/';
  }
  return pathname;
};

const productAssets = [
  'idx-ap-review.png',
  'idx-ap-match.png',
  'idx-inbox.png',
  'idx-dashboard.png',
  'idx-inventory.png',
  'idx-customer-360.png',
  'idx-posting-preview.png',
];

const textExtensions = new Set(['.css', '.html', '.js', '.svg', '.txt', '.xml']);

const collectTextFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectTextFiles(path);
    }
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  }));
  return nestedFiles.flat();
};

await access(join(dist, 'index.html'));
await access(join(dist, 'robots.txt'));
await access(join(dist, 'sitemap.xml'));
await access(join(dist, 'assets', 'brand', 'index-logo.jpg'));
await Promise.all(productAssets.map((name) => access(join(dist, 'assets', 'product', name))));

const builtAssetNames = await readdir(join(dist, 'assets'));
const distRootNames = new Set((await readdir(dist)).map((name) => name));
const forbiddenDistEntries = [
  'IDX Landing.html',
  'IDX Landing v1.html',
  'IDX Wireframes.html',
  'IDX Wireframes v2.html',
  'IDX Wireframes v2-print.html',
  'design-canvas.jsx',
  'directionA.jsx',
  'directionB.jsx',
  'directionB2.jsx',
  'directionC.jsx',
  'directionD.jsx',
  'directionE.jsx',
  'docMock.jsx',
  'docMocks2.jsx',
  'fullscreens.jsx',
  'screenshots',
  'secondary.jsx',
  'shared.jsx',
  'styles.css',
  'tweaks-panel.jsx',
  'uploads',
];
const leakedDistEntries = forbiddenDistEntries.filter((name) => distRootNames.has(name));
if (leakedDistEntries.length) {
  throw new Error(`Legacy prototype files leaked into dist: ${leakedDistEntries.join(', ')}`);
}
const unexpectedRootSources = [...distRootNames].filter((name) => (
  (name.endsWith('.html') && name !== 'index.html')
  || name.endsWith('.jsx')
  || name.endsWith('.css')
));
if (unexpectedRootSources.length) {
  throw new Error(`Unexpected source-like files in dist root: ${unexpectedRootSources.join(', ')}`);
}

const builtJs = await Promise.all(
  builtAssetNames
    .filter((name) => name.endsWith('.js'))
    .map((name) => readFile(join(dist, 'assets', name), 'utf8')),
);
const builtTextFiles = await collectTextFiles(dist);
const builtText = await Promise.all(builtTextFiles.map((path) => readFile(path, 'utf8')));
const builtLandingText = [...builtText, ...builtJs].join('\n');
const forbiddenTerms = [
  'example.com',
  '%SITE_URL%',
  '%BASE_URL%',
  'ASSET SLOT',
  'IDX',
  'Co-sell',
  'co-sell',
  'DOCUMENT SYSTEMS LTD',
  '$0.04',
  '$0.06',
  '/page',
  'credit card',
  'cost per page',
  'Book a demo',
  'Sign in',
  'Pricing',
  'source-linked',
  'system-of-record',
  'back-office',
  'Partner-ready',
  'partner-ready',
  'Audit-ready',
  'Co-branded',
  'co-branded',
  'Apply to partner',
  'Get partner kit',
  'Logo wall',
  'Partner proof slot',
  'proof placeholder',
  'softer launch evidence',
  'Named partner proof',
  'APPROVED PRODUCT PROOF',
  'Bring document',
  'to every client',
  'Proof for real diligence',
  'Numbers',
  'approved logos and named quotes',
  'Until named logos',
];
const foundForbiddenTerms = forbiddenTerms.filter((term) => builtLandingText.includes(term));
if (foundForbiddenTerms.length) {
  throw new Error(`Forbidden landing terms found: ${foundForbiddenTerms.join(', ')}`);
}

const requiredTerms = [
  'AI documents operations platform',
  'Salesforce',
  'QuickBooks',
  'HubSpot',
  'Stripe',
  'NetSuite',
  'Anrok',
  'DocuSign',
  'Gmail',
  'Mercury',
  'Plaid',
  'Slack',
];
const missingRequiredTerms = requiredTerms.filter((term) => !builtLandingText.includes(term));
if (missingRequiredTerms.length) {
  throw new Error(`Required landing terms missing: ${missingRequiredTerms.join(', ')}`);
}

const contactSubmissions = [];
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (url.pathname === '/api/contact') {
      if (req.method !== 'POST') {
        res.writeHead(405, { allow: 'POST', 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
        return;
      }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      contactSubmissions.push(payload);
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    const routedPath = stripBasePath(url.pathname);
    const rawPath = decodeURIComponent(routedPath === '/' ? '/index.html' : routedPath);
    const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(dist, safePath);

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
const landingUrl = `${origin}${basePath}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const runtimeErrors = [];
const failedRequests = [];

page.on('pageerror', (error) => runtimeErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('favicon.ico')) {
    runtimeErrors.push(message.text());
  }
});
page.on('requestfailed', (request) => failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ''}`));
page.on('response', (response) => {
  if (response.status() >= 400 && !response.url().includes('favicon.ico')) {
    failedRequests.push(`${response.status()} ${response.url()}`);
  }
});

try {
  await page.goto(landingUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForFunction(() => window.THREE && document.querySelector('#stage canvas'), null, { timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector('#scene-label')?.textContent !== 'Loading...', null, { timeout: 10_000 });
  await page.waitForFunction(() => document.querySelector('.logo img')?.complete, null, { timeout: 10_000 });

  const logoBox = await page.locator('.logo img').boundingBox();
  if (!logoBox || logoBox.width < 70 || logoBox.height < 20) {
    throw new Error(`Unexpected logo size: ${JSON.stringify(logoBox)}`);
  }

  const roleState = await page.evaluate(async () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const first = document.documentElement.dataset.indexRoleWord;
    if (!reduced) {
      await new Promise((resolve) => window.setTimeout(resolve, 3400));
    }
    return { reduced, first, second: document.documentElement.dataset.indexRoleWord };
  });
  if (roleState.reduced) {
    if (roleState.first !== 'finance or operations') {
      throw new Error(`Reduced-motion role copy did not use static fallback: ${JSON.stringify(roleState)}`);
    }
  } else if (!['finance', 'operations'].includes(roleState.first ?? '') || !['finance', 'operations'].includes(roleState.second ?? '') || roleState.first === roleState.second) {
    throw new Error(`Role copy did not rotate: ${JSON.stringify(roleState)}`);
  }

  const connectorState = await page.evaluate(async () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const first = document.documentElement.dataset.indexConnector;
    if (!reduced) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
    }
    return { reduced, first, second: document.documentElement.dataset.indexConnector };
  });
  if (!connectorState.first || !requiredTerms.includes(connectorState.first)) {
    throw new Error(`Connector carousel did not expose a known connector: ${JSON.stringify(connectorState)}`);
  }
  if (!connectorState.reduced && connectorState.first === connectorState.second) {
    throw new Error(`Connector carousel did not rotate: ${JSON.stringify(connectorState)}`);
  }

  const canvasBox = await page.locator('#stage canvas').boundingBox();
  if (!canvasBox || canvasBox.width < 1000 || canvasBox.height < 600) {
    throw new Error(`Unexpected canvas size: ${JSON.stringify(canvasBox)}`);
  }

  const expectApplyScene = async (action, source) => {
    await action();
    await page.waitForFunction(() => document.querySelector('#scene-label')?.textContent?.includes('Apply'), null, { timeout: 6_000 });
    const label = await page.locator('#scene-label').textContent();
    if (!label?.includes('Apply')) {
      throw new Error(`Scene 06 not reachable from ${source}: ${label}`);
    }
  };

  await expectApplyScene(
    () => page.locator('.dots button').nth(5).click(),
    'dots',
  );
  await page.evaluate(() => { document.querySelector('#scroll-proxy').scrollTop = 0; });
  await expectApplyScene(
    () => page.locator('.nav .btn.solid[data-go="5"][data-open-partner-form]').click(),
    'nav CTA',
  );
  await page.waitForFunction(() => !document.querySelector('#partner-form-modal')?.hidden, null, { timeout: 3_000 });
  const submitVisibleFromFirstClick = await page.locator('.partner-form-submit').evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight;
  });
  if (!submitVisibleFromFirstClick) {
    throw new Error('Partner submit CTA is not visible after the first nav CTA click');
  }
  await page.fill('#partner-name', 'Test Partner');
  await page.fill('#partner-email', 'partner@example.com');
  await page.fill('#partner-company', 'Example Advisory');
  await page.selectOption('#partner-type', 'solution_partner');
  await page.selectOption('#partner-volume', '3_5_per_quarter');
  await page.fill('#partner-details', 'Testing partner capture for Google Form handoff with NetSuite and AP invoice match details.');
  await page.click('.partner-form-submit');
  try {
    await page.waitForFunction(() => document.querySelector('#partner-form-status')?.dataset.state === 'success', null, { timeout: 3_000 });
  } catch (error) {
    const status = await page.locator('#partner-form-status').evaluate((el) => ({
      text: el.textContent,
      state: el.dataset.state,
    }));
    throw new Error(
      [
        `Partner form did not reach success state: ${JSON.stringify(status)}`,
        `Failed requests: ${failedRequests.join(' | ') || 'none'}`,
        `Runtime errors: ${runtimeErrors.join(' | ') || 'none'}`,
        `Contact submissions: ${JSON.stringify(contactSubmissions)}`,
      ].join('\n'),
      { cause: error },
    );
  }
  const capturedLead = contactSubmissions.at(-1);
  if (
    capturedLead?.email !== 'partner@example.com'
    || capturedLead?.partner_type !== 'solution_partner'
    || !capturedLead?.details?.includes('NetSuite')
    || !capturedLead?.page?.startsWith(landingUrl)
  ) {
    throw new Error(`Partner form did not capture expected details: ${JSON.stringify(capturedLead)}`);
  }
  await page.click('[data-close-partner-form]');
  await page.waitForFunction(() => document.querySelector('#partner-form-modal')?.hidden, null, { timeout: 3_000 });
  await page.evaluate(() => { document.querySelector('#scroll-proxy').scrollTop = 0; });
  await expectApplyScene(
    () => page.evaluate(() => {
      const proxy = document.querySelector('#scroll-proxy');
      proxy.scrollTop = proxy.scrollHeight;
    }),
    'scroll',
  );

  await page.locator('.dots button').nth(3).click();
  await page.waitForFunction(() => document.querySelector('#scene-label')?.textContent?.includes('Proof'), null, { timeout: 6_000 });
  await page.waitForTimeout(1_500);
  await page.mouse.click(250, 520);
  await page.waitForFunction(() => !document.querySelector('#proof-viewer-modal')?.hidden, null, { timeout: 3_000 });
  const proofViewerState = await page.evaluate(() => ({
    title: document.querySelector('#proof-viewer-title')?.textContent,
    media: document.querySelector('#proof-viewer-media')?.style.backgroundImage,
  }));
  if (!proofViewerState.title || !proofViewerState.media?.includes('/assets/product/')) {
    throw new Error(`Proof viewer did not open with a product visual: ${JSON.stringify(proofViewerState)}`);
  }
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('#proof-viewer-modal')?.hidden, null, { timeout: 3_000 });
  await page.locator('.dots button').nth(5).click();
  await page.waitForFunction(() => document.querySelector('#scene-label')?.textContent?.includes('Apply'), null, { timeout: 6_000 });
  await page.mouse.click(720, 450);
  await page.waitForFunction(() => !document.querySelector('#partner-form-modal')?.hidden, null, { timeout: 3_000 });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('#partner-form-modal')?.hidden, null, { timeout: 3_000 });

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (hasOverflow) {
    throw new Error('Horizontal overflow detected');
  }

  if (failedRequests.length) {
    throw new Error(`Failed browser requests:\n${failedRequests.join('\n')}`);
  }

  if (runtimeErrors.length) {
    throw new Error(`Browser runtime errors:\n${runtimeErrors.join('\n')}`);
  }

  console.log(`Smoke passed: ${landingUrl}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
