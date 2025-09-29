"use client";
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOverrides, setOverride, clearOverride } from "@/lib/flags/rollout";

const KNOWN = ["scores-v2", "new-audio-engine", "telemetry-opt-in"] as const;

export default function AdminFlagsPage() {
  const [ov, setOv] = React.useState<Record<string, boolean>>(getOverrides());

  function setOn(k: string) { setOverride(k, true); setOv(getOverrides()); }
  function setOff(k: string) { setOverride(k, false); setOv(getOverrides()); }
  function reset(k: string) { clearOverride(k); setOv(getOverrides()); }

  return (
    <main aria-label="Admin Flags">
      <PageHeader title="Admin — Flags" subtitle="Overrides locaux (dev)" />
      <Card>
        <ul style={{ listStyle:"none", padding:0, display:"grid", gap:8 }}>
          {KNOWN.map(k => (
            <li key={k} style={{ border:"1px solid var(--card)", borderRadius: 12, padding: 10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <strong>{k}</strong>
                <span>override: {ov[k] === undefined ? "—" : String(ov[k])}</span>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <Button onClick={() => setOn(k)}>ON</Button>
                <Button onClick={() => setOff(k)}>OFF</Button>
                <Button onClick={() => reset(k)}>Reset</Button>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 12 }}>
          <Button href="/modules/scores">Aller aux Scores actuels</Button>
          <Button href="/modules/scores-v2">Aller aux Scores V2</Button>
        </div>
      </Card>
    </main>
  );
}
