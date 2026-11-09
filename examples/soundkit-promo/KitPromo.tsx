import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SoundzaMusicBed, SoundzaSound } from "@/components/soundza-remotion";
import { airWhoosh } from "@/sounds/air-whoosh";
import { quickAirWhoosh } from "@/sounds/quick-air-whoosh";
import { distantBassBoom } from "@/sounds/distant-bass-boom";
import { crystallineShimmerSting } from "@/sounds/crystalline-shimmer-sting";
import { shortPop } from "@/sounds/short-pop";
import { digitalClick } from "@/sounds/digital-click";
import { glockenspielSuccessChime } from "@/sounds/glockenspiel-success-chime";
import { reverseCymbalCrash } from "@/sounds/reverse-cymbal-crash";
import { upliftingSuccessStinger } from "@/sounds/uplifting-success-stinger";
import { casualAfternoon } from "@/sounds/casual-afternoon";

const { fontFamily: SANS } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

// Soundza brand: studio paper, near-black ink, one indigo accent.
const PAPER = "#ffffff";
const SURFACE = "#f7f5f2";
const LINE = "#e8e4de";
const INK = "#1a1816";
const MID = "#57534e";
const FAINT = "#8c877f";
const INDIGO = "#4f46e5";

const T = 14;
const SCENES = [78, 96, 96, 108];
const STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((sum, len) => sum + len - T, 0));
export const KIT_PROMO_FRAMES = SCENES.reduce((sum, len) => sum + len, 0) - T * (SCENES.length - 1);
const CUTS = STARTS.slice(1).map((start) => start + Math.round(T / 2));

const TITLE_IN = 10;
const CARDS = [14, 30, 46];
/** The pops land a few frames after each card starts: when its spring has visibly arrived. */
const POP_LAG = 3;
const COUNT_FROM = 12;
const COUNT_TO = 58;
const LOGO_IN = 26;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const KitPromo: React.FC = () => {
  const ticks: number[] = [];
  for (let f = COUNT_FROM; f < COUNT_TO; f += 6) ticks.push(STARTS[2] + f);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: SANS }}>
      <Aurora />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <Title />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <Cards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <Counter />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Every sound below is from SoundKit, its hit placed on the frame its animation lands. */}
      <SoundzaSound sound={distantBassBoom} at={TITLE_IN} volume={0.8} />
      <SoundzaSound sound={airWhoosh} at={CUTS[0]} volume={0.7} />
      {CARDS.map((c) => (
        <SoundzaSound key={c} sound={shortPop} at={STARTS[1] + c + POP_LAG} volume={0.55} />
      ))}
      <SoundzaSound sound={quickAirWhoosh} at={CUTS[1]} volume={0.7} />
      {ticks.map((t) => (
        <SoundzaSound key={t} sound={digitalClick} at={t} volume={0.3} />
      ))}
      <SoundzaSound sound={glockenspielSuccessChime} at={STARTS[2] + COUNT_TO} volume={0.6} />
      <SoundzaSound sound={reverseCymbalCrash} at={STARTS[3] + LOGO_IN} volume={0.5} />
      <SoundzaSound sound={upliftingSuccessStinger} at={STARTS[3] + LOGO_IN} volume={0.55} />
      <SoundzaSound sound={crystallineShimmerSting} at={STARTS[3] + LOGO_IN} volume={0.7} />
      <SoundzaSound sound={distantBassBoom} at={STARTS[3] + LOGO_IN} volume={0.5} />
      <SoundzaMusicBed sound={casualAfternoon} volume={0.22} duckAt={[TITLE_IN, STARTS[3] + LOGO_IN]} />
    </AbsoluteFill>
  );
};

/** The site's aurora: soft indigo and violet glows drifting behind everything. */
const Aurora: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (speed: number, amp: number) => Math.sin((frame / 30) * speed) * amp;
  const blob = (color: string, size: number, x: number, y: number, o: number): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    left: x,
    top: y,
    borderRadius: "50%",
    background: color,
    filter: "blur(140px)",
    opacity: o,
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob("#4f46e5", 760, -220 + drift(0.5, 60), -300 + drift(0.4, 40), 0.16)} />
      <div style={blob("#7c3aed", 620, 1300 + drift(0.35, 70), -120 + drift(0.6, 50), 0.12)} />
      <div style={blob("#6366f1", 560, 700 + drift(0.45, 80), 760 + drift(0.3, 40), 0.1)} />
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 26px 10px 10px",
      borderRadius: 999,
      background: PAPER,
      boxShadow: `0 0 0 2px ${LINE}`,
      fontSize: 40,
      color: MID,
      fontWeight: 500,
    }}
  >
    <span style={{ background: INDIGO, color: "white", borderRadius: 999, padding: "6px 16px", fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>CC0</span>
    {children}
  </div>
);

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - TITLE_IN, fps, config: { damping: 14, stiffness: 170 } });
  const pill = spring({ frame, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 48 }}>
      <div style={{ opacity: pill, transform: `translateY(${(1 - pill) * 16}px)` }}>
        <Pill>SoundKit for Remotion and shadcn</Pill>
      </div>
      <div style={{ textAlign: "center", color: INK, fontSize: 132, fontWeight: 600, letterSpacing: -6, lineHeight: 1.02, opacity: s, transform: `scale(${0.82 + s * 0.18})` }}>
        Sound effects
        <br />
        that land <span style={{ color: INDIGO }}>on the frame</span>
      </div>
    </AbsoluteFill>
  );
};

const FEATURES: { title: string; note: string; bars: number[] }[] = [
  { title: "Whooshes on every cut", note: "37 whooshes and transitions", bars: [0.25, 0.5, 0.9, 0.6, 0.3, 0.15] },
  { title: "Hits on every title", note: "Braams, booms and logo stings", bars: [1, 0.7, 0.45, 0.3, 0.2, 0.12] },
  { title: "Music beds that fit", note: "25 beds, looped and ducked", bars: [0.5, 0.6, 0.55, 0.65, 0.5, 0.6] },
];

const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 170px", gap: 34 }}>
      {FEATURES.map((f, i) => {
        const s = spring({ frame: frame - CARDS[i], fps, config: { damping: 13, stiffness: 210 } });
        return (
          <div
            key={f.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "30px 40px",
              borderRadius: 32,
              background: PAPER,
              boxShadow: `0 0 0 2px ${LINE}, 0 30px 60px -40px rgba(26,24,22,0.35)`,
              opacity: s,
              transform: `translateY(${(1 - s) * 40}px) scale(${0.94 + s * 0.06})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, width: 120, height: 84, justifyContent: "center", borderRadius: 22, background: SURFACE }}>
              {f.bars.map((b, j) => (
                <div key={j} style={{ width: 9, height: 12 + b * 56, borderRadius: 9, background: INDIGO, opacity: 0.35 + b * 0.65 }} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: INK, fontSize: 72, fontWeight: 600, letterSpacing: -2.5 }}>{f.title}</div>
              <div style={{ color: FAINT, fontSize: 40, fontWeight: 500 }}>{f.note}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const value = Math.round(interpolate(frame, [COUNT_FROM, COUNT_TO], [0, 250], clamp));
  const landed = frame >= COUNT_TO;
  const pulse = landed ? interpolate(frame, [COUNT_TO, COUNT_TO + 8], [1.08, 1], clamp) : 1;
  const bars = 40;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginBottom: 24 }}>
        {Array.from({ length: bars }, (_, i) => {
          const on = i / bars <= value / 250;
          const h = 20 + Math.abs(Math.sin(i * 1.7) * 70) + Math.abs(Math.sin(i * 0.6) * 30);
          return <div key={i} style={{ width: 12, height: h, borderRadius: 12, background: on ? INDIGO : LINE }} />;
        })}
      </div>
      <div style={{ color: landed ? INDIGO : INK, fontSize: 230, fontWeight: 700, letterSpacing: -10, lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${pulse})` }}>
        {value}
      </div>
      <div style={{ color: MID, fontSize: 56, fontWeight: 500, letterSpacing: -1.5 }}>free video sounds · CC0 · no sign-up</div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - LOGO_IN, fps, config: { damping: 12, stiffness: 150 } });
  const sub = interpolate(frame, [LOGO_IN + 10, LOGO_IN + 24], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 44 }}>
      <Img src={staticFile("logo-wordmark.png")} style={{ height: 150, opacity: s, transform: `scale(${0.7 + s * 0.3})` }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)` }}>
        <div style={{ color: INK, fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>SoundKit · 250 free video sounds</div>
        <div style={{ fontFamily: MONO, color: MID, fontSize: 42, padding: "12px 26px", borderRadius: 16, background: SURFACE, boxShadow: `0 0 0 2px ${LINE}` }}>
          soundza.com/soundkit
        </div>
      </div>
    </AbsoluteFill>
  );
};
