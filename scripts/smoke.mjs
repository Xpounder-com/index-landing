import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
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
  '.webp': 'image/webp',
};

await access(join(dist, 'index.html'));

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const rawPath = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const runtimeErrors = [];

page.on('pageerror', (error) => runtimeErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('favicon.ico')) {
    runtimeErrors.push(message.text());
  }
});

try {
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForFunction(() => window.THREE && document.querySelector('#stage canvas'), null, { timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector('#scene-label')?.textContent !== 'Loading...', null, { timeout: 10_000 });

  const canvasBox = await page.locator('#stage canvas').boundingBox();
  if (!canvasBox || canvasBox.width < 1000 || canvasBox.height < 600) {
    throw new Error(`Unexpected canvas size: ${JSON.stringify(canvasBox)}`);
  }

  if (runtimeErrors.length) {
    throw new Error(`Browser runtime errors:\n${runtimeErrors.join('\n')}`);
  }

  console.log(`Smoke passed: ${origin}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
