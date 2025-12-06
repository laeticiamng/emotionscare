type Pt = { x: number; y: number };
export function Sparkline({ values=[] as number[], width=200, height=48 }: { values?: number[]; width?: number; height?: number }) {
  if (!values.length) return <svg width={width} height={height} role="img" aria-label="Sparkline vide" />;
  const max = Math.max(...values), min = Math.min(...values);
  const pts: Pt[] = values.map((v,i) => ({
    x: (i/(values.length-1)) * (width-2) + 1,
    y: height - 1 - (max === min ? 0 : ((v-min)/(max-min)) * (height-2))
  }));
  const d = "M " + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
  return (
    <svg width={width} height={height} role="img" aria-label="Historique">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
