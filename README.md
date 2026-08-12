# Qatar Pest Control Website

A dependency-free static website for pest control and cleaning services in
Qatar.

## Project structure

- `html/` — homepage, service detail template, and not-found page.
- `js/` — service data and browser behavior.
- `css/` — shared responsive styling.
- `public/` — images and icons used by the website.
- `scripts/buildStatic.sh` — creates the deployable `distStatic/` directory.
- `tests/staticSite.test.mjs` — dependency-free build and integrity tests.

## Commands

```bash
bash scripts/buildStatic.sh
node --check js/scripts.js
node --check js/serviceData.js
node --check js/serviceDetail.js
node --test tests/staticSite.test.mjs
```

No dependency installation or package manager is required. The build uses Bash
and the tests use Node.js built-ins.

## Deployment

Vercel runs `scripts/buildStatic.sh` and publishes `distStatic/`. Do not edit
generated files in that directory; edit files in
`html/`, `js/`, `css/`, or `public/` and rebuild.

Service cards link to URLs such as:

```text
service-detail?service=villa-cleaning
```

To add or change a service, update `js/serviceData.js`. Keep local images under
`public/` and add the source of externally sourced imagery below.

## Image sources and licensing

The service showcase uses images from Pexels under the
[Pexels license](https://www.pexels.com/license/), which permits free website
use and modification. The links below preserve the original source pages and
photographer information.

### Cleaning services

- [Villa Cleaning](https://www.pexels.com/photo/happy-middle-aged-housewife-doing-house-cleaning-at-home-3768914/)
- [Apartment Cleaning](https://www.pexels.com/photo/a-woman-cleaning-a-house-8055198/)
- [Majlis Cleaning](https://www.pexels.com/photo/cleaner-vacuuming-a-sofa-chair-4401538/)
- [Deep Cleaning](https://www.pexels.com/photo/cleaning-supplies-3616735/)

### Specialised cleaning

- [Sofa Cleaning](https://www.pexels.com/photo/efficient-sofa-cleaning-with-handheld-vacuum-30238384/)
- [Carpet Cleaning](https://www.pexels.com/photo/worker-cleaning-carpet-with-brush-in-outdoor-setting-32155482/)
- [Mattress Cleaning](https://www.pexels.com/photo/cleaning-service-worker-vacuuming-the-house-14675103/)
- [Water Tank Cleaning](https://www.pexels.com/photo/water-tanks-on-a-rooftop-25823811/)

### Marble and floor care

- [Marble Polishing](https://www.pexels.com/photo/marble-flooring-inside-a-building-14613453/)
- [Marble Restoration](https://www.pexels.com/photo/craftsmen-cutting-stone-14225905/)
- [Granite Polishing](https://www.pexels.com/photo/industrial-granite-cutting-machine-in-workshop-30112373/)
- [Marble Stain Removal](https://www.pexels.com/photo/wiping-a-marble-top-surface-with-cleaning-cloth-4440535/)

### Pest control

- [Residential Pest Control](https://www.pexels.com/photo/a-woman-fumigating-while-wearing-a-personal-protective-equipment-4176415/)
- [Commercial Pest Control](https://www.pexels.com/photo/professional-fumigation-in-warehouse-setting-32055757/)
- [Cockroach Control](https://www.pexels.com/photo/close-up-shot-of-a-cockroach-6526933/)
- [Restaurants and Cafes](https://www.pexels.com/photo/people-working-in-restaurant-kitchen-15441279/)
