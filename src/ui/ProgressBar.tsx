export function ProgressBar({ value=0, max=100 }: { value?: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div aria-label="Progression" style={{ background: "var(--card)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: 8, background: "var(--accent)" }} />
    </div>
  );
}
