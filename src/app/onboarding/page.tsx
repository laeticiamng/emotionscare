"use client";
import React from "react";
import { PageHeader, Button, Card, LoadingSpinner } from "@/COMPONENTS.reg";
import { OnboardingPrefs } from "@/SCHEMA";
import { z } from "zod";

export default function OnboardingPage() {
  const [step, setStep] = React.useState<1|2|3>(1);
  const [busy, setBusy] = React.useState(false);
  const [prefs, setPrefs] = React.useState<z.infer<typeof OnboardingPrefs>>({});

  const next = () => setStep(s => (s < 3 ? ((s+1) as 1|2|3) : s));
  const prev = () => setStep(s => (s > 1 ? ((s-1) as 1|2|3) : s));

  async function finish() {
    setBusy(true);
    try {
      // persistance locale non bloquante (append-only)
      localStorage.setItem("onboarding_prefs", JSON.stringify(prefs));
      window.location.assign("/"); // ou route tableau de bord
    } finally {
      setBusy(false);
    }
  }

  return (
    <main aria-label="Parcours d’onboarding">
      <PageHeader title="Bienvenue" subtitle="Personnalise ton expérience en 2 minutes" />
      <Card>
        {busy && <LoadingSpinner aria-label="Chargement" />}

        {step === 1 && !busy && (
          <section aria-labelledby="step1">
            <h2 id="step1">Bienvenue 👋</h2>
            <p>On va régler quelques préférences pour personnaliser ton expérience.</p>
            <Button onClick={next} data-ui="primary-cta">Commencer</Button>
          </section>
        )}

        {step === 2 && !busy && (
          <section aria-labelledby="step2">
            <h2 id="step2">Préférences</h2>
            <label>
              <input
                type="checkbox"
                aria-describedby="desc-music"
                checked={!!prefs.musicRelax}
                onChange={(e) => setPrefs(p => ({ ...p, musicRelax: e.target.checked }))}
              />
              Activer la musique relax par défaut
            </label>
            <div id="desc-music">Ajoute une ambiance relax automatiquement lors des sessions.</div>

            <div style={{ marginTop: 12 }}>
              <label>
                Durée par défaut (min){" "}
                <input
                  type="number"
                  min={5} max={60}
                  value={prefs.defaultDurationMin ?? 15}
                  onChange={(e) => setPrefs(p => ({ ...p, defaultDurationMin: Number(e.target.value) }))}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Button onClick={prev}>Retour</Button>
              <Button onClick={next}>Suivant</Button>
            </div>
          </section>
        )}

        {step === 3 && !busy && (
          <section aria-labelledby="step3">
            <h2 id="step3">Récapitulatif</h2>
            <ul>
              <li>Musique relax : {prefs.musicRelax ? "Oui" : "Non"}</li>
              <li>Durée par défaut : {prefs.defaultDurationMin ?? 15} min</li>
            </ul>
            <Button onClick={finish}>Terminer</Button>
          </section>
        )}
      </Card>
    </main>
  );
}

