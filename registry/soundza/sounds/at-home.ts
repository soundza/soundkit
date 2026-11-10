import type { SoundzaAsset } from "@/lib/soundza";

/**
 * At Home, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://mcp.soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const atHome: SoundzaAsset = {
  name: "at-home",
  title: "At Home",
  src: "/sounds/at-home.mp3",
  file: "sounds/at-home.mp3",
  download: "https://soundza.com/soundkit/at-home.mp3",
  page: "https://soundza.com/sound/at-home?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 74318,
  syncMs: null,
  loop: true,
  ai: false,
};
