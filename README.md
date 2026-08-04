# Qatar Pest Control Website

This repository contains two site surfaces:

- A static marketing site powered by `index.html`, `service-detail.html`,
  `styles.css`, and the files under `public/`.
- A separate Vinext/Cloudflare app under `app/` and `worker/`.

For deployment to Vercel or GitHub Pages, use the static site output only.

## Static deployment target

Run the static build:

```bash
bash ./scripts/build-static.sh
```

If you already have Node and npm available, you can also run:

```bash
npm run build:static
```

This generates `dist-static/`, which is the deployable artifact for:

- Vercel via [`vercel.json`](vercel.json)
- GitHub Pages via
  [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)

The static output includes:

- `index.html`
- `service-detail.html`
- `service-detail/index.html` for clean service detail URLs
- `404.html`
- CSS and JavaScript assets
- the full `public/` directory
- `.nojekyll` for GitHub Pages

## Vercel

Vercel is configured to:

- treat the project as `Other`
- skip dependency installation
- run `bash ./scripts/build-static.sh`
- publish `dist-static/`

You can import the repo directly in Vercel without changing the build settings.

## GitHub Pages

The GitHub Actions workflow builds `dist-static/` and deploys that folder to
GitHub Pages on pushes to the repository default branch. It can also be run
manually from the Actions tab.

## Notes

- Static page links are relative, so the site works both at a root domain and
  under a GitHub Pages repository path such as
  `https://username.github.io/repository-name/`.
- The Vinext/worker app is still in the repository, but it is not part of the
  Vercel or GitHub Pages deployment flow described above.
