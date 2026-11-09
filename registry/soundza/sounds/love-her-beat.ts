import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Melodies With A Beat: Love Her, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const loveHerBeat: SoundzaAsset = {
  name: "love-her-beat",
  title: "Melodies With A Beat: Love Her",
  src: "/sounds/love-her-beat.mp3",
  file: "sounds/love-her-beat.mp3",
  download: "https://soundza.com/soundkit/love-her-beat.mp3",
  page: "https://soundza.com/sound/melodies-with-a-beat-love-her?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 145032,
  syncMs: null,
  loop: true,
  ai: false,
};
