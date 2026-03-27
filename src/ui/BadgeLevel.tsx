// @ts-nocheck
export function BadgeLevel({ level=1 }: { level?: number }) {
  return (
    <span aria-label={`Niveau ${level}`} style={{ padding: "2px 8px", borderRadius: 999, background: "var(--card)" }}>
      Niveau {level}
    </span>
  );
}
