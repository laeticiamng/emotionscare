"use client";
import React from "react";
import { getEvents } from "@/lib/scores/events";
import { computeSnapshot } from "@/lib/scores/compute";
import { PageHeader, Card, ProgressBar, Sparkline, BadgeLevel, Button } from "@/COMPONENTS.reg";

export default function ScoresV2Panel() {
  const [ts, rerender] = React.useState(0);
  const snap = React.useMemo(() => computeSnapshot(getEvents()), [ts]);
  const values = (snap.byDay ?? []).map(d => d.value ?? 0);

  return (
    <section aria-label="Scores V2">
      <PageHeader title="Scores" subtitle="Progression, streaks et badges" />
      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <BadgeLevel level={snap.level ?? 1} />
            <span>Streak: {snap.streakDays ?? 0} j</span>
            <span>Total: {Math.round(snap.total ?? 0)}</span>
          </div>
          <ProgressBar value={(snap.total ?? 0) % 100} max={100} />
          <Sparkline values={values} />
          <div>
            <strong>Badges :</strong> {(snap.badges ?? []).join(", ") || "—"}
          </div>
          <Button onClick={() => rerender(ts+1)} data-ui="refresh">Actualiser</Button>
        </div>
      </Card>
    </section>
  );
}
