import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalAnalyticsDashboard } from '@/components/journal/JournalAnalyticsDashboard';
import { JournalAIInsights } from '@/components/journal/JournalAIInsights';
import { JournalPeriodComparison } from '@/components/journal/JournalPeriodComparison';

interface JournalAnalyticsPageProps {
  notes: SanitizedNote[];
}

export const JournalAnalyticsPage = memo<JournalAnalyticsPageProps>(({ notes }) => {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble complète de votre activité d'écriture
        </p>
      </div>

      <JournalAIInsights notes={notes} />
      
      <JournalPeriodComparison notes={notes} />
      
      <JournalAnalyticsDashboard notes={notes} />
    </div>
  );
});

JournalAnalyticsPage.displayName = 'JournalAnalyticsPage';
