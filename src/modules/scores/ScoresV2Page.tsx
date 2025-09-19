"use client";
import React from "react";
import { PageHeader, Card, Button } from "@/COMPONENTS.reg";
import ScoresV2Panel from "@/modules/scores/ScoresV2Panel";

export default function ScoresV2Page() {
  return (
    <main aria-label="Scores & vibes">
      <PageHeader title="Scores & vibes" subtitle="Visualisation temps réel des humeurs et séances" />
      <Card>
        <ScoresV2Panel />
        <div style={{ marginTop: 12 }}>
          <Button href="/app/scores">Accéder à la page principale</Button>
        </div>
      </Card>
    </main>
  );
}
