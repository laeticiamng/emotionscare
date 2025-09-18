import React from 'react';
import { FadeIn, PageHeader } from '@/COMPONENTS.reg';
import ScoresV2Panel from '@/modules/scores/ScoresV2Panel';

const HeatmapPage: React.FC = () => {
  return (
    <main className="space-y-8 pb-16" aria-label="Scores et Heatmap">
      <PageHeader
        title="Scores & Heatmap"
        subtitle="Analyse émotionnelle des 30 derniers jours, répartition des séances et vibes marquantes"
      />
      <FadeIn>
        <ScoresV2Panel />
      </FadeIn>
    </main>
  );
};

export default HeatmapPage;
