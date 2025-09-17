"use client";
import React from "react";
import { PageHeader, Card, Button, AudioPlayer } from "@/COMPONENTS.reg";
import { ff } from "@/lib/flags/ff";
import { recordEvent } from "@/lib/scores/events";

export default function AdaptiveMusicPage() {
  const useNewAudio = ff?.("new-audio-engine") ?? false;

  const onStart = async () => {
    recordEvent?.({
      module: "adaptive-music",
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationSec: 120,
      score: 3,
      meta: { action: "start" }
    });
  };

  return (
    <main aria-label="Adaptive Music">
      <PageHeader title="Adaptive Music" subtitle="Lecture adaptative avec loop & volume" />
      <Card>
        {useNewAudio ? (
          <div style={{ display: "grid", gap: 12 }}>
            <AudioPlayer
              src="/audio/lofi-120.mp3"
              trackId="adaptive-lofi-120"
              title="Lofi 120"
              loop
              defaultVolume={0.75}
              haptics
            />
            <Button onClick={onStart} data-ui="primary-cta">Lancer</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {/* Chemin existant conservé (append-only) : remets ici l’UI audio actuelle si elle existe */}
            <p>Mode audio existant (flag OFF). Active "new-audio-engine" pour tester le nouveau lecteur.</p>
            <Button onClick={onStart} data-ui="primary-cta">Lancer</Button>
          </div>
        )}
      </Card>
    </main>
  );
}
