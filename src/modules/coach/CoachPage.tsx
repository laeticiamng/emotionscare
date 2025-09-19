"use client";
import React from "react";
import * as Sentry from "@sentry/react";
import { PageHeader, Card, Button } from "@/COMPONENTS.reg";
import { getCoachContext } from "@/lib/coach/context";
import { buildAdvice } from "@/lib/coach/engine";
import { usePrefetchOnHover } from "@/COMPONENTS.reg"; // dispo via P3
import { recordEvent } from "@/lib/scores/events";     // P6 (toléré si absent)

export default function CoachPage() {
  const [mode, setMode] = React.useState<"soft"|"boost">("soft");
  const [advice, setAdvice] = React.useState(() => buildAdvice(getCoachContext(), "soft"));

  function regen(m: "soft"|"boost" = mode) {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.addBreadcrumb({
        category: "coach",
        level: "info",
        message: "coach:generate:start",
        data: { mode: m },
      });
      Sentry.configureScope(scope => {
        scope.setTag("coach_mode", m);
      });
    }

    try {
      const nextAdvice = buildAdvice(getCoachContext(), m);
      setAdvice(nextAdvice);
      if (client) {
        Sentry.addBreadcrumb({
          category: "coach",
          level: "info",
          message: "coach:generate:success",
          data: { count: nextAdvice.length },
        });
      }
    } catch (error) {
      if (client) {
        Sentry.addBreadcrumb({
          category: "coach",
          level: "error",
          message: "coach:generate:error",
          data: { reason: error instanceof Error ? error.name : "unknown" },
        });
      }
      throw error;
    }
  }

  function onLaunch(a: { key: string; href: string }) {
    try {
      recordEvent?.({
        module: "coach",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationSec: 60,
        score: 1,
        meta: { advice: a.key, href: a.href }
      });
    } catch {}
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.addBreadcrumb({
        category: "coach",
        level: "info",
        message: "coach:launch",
        data: { key: a.key },
      });
    }
  }

  React.useEffect(() => {
    regen(mode);
  }, [mode]);

  return (
    <main aria-label="Coach">
      <PageHeader title="Coach" subtitle="Des conseils courts et actionnables, adaptés à ton moment." />
      <Card>
        <div style={{ display:"flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <label>
            Mode
            <select value={mode} onChange={(e)=>setMode(e.target.value as any)}>
              <option value="soft">Doux</option>
              <option value="boost">Boost</option>
            </select>
          </label>
          <Button onClick={()=>regen()}>Rafraîchir</Button>
        </div>

        <ul style={{ listStyle:"none", padding:0, display:"grid", gap: 10 }}>
          {advice.map(a => {
            const pre = usePrefetchOnHover?.(a.cta.href) ?? {};
            return (
              <li key={a.key} style={{ border:"1px solid var(--card)", borderRadius: 12, padding: 12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap: 8 }}>
                  <strong>{a.title}</strong>
                  {a.tag && <span style={{ opacity:.8 }}>#{a.tag}</span>}
                </div>
                <p style={{ marginTop: 6 }}>{a.body}</p>
                <Button {...pre} href={a.cta.href} onClick={()=>onLaunch({ key: a.key, href: a.cta.href })} data-ui="primary-cta">
                  {a.cta.label}
                </Button>
              </li>
            );
          })}
          {!advice.length && <em>Aucun conseil pour l’instant. Change de mode ou refais un Emotion Scan.</em>}
        </ul>

        <small style={{ opacity:.7, display:"block", marginTop: 8 }}>
          Astuce : fais un Emotion Scan si tu veux des conseils plus précis.
        </small>
      </Card>
    </main>
  );
}
