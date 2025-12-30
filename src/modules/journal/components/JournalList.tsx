import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import type { SanitizedNote } from '../types'
import { Loader2, MessageSquare, Heart, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type JournalListProps = {
  notes: SanitizedNote[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onSendToCoach: (note: SanitizedNote) => Promise<void>
  sendingId?: string | null
  // New enriched props
  onDelete?: (noteId: string) => void
  onToggleFavorite?: (noteId: string) => void
  onEdit?: (note: SanitizedNote) => void
  isFavorite?: (noteId: string) => boolean
  isDeleting?: boolean
  isTogglingFavorite?: boolean
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
  onDelete,
  onToggleFavorite,
  onEdit,
  isFavorite,
  isDeleting,
  isTogglingFavorite,
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
    <TooltipProvider>
      <div className="space-y-4">
        <ul className="space-y-3" data-testid="journal-feed">
          {notes.map(note => {
            const noteIsFavorite = isFavorite?.(note.id ?? '') ?? false
            
            return (
              <li key={note.id} data-testid="journal-feed-entry">
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="space-y-3 py-5">
                    <header className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>{dateFormatter.format(new Date(note.created_at))}</span>
                        {note.mode && (
                          <Badge variant="outline" className="text-[10px]">
                            {note.mode === 'voice' ? '🎤 Vocal' : '✍️ Texte'}
                          </Badge>
                        )}
                      </div>
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
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                      {/* Action buttons on the left */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {onToggleFavorite && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleFavorite(note.id ?? '')}
                                disabled={isTogglingFavorite}
                                className={cn(noteIsFavorite && 'text-red-500')}
                                aria-label={noteIsFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                              >
                                <Heart className={cn('h-4 w-4', noteIsFavorite && 'fill-current')} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{noteIsFavorite ? 'Retirer des favoris' : 'Favoris'}</TooltipContent>
                          </Tooltip>
                        )}
                        
                        {onEdit && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(note)}
                                aria-label="Modifier"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                        )}
                        
                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(note.id ?? '')}
                                disabled={isDeleting}
                                className="hover:text-destructive"
                                aria-label="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      
                      {/* Send to coach on the right */}
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
            )
          })}
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
    </TooltipProvider>
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
