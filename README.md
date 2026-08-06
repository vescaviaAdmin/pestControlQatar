# Qatar Pest Control Website

This README is the project map. If someone needs to understand the code later,
start here before reading individual files.

## What this project is

This repo contains a Qatar pest control and cleaning services website with two
separate surfaces:

- **Primary deployable website:** the static HTML/CSS/JS site in the repository
  root. This is what Vercel and GitHub Pages publish.
- **Secondary Vinext/Cloudflare app:** the Next/Vinext app under `app/` plus the
  worker/runtime files. It is still present and tested, but it is not the main
  static deployment path.

For normal customer website edits, work on the static files first.

## Primary Static Site

These are the important public website files:

- `index.html` - homepage markup. Contains the hero, service tabs shell,
  booking process, service cities, why-us section, FAQ, footer, and mobile CTA.
- `service-detail.html` - reusable service detail page template. Content is
  filled from the service catalog based on the `?service=` query string.
- `service-data.js` - central service catalog. Add or edit service categories,
  service cards, detail copy, images, badges, facts, includes, spotlight text,
  and service steps here.
- `scripts.js` - homepage behavior. Handles sticky header scroll state, smooth
  anchor scrolling, service tab state, and rendering service cards from
  `window.serviceCatalog`.
- `service-detail.js` - service detail behavior. Reads `?service=slug`, finds
  that service in `window.serviceCatalog.allServices`, and updates the detail
  page DOM.
- `styles.css` - all styling for the static site, including responsive layout,
  service cards, city coverage, detail page, 404 page shared button styles, and
  mobile bottom CTA.
- `404.html` - static not-found page.
- `public/` - image and SVG assets used by both static and app surfaces.

The static site uses relative links and asset paths so it can work at a root
domain or under a GitHub Pages repository path.

## Static Routing

Main routes:

- `index.html` - homepage.
- `service-detail.html?service=villa-cleaning` - detail page with query string.
- `service-detail?service=villa-cleaning` - clean URL style used by homepage
  cards and supported by the static build.
- `404.html` - fallback page.

`scripts/build-static.sh` creates `dist-static/service-detail/index.html` with a
`<base href="../" />` tag so clean service-detail URLs can still find shared
assets.

## How To Change Common Things

- **Homepage text or section order:** edit `index.html`.
- **Service list, tab content, or detail content:** edit `service-data.js`.
- **Service card rendering behavior:** edit `scripts.js`.
- **Detail page layout placeholders:** edit `service-detail.html`.
- **Detail page data binding:** edit `service-detail.js`.
- **Colors, spacing, responsive behavior, cards, mobile CTA:** edit
  `styles.css`.
- **Phone/email/contact placeholders:** currently appear in `index.html`,
  `service-detail.html`, and the footer/mobile CTA.
- **Images:** put local assets under `public/` and reference them with paths like
  `public/service-showcase/example.png` in static HTML/JS.

## Build And Deployment

Build the deployable static site:

```bash
npm run build:static
```

or directly:

```bash
bash ./scripts/build-static.sh
```

This generates `dist-static/`, containing:

- copied static HTML, CSS, and JS files
- copied `public/` assets
- `service-detail/index.html` for clean detail URLs
- `.nojekyll` for GitHub Pages

### Vercel

`vercel.json` is configured to:

- use no framework preset
- skip dependency installation
- run `bash ./scripts/build-static.sh`
- publish `dist-static/`
- enable clean URLs

### GitHub Pages

`.github/workflows/deploy-pages.yml` builds `dist-static/` and deploys it to
GitHub Pages on pushes to the repository default branch. It can also be run
manually from the Actions tab.

## Vinext / Cloudflare Side

These files belong to the secondary app/runtime path:

- `app/page.tsx` - simple React/Next homepage matching the original Figma-style
  hero surface.
- `app/layout.tsx` - root layout, Manrope font setup, metadata, favicon.
- `app/globals.css` - styling for the Vinext/Next page only.
- `worker/index.ts` - Cloudflare Worker entry point. It delegates normal
  requests to Vinext and handles `/_vinext/image` optimization.
- `vite.config.ts` - Vinext/Vite/Cloudflare setup. Reads `.openai/hosting.json`
  for optional D1/R2 bindings.
- `build/sites-vite-plugin.ts` - copies `.openai/hosting.json` and `drizzle/`
  metadata into `dist/.openai` after Vinext builds.

Package scripts related to this side:

```bash
npm run dev
npm run build
npm run start
npm test
```

These require Node `>=22.13.0`. They are not the static deployment path.

## Database

Drizzle is wired but intentionally empty:

- `db/schema.ts` exports no tables yet.
- `db/index.ts` creates a Drizzle D1 client from Cloudflare binding `DB`.
- `drizzle.config.ts` outputs migrations to `drizzle/`.
- `.openai/hosting.json` currently has `d1: null` and `r2: null`.
- `examples/d1/` contains optional example D1 code and is not active site code.

Only add database tables when the site actually needs persistent data.

## Tests And Quality Checks

Available scripts:

```bash
npm test
npm run lint
npm run db:generate
```

Notes:

- `npm test` runs `npm run build` first, then executes
  `tests/rendered-html.test.mjs`.
- The current test validates the Vinext server-rendered hero and checks that
  Figma-matched app styling/assets remain wired.
- There is no dedicated automated test for the static HTML build beyond the
  build script itself.

## Generated Or Ignored Folders

Do not treat these as source files:

- `node_modules/`
- `dist/`
- `dist-static/`
- `.next/`
- `.vinext/`
- `.wrangler/`
- `coverage/`

They are ignored or generated outputs.

## Important Gotchas

- The static site is the public deployment target, even though the package name
  and scripts are Vinext-based.
- Service cards and detail pages depend on `window.serviceCatalog`; load
  `service-data.js` before `scripts.js` and `service-detail.js`.
- The service detail page falls back to the first service if a slug is missing
  or unknown.
- Some city/why-us imagery in `index.html` uses remote Wikimedia/Pexels URLs;
  local service images live under `public/`.
- Keep static links relative unless changing the deployment strategy.
- `dist-static/` should be regenerated, not manually edited.
