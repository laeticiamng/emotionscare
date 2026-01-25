/**
 * JournalSettingsPage - Paramètres enrichis du journal
 * Utilise useJournalEnriched pour les données dynamiques
 */
import { memo } from 'react';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { JournalUserPreferences } from '@/components/journal/JournalUserPreferences';
import { JournalTagManager } from '@/components/journal/JournalTagManager';
import { JournalTemplates } from '@/components/journal/JournalTemplates';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';
import { Settings, Tag, FileText, Shield, Flame, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const JournalSettingsPage = memo(() => {
  const { notes, stats, isLoading, isLoadingStats, availableTags } = useJournalEnriched();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" aria-hidden="true" />
          Paramètres du Journal
        </h1>
        <p className="text-muted-foreground mt-1">
          Personnalisez votre expérience d'écriture
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.totalNotes}</p>
                )}
                <p className="text-xs text-muted-foreground">Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Tag className="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{availableTags.length}</p>
                )}
                <p className="text-xs text-muted-foreground">Tags uniques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
              </div>
              <div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.currentStreak}</p>
                )}
                <p className="text-xs text-muted-foreground">Jours de suite</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" aria-hidden="true" />
              </div>
              <div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.avgWordsPerNote}</p>
                )}
                <p className="text-xs text-muted-foreground">Mots/note</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Badge */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Shield className="h-5 w-5 text-secondary-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Chiffrement AES-256</p>
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées avec un chiffrement de niveau bancaire
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">Actif</Badge>
          </div>
        </CardContent>
      </Card>

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
