import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const siteUrl = (process.env.VITE_SITE_URL || 'https://www.index.app').replace(/\/+$/, '');
const now = new Date().toISOString();

await mkdir(dist, { recursive: true });

await writeFile(
  join(dist, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n'),
);

await writeFile(
  join(dist, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${siteUrl}/</loc>`,
    `    <lastmod>${now}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n'),
);
