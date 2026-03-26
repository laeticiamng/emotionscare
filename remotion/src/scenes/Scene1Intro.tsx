import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heartScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleY = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 20, stiffness: 100 } }),
    [0, 1], [60, 0]
  );
  const titleOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [35, 55], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [50, 80], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Heart icon */}
      <div style={{
        transform: `scale(${heartScale})`,
        fontSize: 72,
        marginBottom: 30,
      }}>
        💜
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "sans-serif",
        fontSize: 96,
        fontWeight: 800,
        color: "white",
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        letterSpacing: -3,
        textAlign: "center",
      }}>
        Emotions<span style={{ color: "#8B5CF6" }}>Care</span>
      </h1>

      {/* Accent line */}
      <div style={{
        width: lineWidth,
        height: 3,
        background: "linear-gradient(90deg, #8B5CF6, #60A5FA)",
        borderRadius: 2,
        marginTop: 20,
        marginBottom: 20,
      }} />

      {/* Subtitle */}
      <p style={{
        fontFamily: "sans-serif",
        fontSize: 32,
        color: "rgba(255,255,255,0.7)",
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}px)`,
        textAlign: "center",
        maxWidth: 800,
      }}>
        Gérez votre stress en 3 minutes
      </p>
    </AbsoluteFill>
  );
};
