// Regenerates registry.json and registry/ from the live registry at soundza.com/r.
// Usage: node scripts/sync.mjs [base-url]   (default https://soundza.com)
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname } from "node:path";

const base = (process.argv[2] ?? "https://soundza.com").replace(/\/$/, "");
const fix = (text) => text.replaceAll(base, "https://soundza.com");
const get = async (path) => {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return JSON.parse(fix(await res.text()));
};

const index = await get("/r/registry.json");
await rm("registry", { recursive: true, force: true });
for (const { name } of index.items) {
  const item = await get(`/r/${name}.json`);
  for (const file of item.files) {
    await mkdir(dirname(file.path), { recursive: true });
    await writeFile(file.path, file.content);
  }
}
await writeFile("registry.json", `${JSON.stringify(index, null, 2)}\n`);
console.log(`${index.items.length} items`);
