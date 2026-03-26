import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [20, 45], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 45, fps, config: { damping: 12, stiffness: 100 } });
  const urlOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gentle pulse on CTA
  const pulse = interpolate(
    Math.sin((frame - 65) * 0.08),
    [-1, 1],
    [1, 1.03]
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        fontFamily: "sans-serif",
        fontSize: 80,
        fontWeight: 800,
        color: "white",
        textAlign: "center",
        opacity: titleOpacity,
        transform: `scale(${titleScale})`,
        lineHeight: 1.1,
        letterSpacing: -2,
      }}>
        Prenez soin de{"\n"}
        <span style={{ color: "#8B5CF6" }}>vous</span> aussi.
      </h2>

      <p style={{
        fontFamily: "sans-serif",
        fontSize: 24,
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        marginTop: 30,
        opacity: subOpacity,
        transform: `translateY(${subY}px)`,
      }}>
        Gratuit pour commencer. Sans engagement.
      </p>

      {/* CTA button */}
      <div style={{
        marginTop: 50,
        opacity: ctaOpacity,
        transform: `scale(${ctaScale * pulse})`,
      }}>
        <div style={{
          background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
          borderRadius: 16,
          padding: "20px 48px",
          fontFamily: "sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "white",
          boxShadow: "0 8px 30px rgba(139,92,246,0.4)",
        }}>
          Commencer gratuitement →
        </div>
      </div>

      {/* URL */}
      <p style={{
        fontFamily: "sans-serif",
        fontSize: 18,
        color: "rgba(255,255,255,0.35)",
        marginTop: 30,
        opacity: urlOpacity,
        letterSpacing: 1,
      }}>
        emotions-care.lovable.app
      </p>
    </AbsoluteFill>
  );
};
