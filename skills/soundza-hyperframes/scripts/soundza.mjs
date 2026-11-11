#!/usr/bin/env node
/**
 * Soundza helper for HyperFrames projects. No dependencies; Node 18+.
 * Run it from the HyperFrames project's root (where index.html is).
 *
 *   node soundza.mjs kit list                       The 250 CC0 SoundKit sounds (no key)
 *   node soundza.mjs kit <kit-name> --name <slot>   Download one of them (no key)
 *   node soundza.mjs signin
 *   node soundza.mjs search "<words>" [--type sound_effect] [--good-for transition] [--max-duration 2] ...
 *   node soundza.mjs add <id> --name <slot> [--dir assets/sounds]
 *   node soundza.mjs place <slot> --at <seconds> [--volume 0.6]
 *   node soundza.mjs bed <slot> --length <seconds> [--volume 0.25]
 *   node soundza.mjs list
 *   node soundza.mjs removals
 *
 * `kit` and `add` save the file once under assets/sounds/, and record it in
 * assets/sounds/soundza-sounds.json (id, file, duration, sync_ms, attribution)
 * and CREDITS.md. `place` and `bed` print the <audio> elements to paste, with
 * each sound's hit already lined up. The key is only needed for search and add,
 * never at render time.
 */
import { existsSync, readFileSync } from "node:fs";
import { appendFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const API = process.env.SOUNDZA_API_URL ?? "https://api.soundza.com/v1";
const SITE = process.env.SOUNDZA_SITE_URL ?? "https://soundza.com";
const CACHE = ".soundza/search-results.json";
const KIT_CACHE = ".soundza/soundkit.json";
const DIR = "assets/sounds";
const MANIFEST = `${DIR}/soundza-sounds.json`;
const CREDITS = "CREDITS.md";

const [command, ...rest] = process.argv.slice(2);
const { positional, flags } = parseArgs(rest);

const commands = { kit, signin, search, generate, add, place, bed, list, removals, help };
await (commands[command] ?? help)();

// ---------------------------------------------------------------- commands

async function help() {
  console.log(`Usage:
  node soundza.mjs kit list [--group <words>]  The 250 CC0 SoundKit sounds, no key needed
  node soundza.mjs kit <kit-name> --name <slot>
                                               Download one into assets/sounds/<slot>.<ext> (no key), record it
  node soundza.mjs signin                      Get a free key (one click for the human), saved to .env
  node soundza.mjs search "<words>" [flags]    Find sounds; prints id, length, sync point and a preview link
      --type sound_effect|music|ambience  --good-for transition,reveal,...  --category SWOOSHES
      --min-duration N  --max-duration N  --fit N (seconds to fill)  --mood warm,cinematic
      --vocals none  --parts full_mix  --form loop  --per-page 10
  node soundza.mjs generate "<prompt>" [--duration 2] [--takes 2]
                                               Nothing fits? Make it with AI (free, ~10 s); add a take by its id
  node soundza.mjs add <id> --name <slot>      Download once into assets/sounds/<slot>.<ext>, record it
  node soundza.mjs place <slot> --at <seconds> [--volume 0.6] [--id sfx-title]
                                               Print the <audio> element whose hit lands at <seconds>
  node soundza.mjs bed <slot> --length <seconds> [--volume 0.25]
                                               Print the <audio> element(s) for a music bed under the whole video
  node soundza.mjs list                        Sounds this project uses
  node soundza.mjs removals                    Check whether any of them were removed from Soundza`);
}

async function signin() {
  loadDotEnv();
  if (process.env.SOUNDZA_API_KEY) {
    console.log("SOUNDZA_API_KEY is already set. Nothing to do.");
    return;
  }
  const clientName = flags["client-name"] ?? `HyperFrames project ${path.basename(process.cwd())}`;
  const start = await post("/auth/device", { client_name: clientName });
  console.log(`\nTell the human:\n  Open ${start.verification_uri_complete} and approve code ${start.user_code} (sign in with Google if it asks).\n`);
  console.log(`Waiting for approval (up to ${Math.round(start.expires_in / 60)} minutes)...`);

  let interval = start.interval ?? 5;
  const deadline = Date.now() + start.expires_in * 1000;
  while (Date.now() < deadline) {
    await sleep(interval * 1000);
    const res = await fetch(`${API}/auth/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ device_code: start.device_code }),
    });
    const body = await res.json().catch(() => ({}));
    if (body.access_token) {
      await saveKey(body.access_token);
      console.log("Approved. SOUNDZA_API_KEY saved to .env (and .env is in .gitignore).");
      return;
    }
    if (body.error === "authorization_pending") continue;
    if (body.error === "slow_down") {
      interval = body.interval ?? interval + 5;
      continue;
    }
    fail(`Sign-in stopped: ${body.error ?? res.status}. Run signin again only if the human asks.`);
  }
  fail("The sign-in code expired. Run signin again only if the human asks.");
}

async function search() {
  const key = requireKey();
  const params = new URLSearchParams();
  if (positional[0]) params.set("q", positional[0]);
  const names = {
    type: "type", "good-for": "good_for", category: "category", mood: "mood", vocals: "vocals",
    parts: "parts", form: "form", style: "style", pack: "pack", key: "key",
    "min-duration": "min_duration", "max-duration": "max_duration", fit: "fit_seconds",
    "min-bpm": "min_bpm", "max-bpm": "max_bpm", "per-page": "per_page",
  };
  for (const [flag, param] of Object.entries(names)) {
    if (flags[flag] !== undefined) params.set(param, flags[flag]);
  }
  if (!params.has("per_page")) params.set("per_page", "10");

  const page = await get(`/sounds/search?${params}`, key);
  const results = page.sounds ?? [];

  // Keep each result's download_url (it carries the search_id) so `add` can use it as given.
  const cache = readJson(CACHE, {});
  for (const sound of results) cache[sound.id] = sound;
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(cache));
  await ignore(".soundza/");

  if (page.interpreted_as && Object.keys(page.interpreted_as).length) {
    console.log(`interpreted as: ${JSON.stringify(page.interpreted_as)}`);
  }
  if (page.relaxed_filters?.length) console.log(`relaxed filters: ${JSON.stringify(page.relaxed_filters)}`);
  for (const note of page.notes ?? []) console.log(`note: ${note}`);
  if (results.length === 0) {
    console.log("No results. Soundza doesn't have that sound yet; try other words for it.");
    return;
  }
  console.log(`text match: ${page.text_match ?? "n/a"}\n`);
  for (const s of results) {
    const parts = [
      fmtDuration(s.duration),
      s.sync_ms != null ? `hit at ${s.sync_ms}ms` : null,
      s.loop_seamless ? "seamless loop" : null,
      s.bpm ? `${s.bpm} bpm` : null,
      s.fit ?? null,
      s.good_for?.length ? `good for ${s.good_for.join("/")}` : null,
    ].filter(Boolean);
    console.log(`${s.id}  ${s.title}`);
    console.log(`   ${parts.join(" · ")}`);
    if (s.description) console.log(`   ${truncate(s.description, 160)}`);
    console.log(`   listen: ${s.preview_files?.[0]?.link ?? s.url}`);
  }
  if (page.audition_url) console.log(`\naudition (hear them all on one page, tick the ones you like): ${page.audition_url}`);
}

async function generate() {
  const key = requireKey();
  const prompt = positional[0];
  if (!prompt) fail('Usage: node soundza.mjs generate "<what makes the sound, the material, the action>" [--duration 2] [--takes 2]');
  const body = { prompt };
  if (flags.duration) body.duration_seconds = Number(flags.duration);
  if (flags.takes) body.takes = Number(flags.takes);
  if (flags.seed) body.seed = Number(flags.seed);
  const res = await fetch(`${API}/generations`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 202) await apiFail(res, "/generations");
  let job = await res.json();
  while (job.status === "queued" || job.status === "running") {
    await sleep((job.poll_after_seconds ?? 3) * 1000);
    job = await get(job.poll_url.slice(job.poll_url.indexOf("/generations")), key);
  }
  if (job.status !== "succeeded") fail(`Generation failed: ${job.error?.message ?? job.status}. Try other words.`);

  const cache = readJson(CACHE, {});
  console.log(`AI-generated takes for "${prompt}" (tell the person these are AI-generated):\n`);
  for (const take of job.takes) {
    cache[take.id] = {
      id: take.id,
      title: `${prompt} (take ${take.rank})`,
      file_extension: "wav",
      download_url: take.url,
      duration: take.duration_seconds ?? null,
      sync_ms: null,
      loop_seamless: null,
      url: take.url,
      attribution: `"${prompt}", AI-generated on Soundza (https://soundza.com)`,
    };
    console.log(`${take.id}  take ${take.rank} · ${fmtDuration(take.duration_seconds)}`);
    console.log(`   listen: ${take.preview_url}`);
  }
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(cache));
  await ignore(".soundza/");
  console.log(`\nKeep one with: node soundza.mjs add <id> --name <slot>   (links work for a limited time; add the keeper now)`);
}

async function add() {
  const key = requireKey();
  const id = positional[0];
  const name = flags.name;
  if (!id || !name) fail("Usage: node soundza.mjs add <id> --name <slot>   (slot like whoosh, title-hit, music)");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) fail(`Use a short kebab-case slot name, like "title-hit" (got "${name}").`);
  const dir = flags.dir ?? DIR;

  const manifest = readJson(MANIFEST, {});
  const existing = Object.entries(manifest).find(([, entry]) => entry.id === id);
  if (existing && existsSync(path.join(dir, existing[1].file))) {
    const [otherName, entry] = existing;
    if (otherName !== name) manifest[name] = entry;
    await writeJson(MANIFEST, manifest);
    console.log(`Already downloaded as ${entry.file}; reusing it for "${name}".`);
    printUsage(name, manifest[name]);
    return;
  }

  // Prefer the search result (its download_url carries the search_id); else look the sound up.
  const sound = readJson(CACHE, {})[id] ?? (await get(`/sounds/${encodeURIComponent(id)}`, key));
  const res = await fetch(sound.download_url, { headers: { Authorization: `Bearer ${key}` }, redirect: "follow" });
  if (!res.ok) await apiFail(res, sound.download_url);

  const file = `${name}.${sound.file_extension ?? "wav"}`;
  await mkdir(dir, { recursive: true });
  const old = manifest[name];
  if (old && old.file !== file && !Object.entries(manifest).some(([n, e]) => n !== name && e.file === old.file)) {
    await rm(path.join(dir, old.file), { force: true });
  }
  await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));

  manifest[name] = {
    id: sound.id,
    title: sound.title,
    file,
    duration: sound.duration ?? null,
    sync_ms: sound.sync_ms ?? null,
    loop_seamless: sound.loop_seamless ?? null,
    url: sound.url,
    attribution: sound.attribution,
  };
  await writeJson(MANIFEST, manifest);
  await writeCredits(manifest);
  console.log(`Saved ${path.join(dir, file)} ← "${sound.title}"`);
  printUsage(name, manifest[name]);
}

/** SoundKit: 225 effects and 25 music beds, CC0, downloadable without a key. */
async function kit() {
  const index = await kitIndex();
  const target = positional[0];
  if (!target || target === "list") {
    const group = flags.group?.toLowerCase();
    let shown = 0;
    for (const item of index) {
      const label = item.categories?.[0] ?? "";
      if (group && !label.toLowerCase().includes(group)) continue;
      const m = item.meta ?? {};
      const parts = [fmtDuration(m.durationMs != null ? m.durationMs / 1000 : null), m.syncMs ? `hit at ${m.syncMs}ms` : null, m.loop ? "loop" : null, label]
        .filter(Boolean)
        .join(" · ");
      console.log(`${item.name.padEnd(34)} ${parts}  ${item.title}`);
      shown++;
    }
    if (!shown) console.log(`Nothing in SoundKit matches --group "${flags.group}". Groups: ${[...new Set(index.map((i) => i.categories?.[0]))].join(", ")}`);
    else console.log(`\nListen to them all: ${SITE}/soundkit   Need something else? search the full library (needs a free key).`);
    return;
  }

  const name = flags.name ?? target;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) fail(`Use a short kebab-case slot name, like "title-hit" (got "${name}").`);
  const item = index.find((i) => i.name === target);
  if (!item) fail(`"${target}" isn't in SoundKit. Run: node soundza.mjs kit list`);
  const m = item.meta ?? {};
  const dir = flags.dir ?? DIR;
  const manifest = readJson(MANIFEST, {});
  const id = `soundkit:${item.name}`;
  const existing = Object.entries(manifest).find(([, entry]) => entry.id === id);
  if (existing && existsSync(path.join(dir, existing[1].file))) {
    manifest[name] = existing[1];
    await writeJson(MANIFEST, manifest);
    console.log(`Already downloaded as ${existing[1].file}; reusing it for "${name}".`);
    printUsage(name, manifest[name]);
    return;
  }

  // No Referer or Origin: the download refuses requests embedded in another site, not a CLI.
  const res = await fetch(m.download, { redirect: "follow" });
  if (!res.ok) await apiFail(res, m.download);
  const ext = path.extname(new URL(m.download).pathname).slice(1) || "wav";
  const file = `${name}.${ext}`;
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));

  manifest[name] = {
    id,
    title: item.title,
    file,
    duration: m.durationMs != null ? m.durationMs / 1000 : null,
    sync_ms: m.syncMs ?? null,
    loop_seamless: m.loop ?? null,
    url: m.page,
    attribution: `"${item.title}" from SoundKit by Soundza (${m.page}), CC0`,
  };
  await writeJson(MANIFEST, manifest);
  await writeCredits(manifest);
  console.log(`Saved ${path.join(dir, file)} ← "${item.title}" (CC0)`);
  printUsage(name, manifest[name]);
}

async function kitIndex() {
  const cached = readJson(KIT_CACHE, null);
  if (cached && Date.now() - cached.fetchedAt < 24 * 3600 * 1000) return cached.items;
  const res = await fetch(`${SITE}/r/registry.json`);
  if (!res.ok) await apiFail(res, "/r/registry.json");
  const body = await res.json();
  // The index also lists the shared code items (soundza, remotion); keep only sounds.
  const items = (body.items ?? []).filter((i) => i.meta?.download);
  await mkdir(path.dirname(KIT_CACHE), { recursive: true });
  await writeFile(KIT_CACHE, JSON.stringify({ fetchedAt: Date.now(), items }));
  await ignore(".soundza/");
  return items;
}

/** Print the <audio> element that puts a sound's hit at --at seconds. */
async function place() {
  const name = positional[0];
  const at = Number(flags.at);
  if (!name || !Number.isFinite(at)) fail("Usage: node soundza.mjs place <slot> --at <seconds> [--volume 0.6] [--id sfx-title] [--no-hit]");
  const entry = readJson(MANIFEST, {})[name];
  if (!entry) fail(`No sound in slot "${name}". Add one first (kit or add), then place it.`);
  const lead = flags["no-hit"] ? 0 : (entry.sync_ms ?? 0) / 1000;
  let start = at - lead;
  let mediaStart = 0;
  if (start < 0) {
    mediaStart = -start; // trim the head so the hit still lands on time
    start = 0;
  }
  const attrs = {
    id: flags.id ?? `sfx-${name}-${String(at).replace(".", "_")}`,
    src: `${DIR}/${entry.file}`,
    "data-start": round(start),
    ...(mediaStart ? { "data-media-start": round(mediaStart) } : {}),
    "data-volume": flags.volume ?? "0.6",
    "data-track-index": flags.track ?? "4",
  };
  console.log(`<!-- ${entry.title}: ${lead ? `hit at ${round(at)}s` : `starts at ${round(at)}s`} -->`);
  console.log(audioTag(attrs));
}

/** Print the <audio> element(s) for a music bed that runs the whole video. */
async function bed() {
  const name = positional[0];
  const length = Number(flags.length);
  if (!name || !Number.isFinite(length) || length <= 0) fail("Usage: node soundza.mjs bed <slot> --length <seconds> [--volume 0.25] [--start 0]");
  const entry = readJson(MANIFEST, {})[name];
  if (!entry) fail(`No sound in slot "${name}". Add a music bed first (kit or add), then place it.`);
  const start = Number(flags.start ?? 0);
  const volume = flags.volume ?? "0.25";
  const fadeOut = Math.min(2, length / 4);
  const dur = entry.duration;
  if (!dur || dur >= length || !entry.loop_seamless) {
    if (dur && dur < length) console.log(`<!-- "${entry.title}" is ${round(dur)}s and not a seamless loop: pick a longer bed (search with --fit ${Math.ceil(length)}) or end the video earlier. -->`);
    console.log(audioTag({ id: flags.id ?? `bed-${name}`, src: `${DIR}/${entry.file}`, "data-start": round(start), "data-duration": round(Math.min(length, dur ?? length)), "data-volume": volume, "data-fade-in": "0.5", "data-fade-out": round(fadeOut), "data-track-index": flags.track ?? "5" }));
    return;
  }
  // A seamless loop shorter than the video: lay copies end to end, fading only the outer edges.
  const copies = Math.ceil(length / dur);
  for (let i = 0; i < copies; i++) {
    const last = i === copies - 1;
    console.log(audioTag({
      id: `${flags.id ?? `bed-${name}`}-${i + 1}`,
      src: `${DIR}/${entry.file}`,
      "data-start": round(start + i * dur),
      "data-duration": round(last ? length - i * dur : dur),
      "data-volume": volume,
      ...(i === 0 ? { "data-fade-in": "0.5" } : {}),
      ...(last ? { "data-fade-out": round(fadeOut) } : {}),
      "data-track-index": flags.track ?? "5",
    }));
  }
}

function audioTag(attrs) {
  const lines = Object.entries(attrs).map(([k, v]) => `  ${k}="${v}"`);
  return `<audio\n${lines.join("\n")}\n></audio>`;
}

function round(n) {
  return String(Math.round(n * 1000) / 1000);
}

async function list() {
  const manifest = readJson(MANIFEST, {});
  const entries = Object.entries(manifest);
  if (!entries.length) return console.log(`No Soundza sounds yet (${MANIFEST} is empty or missing).`);
  for (const [name, e] of entries) {
    console.log(`${name.padEnd(16)} ${e.file.padEnd(22)} ${fmtDuration(e.duration).padEnd(7)} hit ${e.sync_ms ?? 0}ms  ${e.title}`);
  }
}

async function removals() {
  const key = requireKey();
  const manifest = readJson(MANIFEST, {});
  const ids = new Set(Object.values(manifest).map((e) => e.id));
  const removedIds = new Set();
  let route = `/removals?since=${encodeURIComponent(flags.since ?? "2020-01-01")}`;
  while (route) {
    const body = await get(route, key);
    for (const r of body.removals ?? []) removedIds.add(r.id);
    route = body.next_page ? body.next_page.slice(body.next_page.indexOf("/removals")) : null;
  }
  const removed = Object.entries(manifest).filter(([, e]) => ids.has(e.id) && removedIds.has(e.id));
  if (!removed.length) return console.log("None of this project's sounds have been removed.");
  console.log("Removed from Soundza; delete these files and pick replacements:");
  for (const [name, e] of removed) console.log(`  ${name}: ${e.file} (${e.title})`);
}

// ---------------------------------------------------------------- helpers

function printUsage(name, entry) {
  const what = entry.loop_seamless || (entry.duration ?? 0) > 20
    ? `node soundza.mjs bed ${name} --length <video seconds>`
    : `node soundza.mjs place ${name} --at <seconds>   # ${entry.sync_ms ? `its hit (${entry.sync_ms}ms in) lands at <seconds>` : "starts at <seconds>"}`;
  console.log(`\nNext: ${what}`);
}

async function writeCredits(manifest) {
  const lines = [...new Set(Object.values(manifest).map((e) => `- ${e.attribution}`))];
  const block = [
    "<!-- soundza:start -->",
    "Sound effects and music from [Soundza](https://soundza.com): SoundKit sounds are CC0; the rest are free under the [Soundza Standard License](https://soundza.com/license).",
    "",
    ...lines,
    "<!-- soundza:end -->",
  ].join("\n");
  const current = existsSync(CREDITS) ? await readFile(CREDITS, "utf8") : "# Credits\n\n";
  const next = /<!-- soundza:start -->[\s\S]*<!-- soundza:end -->/.test(current)
    ? current.replace(/<!-- soundza:start -->[\s\S]*<!-- soundza:end -->/, block)
    : `${current.trimEnd()}\n\n${block}\n`;
  await writeFile(CREDITS, next);
}

async function saveKey(token) {
  const line = `SOUNDZA_API_KEY=${token}\n`;
  if (existsSync(".env")) {
    const env = await readFile(".env", "utf8");
    await appendFile(".env", env.endsWith("\n") || env === "" ? line : `\n${line}`);
  } else {
    await writeFile(".env", line, { mode: 0o600 });
  }
  await ignore(".env");
  process.env.SOUNDZA_API_KEY = token;
}

async function ignore(entry) {
  const current = existsSync(".gitignore") ? await readFile(".gitignore", "utf8") : "";
  if (current.split("\n").some((l) => l.trim() === entry)) return;
  await appendFile(".gitignore", `${current && !current.endsWith("\n") ? "\n" : ""}${entry}\n`);
}

function requireKey() {
  loadDotEnv();
  const key = process.env.SOUNDZA_API_KEY?.trim();
  if (!key) fail("No SOUNDZA_API_KEY in the environment or .env. Run: node soundza.mjs signin");
  return key;
}

function loadDotEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function get(route, key) {
  const res = await fetch(`${API}${route}`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) await apiFail(res, route);
  return res.json();
}

async function post(route, body) {
  const res = await fetch(`${API}${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) await apiFail(res, route);
  return res.json();
}

async function apiFail(res, where) {
  const body = await res.json().catch(() => null);
  const retry = res.headers.get("retry-after");
  const code = body?.error?.code ?? body?.error ?? res.statusText;
  const message = body?.error?.message ?? "";
  if (code === "missing_key" || code === "invalid_key" || code === "revoked_key") {
    fail(`Soundza key problem (${code}). Remove SOUNDZA_API_KEY from .env and run: node soundza.mjs signin`);
  }
  fail(`Soundza API ${res.status} on ${where}: ${code} ${message}${retry ? `\nTry again in ${retry} seconds.` : ""}`);
}

function parseArgs(args) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [k, v] = arg.slice(2).split("=", 2);
      if (v !== undefined) flags[k] = v;
      else if (args[i + 1] !== undefined && !args[i + 1].startsWith("--")) flags[k] = args[++i];
      else flags[k] = "true";
    } else positional.push(arg);
  }
  return { positional, flags };
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function fmtDuration(sec) {
  if (sec == null) return "?";
  return sec < 60 ? `${sec.toFixed(1)}s` : `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
}

function truncate(text, n) {
  return text.length > n ? `${text.slice(0, n - 1)}…` : text;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
