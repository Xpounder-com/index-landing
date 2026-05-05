import { defineConfig } from 'vite';

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.index.app').replace(/\/+$/, '');

export default defineConfig({
  plugins: [
    {
      name: 'index-site-url',
      transformIndexHtml(html) {
        return html.replaceAll('%SITE_URL%', siteUrl);
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 750,
  },
});
