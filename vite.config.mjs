import { defineConfig } from 'vite';

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.index.app').replace(/\/+$/, '');
const normalizeBasePath = (value) => {
  if (!value || value === '/') return '/';
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};
const basePath = normalizeBasePath(process.env.VITE_BASE || '/');

export default defineConfig({
  base: basePath,
  plugins: [
    {
      name: 'index-deploy-paths',
      transformIndexHtml(html) {
        return html
          .replaceAll('%SITE_URL%', siteUrl)
          .replaceAll('%BASE_URL%', basePath);
      },
    },
    {
      name: 'index-contact-api-dev',
      configureServer(server) {
        server.middlewares.use('/api/contact', async (req, res) => {
          const { default: handler } = await import('./api/contact.js');
          await handler(req, res);
        });
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 750,
  },
});
