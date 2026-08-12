# Qatar Pest Control Website

A dependency-free static website for pest control and cleaning services in
Qatar.

## Project structure

- `html/` — homepage, service detail template, and not-found page.
- `js/` — service data and browser behavior.
- `css/` — shared responsive styling.
- `public/` — images and icons used by the website.
- `scripts/build-static.sh` — creates the deployable `dist-static/` directory.
- `tests/static-site.test.mjs` — dependency-free build and integrity tests.

## Commands

```bash
bash scripts/build-static.sh
node --check js/scripts.js
node --check js/service-data.js
node --check js/service-detail.js
node --test tests/static-site.test.mjs
```

No dependency installation or package manager is required. The build uses Bash
and the tests use Node.js built-ins.

## Deployment

Vercel and GitHub Pages both run `scripts/build-static.sh` and publish
`dist-static/`. Do not edit generated files in that directory; edit files in
`html/`, `js/`, `css/`, or `public/` and rebuild.

Service cards link to URLs such as:

```text
service-detail?service=villa-cleaning
```

To add or change a service, update `js/service-data.js`. Keep local images under
`public/` and record externally sourced service imagery in
`SERVICE_IMAGE_SOURCES.md`.
