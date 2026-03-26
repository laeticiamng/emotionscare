import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stats = [
  { value: "47%", label: "des soignants en burn-out", delay: 10 },
  { value: "3 min", label: "suffisent pour récupérer", delay: 30 },
  { value: "0€", label: "pour commencer", delay: 50 },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 120 }}>
      <h2 style={{
        fontFamily: "sans-serif",
        fontSize: 56,
        fontWeight: 700,
        color: "white",
        textAlign: "center",
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        marginBottom: 80,
      }}>
        Pour ceux qui prennent soin{"\n"}
        <span style={{ color: "#8B5CF6" }}>des autres</span>
      </h2>

      <div style={{ display: "flex", gap: 80, justifyContent: "center" }}>
        {stats.map((stat, i) => {
          const s = spring({ frame: frame - stat.delay, fps, config: { damping: 15, stiffness: 100 } });
          const scale = interpolate(s, [0, 1], [0.8, 1]);
          const opacity = interpolate(s, [0, 1], [0, 1]);

          return (
            <div key={i} style={{
              textAlign: "center",
              transform: `scale(${scale})`,
              opacity,
            }}>
              <div style={{
                fontFamily: "sans-serif",
                fontSize: 72,
                fontWeight: 800,
                color: "#8B5CF6",
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "sans-serif",
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                marginTop: 12,
                maxWidth: 200,
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
