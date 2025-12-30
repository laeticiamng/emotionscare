/**
 * JournalNoteActions - Action buttons for journal notes
 */

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Heart, Trash2, Edit2, MessageSquare, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JournalNoteActionsProps {
  noteId: string
  isFavorite: boolean
  sendingId: string | null
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onEdit: (id: string) => void
  onSendToCoach: (id: string) => void
  isDeleting?: boolean
  isTogglingFavorite?: boolean
}

export const JournalNoteActions = memo<JournalNoteActionsProps>(({
  noteId,
  isFavorite,
  sendingId,
  onDelete,
  onToggleFavorite,
  onEdit,
  onSendToCoach,
  isDeleting,
  isTogglingFavorite,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(noteId)}
            disabled={isTogglingFavorite}
            className={cn(isFavorite && 'text-red-500')}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(noteId)}
            aria-label="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Modifier</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSendToCoach(noteId)}
            disabled={sendingId === noteId}
            aria-label="Envoyer au coach"
          >
            {sendingId === noteId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Envoyer au coach</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(noteId)}
            disabled={isDeleting}
            className="hover:text-destructive"
            aria-label="Supprimer"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Supprimer</TooltipContent>
      </Tooltip>
    </div>
  )
})

JournalNoteActions.displayName = 'JournalNoteActions'
