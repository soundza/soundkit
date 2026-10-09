import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SoundzaMusicBed, SoundzaSound } from "./soundza";

// Scene lengths and the moments that make a sound, in frames at 30 fps.
const T = 15; // each slide transition
const SCENES = [75, 90, 90, 105];
const TITLE_IN = 8;
const POPS = [12, 26, 40]; // feature rows, in scene 2's time
const COUNT_FROM = 10;
const COUNT_TO = 55; // in scene 3's time
const LOGO_IN = 20; // in scene 4's time

/** Where each scene starts: scenes overlap by T during a transition. */
const STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((sum, len) => sum + len - T, 0));
export const PROMO_FRAMES = SCENES.reduce((sum, len) => sum + len, 0) - T * (SCENES.length - 1);
/** The middle of each transition, where its whoosh should peak. */
const CUTS = STARTS.slice(1).map((start) => start + T / 2);

const BG = "#0e0f13";
const INK = "#f4f1ea";
const ACCENT = "#ff6a3d";
const FONT = "Inter, system-ui, -apple-system, sans-serif";

export const Promo: React.FC = () => {
  const ticks = [];
  for (let f = COUNT_FROM; f < COUNT_TO; f += 5) ticks.push(STARTS[2] + f);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <Title />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <Features />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <Counter />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Sound design: each hit lands on the frame its animation starts. */}
      <SoundzaSound name="title-hit" at={TITLE_IN} volume={0.9} />
      {CUTS.map((cut) => (
        <SoundzaSound key={cut} name="whoosh" at={cut} volume={0.7} />
      ))}
      {POPS.map((pop) => (
        <SoundzaSound key={pop} name="pop" at={STARTS[1] + pop} volume={0.5} />
      ))}
      {ticks.map((tick) => (
        <SoundzaSound key={tick} name="tick" at={tick} volume={0.3} />
      ))}
      <SoundzaSound name="ding" at={STARTS[2] + COUNT_TO} volume={0.6} />
      <SoundzaSound name="riser" at={STARTS[3] + LOGO_IN} volume={0.6} />
      <SoundzaSound name="logo-hit" at={STARTS[3] + LOGO_IN} volume={0.9} />
      <SoundzaMusicBed name="music" volume={0.3} duckAt={[TITLE_IN, STARTS[3] + LOGO_IN]} />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - TITLE_IN, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, color: INK, fontSize: 104, fontWeight: 800, letterSpacing: -3, transform: `scale(${0.6 + pop * 0.4})`, opacity: pop }}>
        Sound for every <span style={{ color: ACCENT }}>frame</span>
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = ["Whooshes on every cut", "Hits on every title", "A music bed that fits"];

const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#16171d", justifyContent: "center", paddingLeft: 180, gap: 36 }}>
      {FEATURES.map((text, i) => {
        const s = spring({ frame: frame - POPS[i], fps, config: { damping: 14, stiffness: 220 } });
        return (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 28, opacity: s, transform: `translateX(${(1 - s) * -40}px) scale(${0.9 + s * 0.1})` }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ACCENT }} />
            <div style={{ fontFamily: FONT, color: INK, fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>{text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const value = Math.round(interpolate(frame, [COUNT_FROM, COUNT_TO], [0, 5600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const landed = frame >= COUNT_TO;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", gap: 12 }}>
      <div style={{ fontFamily: FONT, color: landed ? ACCENT : INK, fontSize: 200, fontWeight: 800, letterSpacing: -6, fontVariantNumeric: "tabular-nums" }}>
        {value.toLocaleString("en-US")}
      </div>
      <div style={{ fontFamily: FONT, color: "#9a978f", fontSize: 40, fontWeight: 500 }}>free sounds, searchable by description</div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - LOGO_IN, fps, config: { damping: 10, stiffness: 160 } });
  const glow = interpolate(frame, [LOGO_IN, LOGO_IN + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0d", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: FONT, color: INK, fontSize: 120, fontWeight: 800, letterSpacing: -4, transform: `scale(${0.5 + s * 0.5})`, opacity: s, textShadow: `0 0 ${60 * glow}px ${ACCENT}` }}>
        soundza
      </div>
      <div style={{ fontFamily: FONT, color: "#9a978f", fontSize: 34, fontWeight: 500, opacity: interpolate(frame, [LOGO_IN + 10, LOGO_IN + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        npx skills add soundza/soundza-remotion
      </div>
    </AbsoluteFill>
  );
};
