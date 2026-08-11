import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Qatar pest control hero", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Professional Pest Control &amp; Cleaning Services in Qatar/);
  assert.match(html, /One trusted team for pest treatments, deep cleaning/);
  assert.match(html, /Same-day and 24\/7 booking support/);
  assert.match(html, /\/hero-floor-care\.jpg/);
  assert.match(html, /\/services\/villa-cleaning/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|SkeletonPreview/);
});

test("server-renders the matching villa-cleaning hero", async () => {
  const response = await render("/services/villa-cleaning");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Villa Cleaning in Qatar \| Al Safa Hygiene<\/title>/i);
  assert.match(html, /Complete interior cleaning for villas/);
  assert.match(html, /Room-by-room care/);
  assert.match(html, /\/villa-cleaning-pexels\.jpg/);
  assert.match(html, /Request a cleaning quote/);
});

test("keeps the shared hero styling and local assets wired", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const highlights/);
  assert.match(page, /\/alsafa_logo_cutout\.png/);
  assert.match(layout, /Manrope/);
  assert.match(css, /\.home-hero/);
  assert.match(css, /\.villa-hero/);
  assert.match(css, /--navy:\s*#031a3d/);
  assert.match(css, /--blue:\s*#25b2ff/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
