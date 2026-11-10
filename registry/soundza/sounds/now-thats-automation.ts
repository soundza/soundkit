import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Now That's Automation, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://mcp.soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const nowThatsAutomation: SoundzaAsset = {
  name: "now-thats-automation",
  title: "Now That's Automation",
  src: "/sounds/now-thats-automation.mp3",
  file: "sounds/now-thats-automation.mp3",
  download: "https://soundza.com/soundkit/now-thats-automation.mp3",
  page: "https://soundza.com/sound/now-thats-automation?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 72453,
  syncMs: null,
  loop: true,
  ai: false,
};
