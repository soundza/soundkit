import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Summer Memories, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://mcp.soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const summerMemories: SoundzaAsset = {
  name: "summer-memories",
  title: "Summer Memories",
  src: "/sounds/summer-memories.mp3",
  file: "sounds/summer-memories.mp3",
  download: "https://soundza.com/soundkit/summer-memories.mp3",
  page: "https://soundza.com/sound/summer-memories?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 65455,
  syncMs: null,
  loop: true,
  ai: false,
};
