import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const gradientAngle = interpolate(frame, [0, 600], [135, 180]);
  const hueShift = interpolate(frame, [0, 600], [0, 20]);

  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(${gradientAngle}deg, 
            hsl(${222 + hueShift}, 47%, 8%) 0%, 
            hsl(${235 + hueShift}, 40%, 12%) 40%, 
            hsl(${250 + hueShift}, 35%, 10%) 100%)`,
        }}
      />
      {/* Subtle floating orbs */}
      {[0, 1, 2].map((i) => {
        const x = interpolate(
          frame,
          [0, 600],
          [200 + i * 500, 300 + i * 500],
          { extrapolateRight: "clamp" }
        );
        const y = interpolate(
          frame,
          [0, 300, 600],
          [200 + i * 200, 100 + i * 200, 200 + i * 200]
        );
        const opacity = 0.06 + i * 0.02;
        const size = 400 + i * 100;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, hsla(${250 + i * 30}, 60%, 50%, ${opacity}) 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
