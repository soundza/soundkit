/**
 * Soundza sounds in Remotion. Copy this file to src/soundza.tsx.
 * src/soundza-sounds.json is written by `node soundza.mjs add`.
 */
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import manifest from "./soundza-sounds.json";

export type SoundzaEntry = {
  id: string;
  title: string;
  file: string;
  duration: number | null;
  sync_ms: number | null;
  loop_seamless: boolean | null;
  url: string;
  attribution: string;
};

const sounds = manifest as Record<string, SoundzaEntry>;

export function soundza(name: string) {
  const entry = sounds[name];
  if (!entry) {
    throw new Error(`No Soundza sound "${name}" in src/soundza-sounds.json. Add it with: node soundza.mjs add <id> --name ${name}`);
  }
  return { ...entry, src: staticFile(`sounds/${entry.file}`) };
}

/**
 * Where a sound starts so its main hit lands on `frame`. `sync_ms` is where
 * the hit is, in ms from the start of the file (a whoosh's peak, an impact's
 * transient); null means the first sample. If the sound would need to start
 * before frame 0, it starts at 0 with its head trimmed so the hit stays on time.
 */
export function hitOn(frame: number, syncMs: number | null | undefined, fps: number) {
  const lead = Math.round(((syncMs ?? 0) / 1000) * fps);
  const from = frame - lead;
  return from >= 0 ? { from, trimBefore: 0 } : { from: 0, trimBefore: -from };
}

/**
 * One Soundza sound with its hit on frame `at` (in the parent Sequence's time).
 * Pass `hit={false}` to start the file on `at` instead, e.g. for a music bed.
 */
export const SoundzaSound: React.FC<{
  name: string;
  at?: number;
  hit?: boolean;
  volume?: number;
  loop?: boolean;
  durationInFrames?: number;
}> = ({ name, at = 0, hit = true, volume = 1, loop, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const sound = soundza(name);
  const { from, trimBefore } = hit ? hitOn(at, sound.sync_ms, fps) : { from: at, trimBefore: 0 };
  return (
    <Sequence from={from} durationInFrames={durationInFrames} layout="none" name={`${name} (Soundza)`}>
      <Audio src={sound.src} trimBefore={trimBefore || undefined} volume={volume} loop={loop} />
    </Sequence>
  );
};

/**
 * A music bed under the whole composition (or the parent Sequence): starts at
 * frame 0, loops if the file is shorter, fades in and out, and dips under
 * the frames in `duckAt` (e.g. the title hit) so effects cut through.
 */
export const SoundzaMusicBed: React.FC<{
  name: string;
  volume?: number;
  fadeSeconds?: number;
  duckAt?: number[];
}> = ({ name, volume = 0.25, fadeSeconds = 1, duckAt = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sound = soundza(name);
  const fade = Math.max(1, Math.round(fadeSeconds * fps));
  const envelope = interpolate(frame, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const duck = Math.min(
    1,
    ...duckAt.map((at) =>
      interpolate(frame, [at - 4, at, at + fps * 0.6], [1, 0.5, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  const loop = sound.duration != null && sound.duration * fps < durationInFrames;
  return <Audio src={sound.src} volume={volume * envelope * duck} loop={loop} />;
};
