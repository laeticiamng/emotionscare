import { memo } from 'react';
import { JournalUserPreferences } from '@/components/journal/JournalUserPreferences';
import { JournalTagManager } from '@/components/journal/JournalTagManager';
import { JournalTemplates } from '@/components/journal/JournalTemplates';
import type { SanitizedNote } from '@/modules/journal/types';
import { logger } from '@/lib/logger';

interface JournalSettingsPageProps {
  notes?: SanitizedNote[];
}

const JournalSettingsPage = memo<JournalSettingsPageProps>(({ notes = [] }) => {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Personnalisez votre expérience de journaling
        </p>
      </div>

      <JournalUserPreferences />
      
      <JournalTagManager
        notes={notes}
        onTagRenamed={(oldTag, newTag) => logger.info('Tag renamed', { oldTag, newTag }, 'UI')}
        onTagDeleted={(tag) => logger.info('Tag deleted', { tag }, 'UI')}
      />
      
      <JournalTemplates onUseTemplate={(template) => logger.info('Using template', { template }, 'UI')} />
    </div>
  );
});

JournalSettingsPage.displayName = 'JournalSettingsPage';

export default JournalSettingsPage;
