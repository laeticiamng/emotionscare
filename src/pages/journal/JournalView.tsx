// @ts-nocheck
import { useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JournalComposer } from '@/modules/journal/components/JournalComposer'
import { useJournalComposer } from '@/modules/journal/useJournalComposer'
import { listFeed } from '@/services/journal/journalApi'
import type { SanitizedNote } from '@/modules/journal/types'
import { JournalFeed } from './JournalFeed'
import { PanasSuggestionsCard } from './PanasSuggestionsCard'
import { JournalExportPanel } from '@/components/journal/JournalExportPanel'
import { JournalAnalyticsDashboard } from '@/components/journal/JournalAnalyticsDashboard'

const PAGE_SIZE = 10

export default function JournalView() {
  const composer = useJournalComposer()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [sendingId, setSendingId] = useState<string | null>(null)

  const feedQuery = useInfiniteQuery({
    queryKey: ['journal', 'feed', { search, activeTags }],
    queryFn: ({ pageParam = 0 }) =>
      listFeed({
        q: search.trim() ? search.trim() : undefined,
        tags: activeTags.length ? activeTags : undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    staleTime: 60_000,
  })

  const notes = useMemo(() => feedQuery.data?.pages.flat() ?? [], [feedQuery.data])
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const page of feedQuery.data?.pages ?? []) {
      for (const note of page) {
        note.tags.forEach(tag => tagSet.add(tag))
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [feedQuery.data])

  const toggleTag = (tag: string) => {
    setActiveTags(prev => (prev.includes(tag) ? prev.filter(item => item !== tag) : [...prev, tag]))
  }

  const resetTags = () => {
    setActiveTags([])
  }

  const handleSendToCoach = async (note: SanitizedNote) => {
    try {
      setSendingId(note.id)
      await composer.createCoachDraft({ id: note.id })
      toast({
        title: 'Brouillon envoyé',
        description: 'Le coach préparera une réponse personnalisée à partir de cette note.',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'coach_draft_failed'
      toast({
        title: 'Envoi impossible',
        description: translateCoachError(message),
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

      <div className="grid gap-8 lg:grid-cols-2">
        <JournalAnalyticsDashboard notes={notes} />
        <JournalExportPanel notes={notes} />
      </div>

      <JournalFeed
        search={search}
        onSearchChange={setSearch}
        availableTags={availableTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        onResetTags={resetTags}
        notes={notes}
        isLoading={feedQuery.isLoading}
        isFetchingMore={feedQuery.isFetchingNextPage}
        hasMore={Boolean(feedQuery.hasNextPage)}
        onLoadMore={() => {
          void feedQuery.fetchNextPage()
        }}
        onSendToCoach={handleSendToCoach}
        sendingId={sendingId}
      />
    </div>
  )
}

function translateCoachError(code: string): string {
  switch (code) {
    case 'auth_required':
      return 'Connectez-vous pour transmettre cette note à votre coach.'
    case 'coach_draft_failed':
      return 'La création du brouillon coach a échoué. Réessayez dans quelques instants.'
    default:
      return 'Une erreur inattendue est survenue.'
  }
}
