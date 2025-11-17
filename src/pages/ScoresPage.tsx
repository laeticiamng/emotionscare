import React from 'react';
import { FadeIn } from '@/ui/motion/FadeIn';
import PageHeader from '@/components/ui/PageHeader';
import { useFlags } from '@/core/flags';
import ScoresV2Panel from '@/modules/scores/ScoresV2Panel';

const ScoresPage: React.FC = () => {
  const { flags } = useFlags();

  if (!flags.FF_SCORES) {
    return (
      <main className="space-y-8 pb-16" aria-label="Scores émotionnels">
        <PageHeader
          title="Scores & vibes"
          subtitle="Visualisation synthétique de vos scans, séances et vibes dominantes sur les dernières semaines"
        />
        <section className="rounded-lg border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
          Cette visualisation est en phase de lancement et n'est pas encore activée pour votre espace.
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8 pb-16" aria-label="Scores émotionnels">
      <PageHeader
        title="Scores & vibes"
        subtitle="Visualisation synthétique de vos scans, séances et vibes dominantes sur les dernières semaines"
      />
      <FadeIn>
        <ScoresV2Panel />
      </FadeIn>
      <section className="space-y-2 text-sm text-muted-foreground" aria-live="polite">
        <p>
          Toutes les données sont agrégées côté client et restent soumises aux règles de sécurité Supabase (RLS). Les vibes sont dérivées des labels de vos scans émotionnels.
        </p>
        <p>
          En cas de préférence «&nbsp;réduire les animations&nbsp;», les transitions des graphiques sont désactivées automatiquement.
        </p>
      </section>
    </main>
  );
};

export default ScoresPage;
