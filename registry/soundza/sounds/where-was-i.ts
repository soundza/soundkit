import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Where Was I, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const whereWasI: SoundzaAsset = {
  name: "where-was-i",
  title: "Where Was I",
  src: "/sounds/where-was-i.mp3",
  file: "sounds/where-was-i.mp3",
  download: "https://soundza.com/soundkit/where-was-i.mp3",
  page: "https://soundza.com/sound/where-was-i?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 68230,
  syncMs: null,
  loop: false,
  ai: false,
};
