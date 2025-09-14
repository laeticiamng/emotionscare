"use client";
import React from "react";
import { PageHeader, Card, Button } from "@/COMPONENTS.reg";
import ScoresV2Panel from "@/modules/scores/ScoresV2Panel";

export default function ScoresV2Page() {
  return (
    <main aria-label="Scores V2">
      <PageHeader title="Scores (V2)" subtitle="Progression, streaks, badges et historique" />
      <Card>
        <ScoresV2Panel />
        <div style={{ marginTop: 12 }}>
          <Button href="/modules/scores">Revenir à la version actuelle</Button>
        </div>
      </Card>
    </main>
  );
}
