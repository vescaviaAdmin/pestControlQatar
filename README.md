# Qatar Pest Control Website

A dependency-free static website for pest control and cleaning services in
Qatar.

## Project structure

- `index.html` — homepage content.
- `service-detail.html` — shared service detail template.
- `service-data.js` — service categories and service content.
- `scripts.js` — homepage navigation, tabs, sliders, and responsive behavior.
- `service-detail.js` — fills the detail template from `?service=<slug>`.
- `styles.css` — shared responsive styling.
- `404.html` — not-found page.
- `public/` — images and icons used by the website.
- `scripts/build-static.sh` — creates the deployable `dist-static/` directory.
- `tests/static-site.test.mjs` — dependency-free build and integrity tests.

## Commands

```bash
npm run build
npm test
```

No dependency installation is required. The build uses Bash and the tests use
Node.js built-ins.

## Deployment

Vercel and GitHub Pages both run `scripts/build-static.sh` and publish
`dist-static/`. Do not edit generated files in that directory; edit the source
files in the repository root and rebuild.

Service cards link to URLs such as:

```text
service-detail?service=villa-cleaning
```

To add or change a service, update `service-data.js`. Keep local images under
`public/` and record externally sourced service imagery in
`SERVICE_IMAGE_SOURCES.md`.
