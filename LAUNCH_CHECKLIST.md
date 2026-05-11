# Index Partner Landing Launch Checklist

## Before Push

- Set `VITE_SITE_URL` to `https://www.neuralint.io/idx` in Vercel and confirm the generated canonical, Open Graph, Twitter, robots, and sitemap URLs use it.
- Set `VITE_BASE` to `/idx/` in Vercel and confirm scripts, styles, images, and favicon load under `/idx/`.
- Enable the Google Sheets API, set `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in Vercel, then share the lead sheet with the service account email.
- Set `VITE_DEMO_URL` to the product login handoff URL, not a direct portal URL. Use `/auth/login?return_to=...` so the workspace access-code screen appears before the portal.
- If using access-code sign-in, set `DEMO_ACCESS_CODE` to the shared product access code and configure matching `IDX_AUTH_ACCESS_CODE` in the product app.
- Confirm the product app's `/auth/me` response for the demo return target reports either `access_code_auth_enabled: true` or another enabled product login method such as Google sign-in.
- Keep `IDX Landing.html` mirrored from `index.html` if you still want the local snapshot under the legacy filename.
- Confirm the seven product screenshots in `public/assets/product/` are approved for public use.
- Add final partner logos, named testimonials, or case-study evidence only when approved.
- Confirm historical prototype files remain local-only and are not emitted to `dist/`.

## GitHub And Vercel

- Push this repo to the target GitHub organization.
- Import the repo into Vercel as a Vite/static project.
- Set build command to `npm run build`.
- Set output directory to `dist`.
- Use `main` as the production branch.

## Cloudflare Domain

- Add the `www` domain to the Vercel project and make it primary.
- Add the exact Cloudflare DNS records shown by Vercel.
- Redirect the apex domain to the `www` domain.
- Wait for Vercel HTTPS verification to finish.

## Verification

- Run `npm run build`.
- Run `npm run smoke`.
- Check desktop, tablet, and mobile.
- Confirm `dist/` contains only the landing route, Vite assets, public assets, `robots.txt`, and `sitemap.xml`.
- Verify scene 06 is reachable by scroll, dots, and nav.
- Verify `Start application` opens the partner form and appends email plus partner details to Google Sheets.
- Verify `Try live demo` captures a work email, reveals the workspace access code when access-code sign-in is enabled, stores local demo access state, and opens the configured product login URL.
- Verify the configured product login page accepts the active sign-in method and lands in `/portal?journey=sample`.
- Verify proof cards open the high-quality product preview viewer.
- Verify connector names and logos rotate through the approved connector list.
- Verify all product images load with no console errors or failed requests.
- Verify no `example.com`, visible placeholder copy, pricing language, or legacy prototype route is present in production output.
- Verify `https://www.neuralint.io/idx/` loads and `https://www.neuralint.io/idx/assets/...` asset requests return `200`.
