import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene4Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mockupScale = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const mockupOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Breathing circle animation
  const breathCycle = interpolate(frame % 120, [0, 60, 120], [1, 1.4, 1]);
  const breathOpacity = interpolate(frame % 120, [0, 60, 120], [0.3, 0.8, 0.3]);

  // Progress bar
  const progress = interpolate(frame, [30, 100], [0, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phone mockup */}
      <div style={{
        width: 380,
        height: 720,
        borderRadius: 40,
        background: "linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(20,20,40,0.98) 100%)",
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.1)",
        padding: "40px 24px 24px",
        transform: `scale(${mockupScale})`,
        opacity: mockupOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}>
        {/* Status bar */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "sans-serif",
        }}>
          <span>9:41</span>
          <span>EmotionsCare</span>
          <span>●●●</span>
        </div>

        {/* Greeting */}
        <div style={{
          fontFamily: "sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: "white",
          textAlign: "center",
          marginTop: 20,
        }}>
          Bonjour 👋
        </div>
        <div style={{
          fontFamily: "sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
        }}>
          Comment vous sentez-vous ?
        </div>

        {/* Breathing circle */}
        <div style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `2px solid rgba(139,92,246,${breathOpacity})`,
          transform: `scale(${breathCycle})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}>
          <div style={{
            fontFamily: "sans-serif",
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
          }}>
            {frame % 120 < 60 ? "Inspirez" : "Expirez"}
          </div>
        </div>

        {/* Mood bar */}
        <div style={{ width: "100%", marginTop: 20 }}>
          <div style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 8,
          }}>
            Bien-être aujourd'hui
          </div>
          <div style={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 4,
              background: "linear-gradient(90deg, #8B5CF6, #60A5FA)",
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: 16,
          width: "100%",
          marginTop: 12,
        }}>
          {[
            { emoji: "🧘", val: "12", label: "Sessions" },
            { emoji: "⏱", val: "36m", label: "Temps" },
            { emoji: "🔥", val: "5j", label: "Streak" },
          ].map((s, i) => {
            const cardOpacity = interpolate(frame, [40 + i * 12, 55 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                padding: "12px 8px",
                textAlign: "center",
                opacity: cardOpacity,
              }}>
                <div style={{ fontSize: 20 }}>{s.emoji}</div>
                <div style={{
                  fontFamily: "sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  marginTop: 4,
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: "sans-serif",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
