import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /<title>Qatar Pest Control<\/title>/i);
  assert.match(html, /Qatar(?:’|&rsquo;|&#x27;)s Trusted Pest Control Experts/);
  assert.match(html, /Delivering safe, effective, and professional pest management/);
  assert.match(html, /Providing top class services in:/);
  assert.match(html, /Al Wakrah/);
  assert.match(html, /\/figma-assets\/image-5\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|SkeletonPreview/);
});

test("keeps the Figma-matched styling and local assets wired", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const serviceAreas/);
  assert.match(page, /\/figma-assets\/logo\.png/);
  assert.match(layout, /Manrope/);
  assert.match(css, /max-width:\s*1280px/);
  assert.match(css, /min-height:\s*832px/);
  assert.match(css, /--brand:\s*#052253/);
  assert.match(css, /--accent:\s*#1199ef/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
