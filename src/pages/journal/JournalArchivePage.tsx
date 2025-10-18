import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalExportPanel } from '@/components/journal/JournalExportPanel';
import { JournalBackup } from '@/components/journal/JournalBackup';
import { JournalAdvancedExport } from '@/components/journal/JournalAdvancedExport';

interface JournalArchivePageProps {
  notes: SanitizedNote[];
}

export const JournalArchivePage = memo<JournalArchivePageProps>(({ notes }) => {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Archive & Export</h2>
        <p className="text-muted-foreground">
          Sauvegardez et exportez vos notes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <JournalExportPanel notes={notes} />
        <JournalBackup notes={notes} onRestore={async (importedNotes) => {
          console.log('Restored:', importedNotes);
        }} />
      </div>

      <JournalAdvancedExport notes={notes} />
    </div>
  );
});

JournalArchivePage.displayName = 'JournalArchivePage';
