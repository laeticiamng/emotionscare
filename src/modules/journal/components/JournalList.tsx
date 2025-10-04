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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const applyInlineMarkdown = (value: string) => {
  let next = value
  next = next.replace(/\[(.+?)]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  next = next.replace(/(?<!\\)\*\*(.+?)(?<!\\)\*\*/g, '<strong>$1</strong>')
  next = next.replace(/(?<!\\)\*(.+?)(?<!\\)\*/g, '<em>$1</em>')
  next = next.replace(/(?<!\\)`(.+?)(?<!\\)`/g, '<code>$1</code>')
  next = next.replace(/(https?:\/\/[^\s<]+)(?![^<]*>)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
  return next.replace(/\\(\*|`)/g, '$1')
}

const renderMarkdown = (input: string) => {
  const lines = escapeHtml(input).split(/\r?\n/)
  const htmlParts: string[] = []
  let buffer: string[] = []
  let inList = false

  const flushParagraph = () => {
    if (!buffer.length) return
    const paragraph = buffer.join(' ')
    htmlParts.push(`<p>${applyInlineMarkdown(paragraph)}</p>`)
    buffer = []
  }

  const closeList = () => {
    if (!inList) return
    htmlParts.push('</ul>')
    inList = false
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (!trimmed) {
      flushParagraph()
      closeList()
      continue
    }

    const listMatch = /^[-*]\s+(.*)$/.exec(trimmed)
    if (listMatch) {
      if (!inList) {
        flushParagraph()
        htmlParts.push('<ul>')
        inList = true
      }
      htmlParts.push(`<li>${applyInlineMarkdown(listMatch[1])}</li>`)
      continue
    }

    closeList()
    buffer.push(trimmed)
  }

  flushParagraph()
  closeList()

  return htmlParts.join('')
}

export function SafeNote({ text }: { text: string }) {
  const html = useMemo(() => {
    const rendered = renderMarkdown(text)
    return DOMPurify.sanitize(rendered, {
      ALLOWED_TAGS: ['p', 'em', 'strong', 'a', 'ul', 'li', 'code'],
      ALLOWED_ATTR: { a: ['href', 'target', 'rel'] } as any,
      ADD_ATTR: ['rel'],
    })
  }, [text])

  return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
}
