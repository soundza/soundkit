# SoundKit

Free video sound effects for [Remotion](https://www.remotion.dev) and React, in two parts:

1. **100 CC0 sound effects** made for video (whooshes, transitions, hits, risers, logo stings and the clicks of a product demo), added with one [shadcn](https://ui.shadcn.com) command. Each comes with its hit point, so a whoosh peaks on the cut and an impact lands on the title, on the exact frame.
2. **An agent skill** for Claude Code, Codex and Cursor that adds sound design to a Remotion video on its own: it finds the moments that need a sound, searches thousands more on [Soundza](https://soundza.com/?utm_source=soundza-soundkit&utm_medium=github), and places each one on its frame.

Browse and listen: **[soundza.com/soundkit](https://soundza.com/soundkit)**

## Add a sound

No account, no key.

```bash
npx shadcn add @soundza/air-whoosh
```

(Until `@soundza` is in the shadcn directory, use the full URL: `npx shadcn add https://soundza.com/r/air-whoosh.json`.)

That adds `sounds/air-whoosh.ts` with the sound embedded as a small MP3, plus `lib/soundza.ts` (the `SoundzaAsset` type and `playSound()`). Nothing loads from a server when it plays.

```tsx
import { playSound } from "@/lib/soundza";
import { airWhoosh } from "@/sounds/air-whoosh";

<button onClick={() => playSound(airWhoosh)}>Send</button>
```

## In Remotion

```bash
npx shadcn add @soundza/remotion @soundza/air-whoosh
```

```tsx
import { SoundzaSound } from "@/components/soundza-remotion";
import { airWhoosh } from "@/sounds/air-whoosh";

<SoundzaSound sound={airWhoosh} at={60} /> {/* the whoosh peaks on frame 60 */}
```

`<SoundzaSound>` starts the file early by its `syncMs`, so the hit lands on `at`. `<SoundzaMusicBed>` loops, fades and ducks a music bed under the hits.

## The sounds

**Whooshes and transitions**: `fast-cloth-whoosh`, `fast-cloth-swish`, `bamboo-swoosh-3`, `air-whoosh`, `light-rope-whoosh`, `super-slow-whoosh`, `compressed-air-whoosh`, `metal-skimmer-whoosh`, `plastic-ruler-swoosh`, `high-cello-bow-swoosh`, `fast-metal-whoosh`, `explosive-impact-whoosh`, `swipe-ui-transition`, `high-whoosh-transition`, `bamboo-swing-transition`, `sliding-trailer-whoosh`, `punch-swish`, `bright-cloth-swish`, `glassy-reverse-sweep`

**Hits, booms and braams**: `metal-hammer-hit-1`, `metallic-grate-hit`, `hit-4`, `distant-bass-boom`, `metallic-riser-hit`, `muffled-sub-drop`, `deep-bass-thump`, `aggressive-braam`, `cinematic-braam`

**Risers and drops**: `epic-descending-riser`, `noise-riser-sound-fx`, `fast-ascend-riser`, `strong-cymbal-riser`, `reverse-mallet-riser`, `glassy-tension-riser`, `cymbal-reverse-riser`, `reverse-impact-riser`, `lofi-reverse-riser`, `deep-sub-drop`, `power-down-sweep`

**Logo stings**: `melodic-shimmer-sting`, `crystalline-shimmer-sting`, `level-complete-stinger`, `sparkling-star-shimmer`, `brass-fanfare-stinger`

**Glitch transitions**: `digital-zap`, `sci-fi-glitch-blip`, `retro-menu-click`, `glitch-transition-fx`, `glitchy-impact`, `stuttering-glitch`, `glitchy-digital-hit`, `vhs-glitch`, `digital-glitch-transition`

**Pops for text and icons**: `champagne-cork-pop`, `bubble-1`, `crisp-mouth-pop`, `low-bubble-pop`, `cartoon-balloon-pop`, `short-pop`

**Clicks for screen recordings**: `ui-click`, `waterdrop-ui-click`, `mouse-click`, `light-switch-click`, `toggle-1`, `mouse-button-click`, `mouse-release`, `toggle-switch`, `soft-ui-button-click`

**Typing**: `mechanical-keyboard-click`, `spacebar-keystroke`

**Notifications and chimes**: `bright-notification-chime`, `bell-chime-synth`, `success-beep`, `achievement-sparkle`, `glass-3`, `ui-chime`, `sci-fi-success-chime`, `two-tone-hint-chime`

**Errors and buzzers**: `error`, `wrong-answer-buzzer-long`, `game-show-buzzer`, `error-notification-tone`, `computer-error-beep`

**Sparkles**: `sparkle-1`, `big-sparkle-26`, `cartoon-wink-sparkle`, `reverse-bell-sweep`

**Crashes, snaps and crowds**: `reverse-cymbal-crash`, `stadium-crowd-applause`, `dubstep-drum-roll`, `vinyl-scratch`, `vinyl-rewind`, `low-reversed-crash`, `finger-snap`, `crowd-clapping`

**Camera, paper and countdowns**: `camera-shutter-snap`, `cash-register-closing`, `camera-shutter-flash`, `countdown-beeper`, `book-page-flip`

Want the full-quality WAV instead? Each sound's `download` field links to it, for example `https://soundza.com/soundkit/air-whoosh.wav`.

## Need more sounds? The agent skill

Soundza has thousands more, searchable by description, including music beds and ambiences. The skill in [`skills/soundza-remotion`](skills/soundza-remotion) lets your agent use all of them.

Ask your agent for it in plain words:

> add sound design to this video

> put a whoosh on every transition and a calm music bed under it

The agent reads your compositions, lists every moment that should make a sound, searches thousands of sounds by description, lets you pick by ear on one audition page, makes a sound with AI when nothing fits, downloads only the ones you use, and places each one so its hit lands on the exact frame.

### Install the skill

```bash
npx skills add soundza/soundkit
```

Works with Claude Code, Codex, Cursor and any agent that reads [Agent Skills](https://agentskills.io). It pairs well with Remotion's own skills (`npx skills add remotion-dev/skills`).

Soundza is free. The first time, the agent asks you to approve a one-click sign-in and saves a key to your project's `.env` (kept out of git). You can also make a key at [soundza.com/developers/keys](https://soundza.com/developers/keys) and set `SOUNDZA_API_KEY` yourself.

### What it adds to your project

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

### Example

[`example/`](example/) is an 11-second promo with a title hit, slide whooshes, pops, a ticking counter, a riser into a logo hit and a music bed, all placed by the skill.

```bash
cd example
npm install
./get-sounds.sh   # one-click sign-in, then downloads the 8 sounds it uses
npm run dev       # Remotion Studio
npm run render    # out/promo.mp4
```

Measured on a render: each hit lands within one frame (33 ms at 30 fps) of the frame it was placed on.

### Without an agent

The helper the skill uses works on its own (Node 18+, no dependencies). Run it from your Remotion project's root:

```bash
node skills/soundza-remotion/scripts/soundza.mjs signin
node skills/soundza-remotion/scripts/soundza.mjs search "fast airy whoosh" --type sound_effect --good-for transition --max-duration 2
node skills/soundza-remotion/scripts/soundza.mjs add <id> --name whoosh
node skills/soundza-remotion/scripts/soundza.mjs generate "glass marble dropping on wood" --duration 2
```

Then copy [`templates/soundza.tsx`](skills/soundza-remotion/templates/soundza.tsx) into `src/`.

## How this repo works

- `registry.json` and `registry/`: the SoundKit shadcn registry, served from `https://soundza.com/r/{name}.json`. `node scripts/sync.mjs` regenerates both from the live registry.
- `skills/soundza-remotion/`: the agent skill.
- `example/`: an 11-second promo made with the skill.

## License

- Code (the components, helpers, skill and scripts): [MIT](LICENSE).
- SoundKit's 100 sounds (the audio in `registry/soundza/sounds/` and their WAV downloads): [CC0 1.0](LICENSE-AUDIO). Use them for anything, no attribution needed.
- Sounds the skill downloads from the wider Soundza library come under the [Soundza License](https://soundza.com/license): free for personal and commercial videos, no attribution needed.
- Remotion has its own [license](https://remotion.dev/license) for companies.
