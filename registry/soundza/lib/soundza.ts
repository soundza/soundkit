/**
 * SoundKit by Soundza. MIT licensed code; every SoundKit sound is CC0.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://mcp.soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export type SoundzaAsset = {
  name: string;
  title: string;
  /**
   * The sound itself: an embedded MP3 for an effect, so nothing is fetched from
   * Soundza when it plays; for a music bed, its path under public/ ("/sounds/<name>.mp3").
   */
  src: string;
  /** A music bed's file under public/, downloaded once from `download` (too big to embed). Null for effects. */
  file?: string | null;
  /** The full-quality file (a WAV, or an MP3 for a bed), to download once into a project. */
  download: string;
  /** The sound's page on soundza.com. */
  page: string;
  durationMs: number | null;
  /** Where the sound's main hit lands, in ms from the start (a whoosh's peak, an impact's transient). Null: the start. */
  syncMs: number | null;
  /** A seamless loop (music beds, ambiences). */
  loop: boolean;
  /** Made with AI. */
  ai: boolean;
};

const cache = new Map<string, HTMLAudioElement>();

/** Plays a sound in the browser. Reuses one element per sound. */
export function playSound(sound: SoundzaAsset, { volume = 1 }: { volume?: number } = {}) {
  let audio = cache.get(sound.src);
  if (!audio) {
    audio = new Audio(sound.src);
    audio.preload = "auto";
    cache.set(sound.src, audio);
  }
  audio.volume = volume;
  audio.currentTime = 0;
  return audio.play();
}
