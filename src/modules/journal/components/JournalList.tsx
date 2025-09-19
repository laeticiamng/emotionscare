import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SanitizedNote } from '../types'
import { Loader2, MessageSquare } from 'lucide-react'

type JournalListProps = {
  notes: SanitizedNote[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onSendToCoach: (note: SanitizedNote) => Promise<void>
  sendingId?: string | null
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function JournalList({
  notes,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onSendToCoach,
  sendingId,
}: JournalListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Chargement du journal…
      </div>
    )
  }

  if (!notes.length) {
    return (
      <Card aria-live="polite">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Commencez par ajouter votre première note pour nourrir votre coach.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3" data-testid="journal-feed">
        {notes.map(note => (
          <li key={note.id} data-testid="journal-feed-entry">
            <Card>
              <CardContent className="space-y-3 py-5">
                <header className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{dateFormatter.format(new Date(note.created_at))}</span>
                  {note.summary && <span className="italic">{note.summary}</span>}
                </header>
                <SafeNote text={note.text} />
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSendToCoach(note)}
                    disabled={sendingId === note.id}
                  >
                    {sendingId === note.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Envoi…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" aria-hidden="true" />
                        Envoyer au coach
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Chargement…
              </span>
            ) : (
              'Charger plus'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export function SafeNote({ text }: { text: string }) {
  const html = useMemo(() => {
    const escaped = text.replace(/\n/g, '<br />')
    return DOMPurify.sanitize(escaped, {
      ALLOWED_TAGS: ['br', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: { a: ['href', 'target', 'rel'] },
      ADD_ATTR: ['rel'],
    })
  }, [text])

  return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
}
