// @ts-nocheck
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import type { SanitizedNote } from '@/modules/journal/types'
import { JournalList } from '@/modules/journal/components/JournalList'
import { TagFilter } from '@/modules/journal/components/TagFilter'

type JournalFeedProps = {
  search: string
  onSearchChange: (value: string) => void
  availableTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
  onResetTags: () => void
  notes: SanitizedNote[]
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
  onSendToCoach: (note: SanitizedNote) => Promise<void>
  sendingId: string | null
  // Enriched props
  onDelete?: (noteId: string) => void
  onToggleFavorite?: (noteId: string) => void
  onEdit?: (note: SanitizedNote) => void
  isFavorite?: (noteId: string) => boolean
}

export function JournalFeed({
  search,
  onSearchChange,
  availableTags,
  activeTags,
  onToggleTag,
  onResetTags,
  notes,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onSendToCoach,
  sendingId,
  onDelete,
  onToggleFavorite,
  onEdit,
  isFavorite,
}: JournalFeedProps) {
  return (
    <Card>
      <CardContent className="space-y-6 py-6">
        <div className="space-y-2">
          <Label htmlFor="journal-search">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="journal-search"
              value={search}
              onChange={event => onSearchChange(event.target.value)}
              placeholder="Recherchez dans vos notes ou #tags"
              className="pl-9"
              data-testid="journal-search-input"
            />
          </div>
        </div>

        <TagFilter
          tags={availableTags}
          active={activeTags}
          onToggle={onToggleTag}
          onReset={onResetTags}
          isLoading={isLoading}
        />

        <JournalList
          notes={notes}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onSendToCoach={onSendToCoach}
          sendingId={sendingId}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          isFavorite={isFavorite}
        />
      </CardContent>
    </Card>
  )
}
