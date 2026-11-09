/**
 * SoundKit sounds in Remotion. MIT licensed code; every SoundKit sound is CC0.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { SoundzaAsset } from "@/lib/soundza";

/** Effects play from their embedded audio; music beds from their file in public/. */
const source = (sound: SoundzaAsset) => (sound.file ? staticFile(sound.file) : sound.src);

/**
 * One sound with its hit on frame `at` (in the parent Sequence's time): it
 * starts early by `syncMs` so a whoosh peaks on the cut and an impact lands
 * on the title. `hit={false}` starts the file on `at` instead.
 */
export const SoundzaSound: React.FC<{
  sound: SoundzaAsset;
  at?: number;
  hit?: boolean;
  volume?: number;
  durationInFrames?: number;
}> = ({ sound, at = 0, hit = true, volume = 1, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const lead = hit ? Math.round(((sound.syncMs ?? 0) / 1000) * fps) : 0;
  const from = at - lead;
  const trimBefore = from < 0 ? -from : 0;
  return (
    <Sequence from={Math.max(0, from)} durationInFrames={durationInFrames} layout="none" name={`${sound.name} (Soundza)`}>
      <Audio src={source(sound)} trimBefore={trimBefore || undefined} volume={volume} />
    </Sequence>
  );
};

/**
 * A music bed under the whole composition: loops if it is shorter, fades in
 * and out, and dips under the frames in `duckAt` so hits cut through.
 */
export const SoundzaMusicBed: React.FC<{
  sound: SoundzaAsset;
  volume?: number;
  fadeSeconds?: number;
  duckAt?: number[];
}> = ({ sound, volume = 0.25, fadeSeconds = 1, duckAt = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = Math.max(1, Math.round(fadeSeconds * fps));
  const envelope = interpolate(frame, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const duck = Math.min(
    1,
    ...duckAt.map((at) =>
      interpolate(frame, [at - 4, at, at + fps * 0.6], [1, 0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ),
  );
  const loop = sound.durationMs != null && (sound.durationMs / 1000) * fps < durationInFrames;
  return <Audio src={source(sound)} volume={volume * envelope * duck} loop={loop} />;
};
