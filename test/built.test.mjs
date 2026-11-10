import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the deployed document includes the catalog before JavaScript runs", async () => {
  const html = await readFile(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );
  const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  for (const repository of [
    "Zxilly/cjv",
    "cjbind/cjbind",
    "Zxilly/windows-cj",
  ]) {
    assert.ok(document.includes(`href="https://github.com/${repository}"`));
  }
  assert.match(document, /仓颉 SDK/);
  assert.match(document, /rel="canonical" href="https:\/\/cj\.zxilly\.com\/"/);
  assert.equal(
    (html.match(/src="https:\/\/trail\.learningman\.top\/script\.js"/g) || [])
      .length,
    1,
  );
  assert.match(html, /data-domains="cj\.zxilly\.com"/);
  assert.match(html, /data-exclude-search="true"/);
  assert.match(
    await readFile(
      new URL("../dist/client/sitemap.xml", import.meta.url),
      "utf8",
    ),
    /<loc>https:\/\/cj\.zxilly\.com\/<\/loc>/,
  );
});
