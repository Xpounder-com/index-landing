# Index Landing

Static Index landing page and wireframe prototypes.

## Local Development

```sh
npm install
npm run dev
```

Open the printed local URL. The main landing page is served from `/`.

Useful project pages:

- `/` - current landing page
- `/IDX Landing.html` - source landing page snapshot, kept under the legacy filename for local review
- `/IDX Landing v1.html` - earlier landing page snapshot, kept local only
- `/IDX Wireframes.html` - interactive wireframe canvas, kept local only
- `/IDX Wireframes v2.html` - generated wireframe bundle, kept local only
- `/IDX Wireframes v2-print.html` - print layout, kept local only

## Build And Smoke Test

```sh
npm run build
npm run smoke
```

The build output is written to `dist/`.

Only the production landing route, Vite assets, public assets, `robots.txt`, and `sitemap.xml` are emitted to `dist/`. Historical prototype files stay in the repo for local review and are not shipped by the production build.

## Vercel Deployment

Import this repo into the GitHub organization, then connect it to Vercel as a Vite/static project.

- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- Canonical domain: use `www` as primary and redirect the apex domain to `www`
- Environment variable: set `VITE_SITE_URL` to the final production origin, for example `https://www.neuralint.io/idx`
- Environment variable: set `VITE_BASE` to the deployment path, for example `/idx/`
- Cloudflare: add the DNS records shown by Vercel after the custom domain is attached

Before production launch, confirm `VITE_SITE_URL` and `VITE_BASE` match the final path and verify the Vercel preview plus production domain over HTTPS.

See `LAUNCH_CHECKLIST.md` for the push, Vercel, Cloudflare, and verification checklist.
