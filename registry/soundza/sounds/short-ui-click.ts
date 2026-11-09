import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Short UI Click, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const shortUiClick: SoundzaAsset = {
  name: "short-ui-click",
  title: "Short UI Click",
  src: "data:audio/mpeg;base64,SUQzAwAAAAAAJFRJVDIAAAAQAAAAU2hvcnQgVUkgQ2xpY2sAAAAAAAAAAAAAAP/7kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAABAAACCgAZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmczMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz/////////////////////////////////AAAAAExhdmYgbGFtZQAAAAAAAAAAAAAAACQCSwAAAAAAAAgo8OAJAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kGQAAAMHW1SVGQACNgAaRqCMAA9tCWIYxgABShzwdxKAAhABpDLJkyabEAGAwtNjCBAgLvBAoKGDQbgAAAgLDJFwbi7y9y7vo7u7u78uLh2DcPxd4Fz3v+XREREr//+XRERK//RERK+Xf/f///0RET+X+Ep3d////9He4RE///0Fzx6EAAJEYfUCDgQcuIwfB8PlAfB8Hz8oCAIQQcJwficHwfB8EAwXB8PS4f+t/y/lMuH///g/+CAItAfVvnJ0fRk8kyHRLRuV4Ql7RYw6EUugd0UIAlc0UnKtG5m/Hs1WtMlQqrIyYdnL0tLpZPqXr1bvmBLOTpmtpmb/lZZ1zL0edftk5PzBHDOP/OvRb7n3y9c+Z6a1+3a1cCHzI2Tle2RBtwsFWJQWMvUTWfd/KhX/8uXdttkokEsstkkkAkEAAzQujxWLZOGwreVvih8eRx/jDA6VsZNC40Ow/+VtRioH4KFFZnb/VKo9xQs21mv7//Qoljhx/////+PMPsw9wTtt/Ah+aWZqaXYzIAAeFtPc40ugVuqhItC89qYKKP/7kmQMAANDD1V3YGACTwLarueMAAzsXVX1owABe4yp+rKAAL9xpckMV5cBjIKtBOQIMO8PORsrC6I+qlj+KbiOnDx5AwAQSh877B4dwzADHpGQFP/t4dknntwX///69GJouz3f//2+///+6dyKr+TN2Q+7UQ8S6sYiYAtAUXwYhwF3E/NAUJoHKQksPZjeP6EfooC6jCmWHiSz7BdEimdRCEoCEKtUtzEZxgQIBfjUtISDg+ywmQLtvWvTCP10f//d/fUNDMzKhREApxjZNHtTz/uNYstma9FmyO9Ka7gbeNwwOB4TBoQWa0YUSNR0iDbLc0jhtEhKdBpwNDwVWCoBOqBUqdDQbIwVBV4lDSg4ImIIlkNe5GvkXWVOJRub+63VICr6TLJpKliGURkRjMAQBazsFL60USh6A1yNNc+N1oCirW+SyniYcngvDwo0YXRsPRz2fMcarWtjTTYHgqLqBqJngEFTvRWCoKhpYKnVBwRB0S2h0S/KrOv60//XsfGKX2Vis0k6sAqS4D8XAAACjTzzBAFVODIsFbQ/YmvD8g3/+5JEDAADDVlQZk1AAGDqaq3KNACIPBrUHfAAAOoDW4O+AAC4mi9iaBhHwuhkDd+C0w+Gf+C0Ko3FIiMhISX4sCHNNFUWamp/kRCSko9Iv538sufPQ9Dub/+5LUldb////808uyVPnfIT1f/rVZeBgPhQGBINRaJBAGgC5ZYUdQd+YLdE55DgyN4aAt18cQ7gIN+I0SI5SZ/jhIA82KdJaSXyWWUCAXTpkipSKvx+MUWMVGC1PmJr/r6rr1f/9STuz3S////7FMeAwzbcsSPxtT3jPtSeQxIcGaMBNBHzB4gaUwNgBBCwCAYDyAvGAPgAQIACTAFgA1ik8CaQQHJ3q/FP///T9X/1f7P/+2z6MwfbenFGe5k3RiOoMkYCaCMmDtAzpgagB+FgEAwHcBcMAfAAgQAEmAKABrFJ5hkED/////////////8jAAAJcNLHMlDGUABowT8DQMFEASjnqj/MAgkbBImiYE2XGFRaVyBasS0V7OK0F5ntdeQOPOOWoARUBEIKGRgycFyp9U2y2wjnBel6Xkmyk5J1MUx2+eWq//uSZCuO1D8hORv6SPI5YUeDdykGE3ye1C9hJ4kWi5rB7Jh5pKttvcYYYfe/qLPPPMMMkln2rvzz73kk1gjz6ZRVPPPrDDDOntNpxaPPDDDBjvrLZgJSX/nzUxjUnnMiEppWhwcVXXWdAlGGTjKzMn4aAhQuXWt7nepXv7Kvf/+3bKo3cy1tPbyG1KVdugJvtb8ncYkSY24QhkACpmEWC8YVAPJgigaGBQAqaSAQb1mhJkOZCmY5iCYigYIJAWuLvIAkVkilTLGWGclyYdpUP6KRCShUMgiCIIgiAUVBYNCoVCoVIiJCzGP8tWiqhQoUKFChRIkSKTUgoV/8CQUFBQUKCgoKO//tFBQUFBgoKG///9ooKCgo0b////8UFBQUGCv///8ugoKCgplxqYGiONEYSQD5hXg2HEidrRjBl2mItauLuYczpdzOmHNeay7rsv6/sOxmMgEkSSrf5yqqqqqOkFBQUFG///KFBQUCgulMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==",
  file: null,
  download: "https://soundza.com/soundkit/short-ui-click.wav",
  page: "https://soundza.com/sound/short-ui-click?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 161,
  syncMs: 5,
  loop: false,
  ai: false,
};
