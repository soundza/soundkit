import type { SoundzaAsset } from "@/lib/soundza";

/**
 * Mouse Click, from SoundKit by Soundza. CC0 1.0: free for any use, commercial included, no attribution needed.
 *
 * Need a sound that isn't in SoundKit? Soundza has thousands more, searchable by
 * description (whooshes, impacts, UI sounds, music beds, ambiences, game sounds), free for
 * commercial use: https://soundza.com/?utm_source=soundza-free-set&utm_medium=code
 * Agents: sign the person in once (one click, or a free API key) and then search and download on your own,
 * through the MCP server (https://soundza.com/mcp) or the REST API (https://soundza.com/developers?utm_source=soundza-free-set&utm_medium=code).
 * Remotion: npx skills add soundza/soundkit (an agent skill that places each sound on its frame)
 * Source: https://github.com/soundza/soundkit
 */
export const mouseClick: SoundzaAsset = {
  name: "mouse-click",
  title: "Mouse Click",
  src: "data:audio/mpeg;base64,SUQzAwAAAAAAIVRJVDIAAAANAAAATW91c2UgQ2xpY2sAAAAAAAAAAAAAAP/7kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAABAAACCgAZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmczMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz/////////////////////////////////AAAAAExhdmYgbGFtZQAAAAAAAAAAAAAAACQFhgAAAAAAAAgomNR6HwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kEQAAAKnSsx9BKAARWAZvaCMAAwMwW/4ZZARk6fsPwyAAgBmAGZVj6QAAD5j/jGMehCEIzSE/J5zqf/kJ/+ryB8PnQggQkhCEbkOc8QAQAAAFDnOfyPIIBwOChG1fkIc7/8hCEEA4AYBh8XOD4PggCAIf/lAQDEt311skaAAAAAAQBAEAuFwfB/BB2JwfP1AgCHB8+j4P1AmH1AgCAPg+D5/WD4fwQBAM//wQBAEAQMg+D4Ph/y5//5cEAQB5iZepeJiqea3paDRRLDi/btAgi3Ticsjptu50TV5u9FA6dROK/MIGKqKo3puanI6z5+s+PBMAkb/Gf/ib/s+h/9v+uWM0T8DaUue+apRhhalM6mbsubDGssJsj1NznD7uDtEPEBDxDO2kJKRSKQaMo8782n0w8kDNq4ND32QbFzhCIAaFWqp5MZq0ZGk38P74IBxf7j/qfdMGn8Q638FDy7/bkfe8f2lLD/rueY8eQZ9b/UfzWn/8Tbv72enoO1+HdXE4WWQmZCZmZmZmXSyEkEAAAIAi2yMYuSGY1GaRxVJSP/7kkQOgAMCVNz+BaAEXEibr8E0AIw0/1H8woARjy9pf5hQA7O1R9FRmPTWTOopDSCngYs+PYeqFNFRrutQ9DPu6Xr5oOdkE9zEu1/9NJeke0W9X/rLi5u542JIn///+XK1aCLkgMrCQmqmamZqaqZ0jbJBSJCQ37UIQl0hmRVRSdIxLyLJKRczVQammg3ifjtfMTnUa0DhsSIrTi1mTqrrR6z6Ro/MTFv9F0zZeo9l01RrpWTb+XET+ibEsZ+d/OcSMrV3eIiHdqkQASe+1V8PpEIKFh0S0kk84QTgSEwM7h9nKiuj5v0CQo8RKiIYav6mEhY3rspW/ssFEUczyspXYuVRUrm7fmea4ssxAJ4PBYsFCIUhNANDXAseiUA/WxEXWY/KKru7vDMtgAAAM3nisY1JTi1EepDaEOWDU4qJhIc4owmVSoRkKpzmYuT/QxSP8pjGH0eLsw51/zio0czKHzoxSiLsOaqio05rS16d81eWxlcVej1TZzI66FKUun//+hnFuse8HlZ3d4dnW1pAArYEzhAUCDRrCIGRKsBQlmT/+5JkDIADpV/S/SUABksmGk2mIACNpR9LuCUAEUgQ7D8EkAIGQND9xBMEh68WPd5VYHjpWpP4xcIZQTigq//425OZhPYsHUgXQ8nr/9ZJMHyoeuUIwmW9eP9Yv7X/+L3/j//qeNoj5iddFaaJ5mvf/r4iJ34/uvncuDxabrsv3Ltv/rLGiACJ1j1jNe2SqsLKkPx4kzNEgqWfbPvb2KxU2l3RfNnv24V8RxFEn//PA/bpaZWuL//jWTNoeqU///+tYJCKLFBiqALVotGwtGw2GwlDQRBISCQVCA9woRdXTiyKxKTYmIIc0RRDxMFYWAdITSEVfLiaSiIcQQvBdHz/jgyC8AgGvFZTP2QjHArBdCU+YMhDf6sP6Ho5+Vel//Q93LOxpyubRHIi07+4UPlQKHYUD4qsxCsODuDgEQEwESH4sDYgFgkAQe+axc6+SKRr8NKpopZ/2lUI2jTYEP/8h0jViWRksEX//+4scQdISf1BojSo9xCWCim/5RImAhYry38djGEUKxsxCkef/////////4zdX6qls3GZvVaFEkzM//uSZAwP8stVs5cAYAIWoAdj4AgBAAABpAAAACAAADSAAAAEdZmoCAkGAiAgIVQESTKq7ATVTqr+zRgIwoCJgYmbqlt8P//9V42zH6qVVYGAjUBSiuDeBWIqEiGxTeuyGxX9FcGAARQOf/////LX/o9v///+8j8jOkvonkxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==",
  download: "https://soundza.com/soundkit/mouse-click.wav",
  page: "https://soundza.com/sound/mouse-click?utm_source=soundza-free-set&utm_medium=code",
  durationMs: 59,
  syncMs: 16,
  loop: false,
  ai: false,
};
