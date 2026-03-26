import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

const features = [
  { icon: "🌬️", title: "Respiration guidée", desc: "Cohérence cardiaque en 3 min", color: "#60A5FA" },
  { icon: "🧠", title: "Coaching IA", desc: "Accompagnement personnalisé 24/7", color: "#8B5CF6" },
  { icon: "💓", title: "Suivi émotionnel", desc: "Visualisez vos tendances", color: "#F472B6" },
  { icon: "🛡️", title: "100% sécurisé", desc: "RGPD natif, données chiffrées", color: "#34D399" },
];

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; color: string; index: number }> = ({
  icon, title, desc, color, index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 15;

  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const x = interpolate(s, [0, 1], [80, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 24,
      opacity,
      transform: `translateX(${x}px)`,
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16,
      padding: "24px 32px",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{
        fontSize: 48,
        width: 72,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        background: `${color}15`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontFamily: "sans-serif",
          fontSize: 26,
          fontWeight: 700,
          color: "white",
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
        }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: "80px 160px", justifyContent: "center" }}>
      <h2 style={{
        fontFamily: "sans-serif",
        fontSize: 52,
        fontWeight: 700,
        color: "white",
        opacity: titleOpacity,
        marginBottom: 60,
      }}>
        Tout en <span style={{ color: "#8B5CF6" }}>un</span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
