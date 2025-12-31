// @ts-nocheck
/**
 * JournalSettingsPage - Paramètres enrichis
 */
import { memo } from 'react';
import { JournalUserPreferences } from '@/components/journal/JournalUserPreferences';
import { JournalTagManager } from '@/components/journal/JournalTagManager';
import { JournalTemplates } from '@/components/journal/JournalTemplates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SanitizedNote } from '@/modules/journal/types';
import { logger } from '@/lib/logger';
import { Settings, Tag, FileText, Shield, Bell } from 'lucide-react';

interface JournalSettingsPageProps {
  notes?: SanitizedNote[];
}

const JournalSettingsPage = memo<JournalSettingsPageProps>(({ notes = [] }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" aria-hidden="true" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Personnalisez votre expérience
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-xs text-muted-foreground">Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Tag className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(notes.flatMap(n => n.tags || [])).size}
                </p>
                <p className="text-xs text-muted-foreground">Tags uniques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Shield className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">AES-256</p>
                <p className="text-xs text-muted-foreground">Chiffrement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences */}
      <JournalUserPreferences />
      
      {/* Tag Manager */}
      <JournalTagManager
        notes={notes}
        onTagRenamed={(oldTag, newTag) => logger.info('Tag renamed', { oldTag, newTag }, 'UI')}
        onTagDeleted={(tag) => logger.info('Tag deleted', { tag }, 'UI')}
      />
      
      {/* Templates */}
      <JournalTemplates onUseTemplate={(template) => logger.info('Using template', { template }, 'UI')} />
    </div>
  );
});

JournalSettingsPage.displayName = 'JournalSettingsPage';

export default JournalSettingsPage;
