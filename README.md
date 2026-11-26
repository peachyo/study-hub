# Study Hub

A static study site with GitHub-style styling (Primer design tokens, vendored in `vendor/primer.css`).
No build step; it deploys as-is to Cloudflare Pages.

## Run locally
    python3 -m http.server 8000
Then open http://localhost:8000

## Deploy to Cloudflare Pages
    npx wrangler pages deploy . --project-name=study-hub

## Subjects
Subjects live in `subjects/*.js` and are listed by a `<script>` tag in `index.html`.
Each subject's images are in `subjects/<id>/`.

## Custom domain (oncase.ai)
1. Deploy the project (command above).
2. In Cloudflare: Workers & Pages → study-hub → Custom domains → add `oncase.ai` (or `www.oncase.ai`).
   The domain must be on Cloudflare DNS; Cloudflare then creates the record for you.

## Branding
- `logo.svg`: full wordmark (light backgrounds).
- `logo-mark.svg`: square mark used in the header.
- `favicon.svg`: browser tab icon.
