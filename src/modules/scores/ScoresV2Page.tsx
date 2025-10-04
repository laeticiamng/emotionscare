"use client";
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoresV2Panel from "@/modules/scores/ScoresV2Panel";

export default function ScoresV2Page() {
  return (
    <main aria-label="Scores & vibes">
      <PageHeader title="Scores & vibes" subtitle="Visualisation temps réel des humeurs et séances" />
      <Card>
        <ScoresV2Panel />
        <div style={{ marginTop: 12 }}>
          <Button asChild>
            <Link to="/app/scores">Accéder à la page principale</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
