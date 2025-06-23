# Deployment Guide

This project is served using Bun's static server. Ensure the following files are present at the repository root when deploying:

* `_headers` – adds security headers and explicit MIME types.
* `_redirects` – rewrites all SPA routes to `index.html`.
* `ci/verify-assets.sh` – CI job that checks built assets size before upload.

Example deployment steps:

```bash
npm run build
npm run ci:verify-assets
bun run serve ./dist
```

If pages still display blank screens, clear old service workers with:

```bash
navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
```

