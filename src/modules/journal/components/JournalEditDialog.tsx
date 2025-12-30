/**
 * JournalEditDialog - Dialog for editing journal notes
 */

import { memo, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, X } from 'lucide-react'
import type { SanitizedNote } from '../types'

interface JournalEditDialogProps {
  note: SanitizedNote | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: { text?: string; tags?: string[] }) => void
  isLoading?: boolean
}

export const JournalEditDialog = memo<JournalEditDialogProps>(({
  note,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (note) {
      setText(note.text)
      setTags(note.tags)
      setTagInput('')
    }
  }, [note])

  const handleAddTag = () => {
    const normalized = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (normalized && !tags.includes(normalized) && tags.length < 8) {
      setTags(prev => [...prev, normalized])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handleSave = () => {
    if (!note || !note.id) return
    onSave(note.id, { text, tags })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
          <DialogDescription>
            Modifiez le contenu et les tags de votre note
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-text">Contenu</Label>
            <Textarea
              id="edit-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="resize-y"
              placeholder="Votre texte..."
            />
            <div className="text-xs text-muted-foreground text-right">
              {text.length}/5000
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTag}
              placeholder="Ajouter un tag..."
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Retirer ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !text.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

JournalEditDialog.displayName = 'JournalEditDialog'
