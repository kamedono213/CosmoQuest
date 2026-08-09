import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const contentRoot = new URL("../content/", import.meta.url);

async function loadContentFiles() {
  const names = (await readdir(contentRoot)).filter((name) => name.endsWith(".json"));
  return Promise.all(names.map(async (name) => ({ name, value: JSON.parse(await readFile(new URL(name, contentRoot), "utf8")) })));
}

test("all content JSON files parse and item IDs stay unique", async () => {
  const files = await loadContentFiles();
  for (const { name, value } of files) {
    const ids = new Set();
    for (const item of Array.isArray(value.items) ? value.items : []) {
      if (typeof item.id !== "string") continue;
      assert.equal(ids.has(item.id), false, `duplicate item id ${item.id} in ${name}`);
      ids.add(item.id);
    }
  }
  assert.ok(files.length > 0);
});

test("POLARIS-0142 includes complete lesson and quiz data", async () => {
  const pack = JSON.parse(await readFile(new URL("pack009-topics-0136-0137.json", contentRoot), "utf8"));
  const topic = pack.items.find((item) => item.id === "POLARIS-0142");
  assert.ok(topic, "POLARIS-0142 is missing");
  assert.equal(topic.questions.length, 5);
  assert.equal(topic.points.length, 5);
  assert.equal(topic.stage, "star");
  assert.equal(topic.class, "恒星物理(こうせいぶつり)");
  assert.ok(topic.body.includes("核融合(かくゆうごう)"));
  assert.ok(topic.sources.includes("https://science.nasa.gov/sun/"));
  for (const question of topic.questions) {
    assert.equal(question.options.length, 4);
    assert.ok(Number.isInteger(question.correct));
    assert.ok(question.correct >= 0 && question.correct < question.options.length);
  }
});
