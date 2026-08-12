import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist-static");

const sourceFiles = [
  "index.html",
  "404.html",
  "service-detail.html",
  "styles.css",
  "scripts.js",
  "service-detail.js",
  "service-data.js",
];

async function read(relativePath, base = root) {
  return readFile(path.join(base, relativePath), "utf8");
}

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)));
    } else {
      files.push(relativePath);
    }
  }

  return files.sort();
}

test("build copies every static source and public asset", async () => {
  for (const file of sourceFiles) {
    assert.equal(await read(file, output), await read(file));
  }

  assert.deepEqual(
    await listFiles(path.join(output, "public")),
    await listFiles(path.join(root, "public")),
  );

  const cleanDetailPage = await read("service-detail/index.html", output);
  assert.match(cleanDetailPage, /<base href="\.\.\/" \/>/);
  assert.match(cleanDetailPage, /<script src="service-detail\.js"><\/script>/);
});

test("homepage and detail template keep their required content and scripts", async () => {
  const [homepage, detailPage, notFoundPage] = await Promise.all([
    read("index.html"),
    read("service-detail.html"),
    read("404.html"),
  ]);

  assert.match(homepage, /Professional Pest Control/);
  assert.match(homepage, /id="services"/);
  assert.match(homepage, /id="booking-process"/);
  assert.match(homepage, /id="cities"/);
  assert.match(homepage, /id="faq"/);
  assert.ok(homepage.indexOf("service-data.js") < homepage.indexOf("scripts.js"));

  assert.match(detailPage, /id="detail-title"/);
  assert.ok(
    detailPage.indexOf("service-data.js") < detailPage.indexOf("service-detail.js"),
  );
  assert.match(notFoundPage, /Page not found/i);
});

test("service catalog has valid unique services and existing local images", async () => {
  const context = { window: {} };
  vm.runInNewContext(await read("service-data.js"), context);

  const catalog = context.window.serviceCatalog;
  assert.ok(Array.isArray(catalog?.categories));
  assert.equal(catalog.categories.length, 4);
  assert.equal(catalog.allServices.length, 16);

  const slugs = catalog.allServices.map((service) => service.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const service of catalog.allServices) {
    assert.ok(service.slug);
    assert.ok(service.title);
    assert.ok(service.summary);

    for (const image of [service.image, service.detailImage].filter(Boolean)) {
      if (/^https?:\/\//.test(image)) continue;
      await access(path.join(root, image));
    }
  }
});

test("built HTML contains no broken local file references", async () => {
  for (const htmlFile of ["index.html", "service-detail.html", "404.html"]) {
    const html = await read(htmlFile, output);
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
      (match) => match[1],
    );

    for (const reference of references) {
      if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;

      const relativePath = reference.split(/[?#]/, 1)[0];
      if (!relativePath) continue;
      await access(path.join(output, relativePath));
    }
  }
});
