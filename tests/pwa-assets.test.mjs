import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("manifest is installable and portrait-first", async () => {
  const manifest = JSON.parse(await readFile(new URL("public/manifest.json", root), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "portrait");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.ok(manifest.theme_color);
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  await Promise.all(manifest.icons.map((icon) => access(new URL(`public${icon.src}`, root))));
  await access(new URL("public/icons/apple-touch-icon.png", root));
});

test("service worker provides cache updates and offline navigation", async () => {
  const worker = await readFile(new URL("public/sw.js", root), "utf8");
  assert.match(worker, /addEventListener\("install"/);
  assert.match(worker, /addEventListener\("activate"/);
  assert.match(worker, /addEventListener\("fetch"/);
  assert.match(worker, /SKIP_WAITING/);
  assert.match(worker, /await self\.skipWaiting\(\)/);
  assert.match(worker, /cosmo-quest-v11/);
  assert.match(worker, /caches\.match\("\/offline\.html"\)/);
  await access(new URL("public/offline.html", root));
});
