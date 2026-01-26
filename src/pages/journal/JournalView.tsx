// @ts-nocheck
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JournalComposer } from '@/modules/journal/components/JournalComposer'
import { useJournalComposer } from '@/modules/journal/useJournalComposer'
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched'
import type { SanitizedNote } from '@/modules/journal/types'
import { JournalFeed } from './JournalFeed'
import { PanasSuggestionsCard } from './PanasSuggestionsCard'
import { JournalExportPanel } from '@/components/journal/JournalExportPanel'
import { JournalAnalyticsDashboard } from '@/components/journal/JournalAnalyticsDashboard'
import { JournalWordCloud } from '@/components/journal/JournalWordCloud'
import { LivingPagesAnimation } from '@/components/journal/LivingPagesAnimation'
import { JournalStatsCard } from '@/modules/journal/components/JournalStatsCard'
import { JournalEditDialog } from '@/modules/journal/components/JournalEditDialog'
import { FileText, Heart, BarChart3 } from 'lucide-react'

export default function JournalView() {
  const composer = useJournalComposer()
  const journal = useJournalEnriched()
  const { toast } = useToast()
  const [sendingId, setSendingId] = useState<string | null>(null)

  const handleSendToCoach = async (note: SanitizedNote) => {
    try {
      setSendingId(note.id ?? null)
      await composer.createCoachDraft({ id: note.id ?? '' })
      toast({
        title: 'Brouillon envoyé',
        description: 'Le coach préparera une réponse personnalisée.',
      })
    } catch {
      toast({
        title: 'Envoi impossible',
        description: 'Une erreur est survenue.',
        variant: 'destructive',
      })
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Composer une note</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <JournalComposer composer={composer} />
        </CardContent>
      </Card>

      <PanasSuggestionsCard composer={composer} />

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Notes ({journal.notes.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" />
            Favoris ({journal.favorites.length})
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <JournalAnalyticsDashboard notes={journal.notes} />
            <JournalExportPanel notes={journal.notes} />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <LivingPagesAnimation notes={journal.notes} maxPages={12} />
            <JournalWordCloud notes={journal.notes} maxWords={50} />
          </div>

          <JournalFeed
            search={journal.search}
            onSearchChange={journal.setSearch}
            availableTags={journal.availableTags}
            activeTags={journal.activeTags}
            onToggleTag={journal.toggleTag}
            onResetTags={journal.resetTags}
            notes={journal.notes}
            isLoading={journal.isLoading}
            isFetchingMore={journal.isFetchingMore}
            hasMore={journal.hasMore}
            onLoadMore={journal.loadMore}
            onSendToCoach={handleSendToCoach}
            sendingId={sendingId}
            onDelete={journal.handleDelete}
            onToggleFavorite={journal.handleToggleFavorite}
            onEdit={journal.setEditingNote}
            isFavorite={journal.isFavorite}
          />
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {journal.favorites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun favori pour le moment.</p>
                <p className="text-sm">Cliquez sur le cœur d'une note pour l'ajouter ici.</p>
              </CardContent>
            </Card>
          ) : (
            <JournalFeed
              search=""
              onSearchChange={() => {}}
              availableTags={[]}
              activeTags={[]}
              onToggleTag={() => {}}
              onResetTags={() => {}}
              notes={journal.favorites}
              isLoading={journal.isLoadingFavorites}
              isFetchingMore={false}
              hasMore={false}
              onLoadMore={() => {}}
              onSendToCoach={handleSendToCoach}
              sendingId={sendingId}
              onDelete={journal.handleDelete}
              onToggleFavorite={journal.handleToggleFavorite}
              onEdit={journal.setEditingNote}
              isFavorite={journal.isFavorite}
            />
          )}
        </TabsContent>

        <TabsContent value="stats">
          <JournalStatsCard stats={journal.stats} isLoading={journal.isLoadingStats} />
        </TabsContent>
      </Tabs>

      <JournalEditDialog
        note={journal.editingNote}
        isOpen={Boolean(journal.editingNote)}
        onClose={() => journal.setEditingNote(null)}
        onSave={journal.handleUpdate}
        isLoading={journal.isUpdating}
      />
    </div>
  )
}
