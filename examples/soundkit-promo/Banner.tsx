import { loadFont } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { AbsoluteFill, Img, staticFile } from "remotion";

const { fontFamily: SANS } = loadFont("normal", { weights: ["500", "600"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

const INK = "#1a1816";
const MID = "#57534e";
const LINE = "#e8e4de";
const SURFACE = "#f7f5f2";
const INDIGO = "#4f46e5";

const CUTS = [22, 50, 78];
/** Clips as [cut it lands on, width %, where its hit sits within it 0..1]: every hit point lands exactly on a cut. */
const LANES: { label: string; clips: [number, number, number][] }[] = [
  { label: "WHOOSH", clips: [[22, 12, 0.7], [50, 16, 0.3]] },
  { label: "HITS", clips: [[78, 18, 0.06]] },
  { label: "RISER", clips: [[78, 24, 0.94]] },
];

/** The README banner for soundza/soundkit, 1280×640 (GitHub's social-preview size). */
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#ffffff", fontFamily: SANS, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 700, height: 700, left: -260, top: -360, borderRadius: "50%", background: INDIGO, filter: "blur(150px)", opacity: 0.14 }} />
    <div style={{ position: "absolute", width: 560, height: 560, right: -200, top: -160, borderRadius: "50%", background: "#7c3aed", filter: "blur(140px)", opacity: 0.11 }} />

    <div style={{ position: "absolute", left: 80, top: 92, display: "flex", flexDirection: "column", gap: 26, width: 720 }}>
      <Img src={staticFile("logo-wordmark.png")} style={{ height: 44, width: "auto", alignSelf: "flex-start" }} />
      <div style={{ color: INK, fontSize: 56, fontWeight: 600, letterSpacing: -2.4, lineHeight: 1.08 }}>
        SoundKit
        <div style={{ color: INDIGO, whiteSpace: "nowrap", fontSize: 50, letterSpacing: -2 }}>sound synced to your video</div>
      </div>
      <div style={{ color: MID, fontSize: 25, lineHeight: 1.45, maxWidth: 560 }}>
        CC0 sound effects and music beds for Remotion and React, each with its hit point for frame-accurate sync.
      </div>
      <div style={{ fontFamily: MONO, fontSize: 21, color: MID, padding: "10px 18px", borderRadius: 12, background: SURFACE, boxShadow: `0 0 0 2px ${LINE}`, alignSelf: "flex-start" }}>
        npx shadcn add @soundza/air-whoosh
      </div>
    </div>

    <div style={{ position: "absolute", right: 60, top: 190, width: 380, padding: "22px 22px 26px", borderRadius: 24, background: "#ffffff", boxShadow: `0 0 0 2px ${LINE}, 0 30px 60px -36px rgba(79,70,229,0.45)` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
        {LANES.map((lane) => (
          <div key={lane.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 66, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: "#8c877f" }}>{lane.label}</div>
            <div style={{ position: "relative", height: 30, flex: 1 }}>
              {lane.clips.map(([cut, width, hit], i) => (
                <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${cut - width * hit}%`, width: `${width}%`, borderRadius: 6, background: "rgba(79,70,229,0.14)", boxShadow: "inset 0 0 0 1.5px rgba(79,70,229,0.4)" }}>
                  <div style={{ position: "absolute", top: -3, bottom: -3, left: `calc(${hit * 100}% - 1.5px)`, width: 3, borderRadius: 3, background: "#f59e0b" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 78, right: 0, top: -8, bottom: -8, pointerEvents: "none" }}>
          {CUTS.map((c) => (
            <div key={c} style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${c}% - 1px)`, borderLeft: "2px dashed rgba(140,135,127,0.45)" }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, fontSize: 15, color: "#8c877f" }}>
        <div style={{ width: 3, height: 16, borderRadius: 3, background: "#f59e0b" }} />
        each hit point sits on a cut
      </div>
    </div>
  </AbsoluteFill>
);
