import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalHeatmap } from '@/components/journal/JournalHeatmap';
import { JournalStreak } from '@/components/journal/JournalStreak';
import { JournalPersonalStats } from '@/components/journal/JournalPersonalStats';

interface JournalActivityPageProps {
  notes: SanitizedNote[];
}

export const JournalActivityPage = memo<JournalActivityPageProps>(({ notes }) => {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activité</h2>
        <p className="text-muted-foreground">
          Visualisez votre constance et vos statistiques d'écriture
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <JournalStreak notes={notes} />
        <JournalPersonalStats notes={notes} />
      </div>

      <JournalHeatmap notes={notes} year={new Date().getFullYear()} />
    </div>
  );
});

JournalActivityPage.displayName = 'JournalActivityPage';
