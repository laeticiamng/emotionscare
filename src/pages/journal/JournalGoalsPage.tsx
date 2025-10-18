import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalWritingGoals } from '@/components/journal/JournalWritingGoals';
import { JournalAchievements } from '@/components/journal/JournalAchievements';

interface JournalGoalsPageProps {
  notes: SanitizedNote[];
}

export const JournalGoalsPage = memo<JournalGoalsPageProps>(({ notes }) => {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Objectifs & Achievements</h2>
        <p className="text-muted-foreground">
          Suivez votre progression et débloquez des achievements
        </p>
      </div>

      <JournalWritingGoals notes={notes} />
      
      <JournalAchievements notes={notes} />
    </div>
  );
});

JournalGoalsPage.displayName = 'JournalGoalsPage';
