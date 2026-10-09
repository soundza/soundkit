# Soundza for Remotion

An agent skill that adds sound design to [Remotion](https://remotion.dev) videos with free sounds from [Soundza](https://soundza.com): whooshes on cuts and transitions, impacts on titles and logo reveals, risers, UI clicks and pops, ambience, and a music bed sized to the video.

Ask your agent for it in plain words:

> add sound design to this video

> put a whoosh on every transition and a calm music bed under it

The agent reads your compositions, lists every moment that should make a sound, searches thousands of sounds by description, lets you pick by ear from free previews, downloads only the ones you use, and places each one so its hit lands on the exact frame.

## Install

```bash
npx skills add soundza/soundza-remotion
```

Works with Claude Code, Codex, Cursor and any agent that reads [Agent Skills](https://agentskills.io). It pairs well with Remotion's own skills (`npx skills add remotion-dev/skills`).

Soundza is free. The first time, the agent asks you to approve a one-click sign-in and saves a key to your project's `.env` (kept out of git). You can also make a key at [soundza.com/developers/keys](https://soundza.com/developers/keys) and set `SOUNDZA_API_KEY` yourself.

## What it adds to your project

- `public/sounds/<name>.wav`: the sounds you chose, downloaded once.
- `src/soundza-sounds.json`: what each sound is, where its hit lands (`sync_ms`) and its attribution.
- `src/soundza.tsx`: two components.

```tsx
import { SoundzaMusicBed, SoundzaSound } from "./soundza";

<SoundzaSound name="whoosh" at={60} />                 // the whoosh peaks on frame 60
<SoundzaSound name="title-hit" at={TITLE_IN} volume={0.8} />
<SoundzaMusicBed name="music" volume={0.25} duckAt={[TITLE_IN]} />
```

`<SoundzaSound>` starts the file early by its `sync_ms`, so the hit (a whoosh's peak, an impact's transient, the top of a riser) lands on the frame you give it, not just the start of the file. `<SoundzaMusicBed>` loops if needed, fades in and out, and dips under big hits.

- `CREDITS.md`: one attribution line per sound. Credit is appreciated, not required.

Renders never need the key: the files are in your project.

## Example

[`example/`](example/) is an 11-second promo with a title hit, slide whooshes, pops, a ticking counter, a riser into a logo hit and a music bed, all placed by the skill.

```bash
cd example
npm install
npm run dev       # Remotion Studio
npm run render    # out/promo.mp4
```

## Without an agent

The helper the skill uses works on its own (Node 18+, no dependencies). Run it from your Remotion project's root:

```bash
node skills/soundza-remotion/scripts/soundza.mjs signin
node skills/soundza-remotion/scripts/soundza.mjs search "fast airy whoosh" --type sound_effect --good-for transition --max-duration 2
node skills/soundza-remotion/scripts/soundza.mjs add <id> --name whoosh
```

Then copy [`templates/soundza.tsx`](skills/soundza-remotion/templates/soundza.tsx) into `src/`.

## License

The code in this repo is MIT. Sounds are not included; each one you download is free for personal and commercial videos under the [Soundza Standard License](https://soundza.com/license). Remotion has its own [license](https://remotion.dev/license) for companies.
