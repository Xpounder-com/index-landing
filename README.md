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
- Environment variable: set `GOOGLE_SHEET_ID` to the destination Google Sheet ID
- Environment variable: set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the service account email that has edit access to the sheet
- Environment variable: set `GOOGLE_PRIVATE_KEY` to the service account private key, preserving escaped `\n` line breaks
- Environment variable: set `VITE_DEMO_URL` to the product login handoff URL, for example `https://ops.your-product-host.com/auth/login?return_to=%2Fportal%3Fjourney%3Dsample`; the app defaults to the current Index product handoff when this is absent
- Optional environment variable: set `DEMO_ACCESS_CODE` to the shared demo code configured on the product app as `IDX_AUTH_ACCESS_CODE` only when the product host reports `access_code_auth_enabled: true`
- Optional environment variable: set `GOOGLE_SHEET_RANGE` to override the default `Leads!A:K`
- Optional environment variable: set `VITE_CONTACT_ENDPOINT` to override the default `/api/contact`
- Cloudflare: add the DNS records shown by Vercel after the custom domain is attached

Before production launch, confirm `VITE_SITE_URL` and `VITE_BASE` match the final path and verify the Vercel preview plus production domain over HTTPS.

See `LAUNCH_CHECKLIST.md` for the push, Vercel, Cloudflare, and verification checklist.

## Google Sheets Capture

The partner form and demo access form submit to `/api/contact`, which appends one row per lead to Google Sheets from a Vercel serverless function. Keep Google credentials and any optional `DEMO_ACCESS_CODE` server-side in Vercel; do not expose a private key in browser environment variables.

Before revealing demo access, `/api/contact` checks the product host derived from `VITE_DEMO_URL` by calling `/auth/me`. If the product supports access-code sign-in, the landing page reveals the configured code. If the product supports Google or another local product login, the landing page records access and opens the product login handoff without showing a code.

Create a sheet tab named `Leads` with these columns:

```text
Submitted At | Name | Email | Company | Partner Type | Client Volume | Details | Source | Page | Referrer | User Agent
```

Setup steps:

1. Enable the Google Sheets API in the Google Cloud project.
2. Create a Google Cloud service account and generate a JSON key.
3. Share the destination Google Sheet with the service account email as an editor.
4. Add `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in Vercel.
5. Deploy and submit the partner form from the preview URL.

For self-serve demo access, configure the product app separately:

```sh
IDX_AUTH_SESSION_SECRET=...
IDX_AUTH_ACCESS_CODE=...
IDX_V3_WORKSPACE_DEFAULT_ROLE=viewer
# Keep IDX_AUTH_DEV_BYPASS unset in production.
```
