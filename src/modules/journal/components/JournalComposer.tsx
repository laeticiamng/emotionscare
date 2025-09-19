import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Loader2, Mic, MicOff, Plus, Send, Upload } from 'lucide-react'
import { useJournalComposer } from '../useJournalComposer'

type JournalComposerProps = {
  composer: ReturnType<typeof useJournalComposer>
  onSubmitted?: (id: string) => void
}

export function JournalComposer({ composer, onSubmitted }: JournalComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!composer.lastInsertedId) return
    textareaRef.current?.focus()
    onSubmitted?.(composer.lastInsertedId)
    toast({
      title: 'Note enregistrée',
      description: 'Votre réflexion a été ajoutée au journal.',
      duration: 3000,
    })
  }, [composer.lastInsertedId, onSubmitted, toast])

  useEffect(() => {
    if (!composer.error) return
    toast({
      title: 'Action impossible',
      description: translateError(composer.error),
      variant: 'destructive',
    })
  }, [composer.error, toast])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id = await composer.submitText()
    if (id) {
      onSubmitted?.(id)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await composer.uploadVoice(file)
    event.target.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Composer une note">
      <div className="space-y-2">
        <Label htmlFor="journal-text">Votre note</Label>
        <Textarea
          id="journal-text"
          ref={textareaRef}
          value={composer.text}
          onChange={event => composer.setText(event.target.value)}
          minLength={1}
          maxLength={5000}
          rows={6}
          className="resize-y"
          placeholder="Exprimez vos ressentis, vos observations…"
          aria-describedby="journal-text-help"
          data-testid="journal-textarea"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span id="journal-text-help">Vos mots sont nettoyés pour éliminer tout contenu dangereux.</span>
          <span aria-live="polite">{composer.text.length}/5000</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="journal-tags">Tags</Label>
        <Input
          id="journal-tags"
          value={composer.tagInput}
          onChange={event => composer.setTagInput(event.target.value)}
          onBlur={() => composer.commitTagInput()}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
              event.preventDefault()
              composer.commitTagInput()
            }
          }}
          placeholder="Ajoutez des tags (gratitude, focus…)"
          aria-describedby="journal-tags-help"
          data-testid="journal-tag-input"
        />
        <p id="journal-tags-help" className="text-xs text-muted-foreground">
          Appuyez sur Entrée pour valider un tag. Maximum 8 tags.
        </p>
        {composer.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags sélectionnés">
            {composer.tags.map(tag => (
              <li key={tag}>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <span>#{tag}</span>
                  <button
                    type="button"
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                    aria-label={`Retirer le tag ${tag}`}
                    onClick={() => composer.removeTag(tag)}
                  >
                    ×
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={composer.isSubmittingText}
          className="min-w-[140px]"
          data-testid="journal-submit"
        >
          {composer.isSubmittingText ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Enregistrement…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" aria-hidden="true" />
              Enregistrer
            </span>
          )}
        </Button>

        {composer.dictationSupported ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              composer.isDictating ? composer.stopDictation() : composer.startDictation()
            }
            className={cn(
              'flex items-center gap-2 transition-colors',
              composer.isDictating && 'border-destructive text-destructive',
            )}
          >
            {composer.isDictating ? (
              <>
                <MicOff className="h-4 w-4" aria-hidden="true" />
                Arrêter la dictée
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" aria-hidden="true" />
                Lancer la dictée
              </>
            )}
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={triggerFileSelect}>
            <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
            Importer un audio
          </Button>
        )}

        <Button type="button" variant="ghost" onClick={() => composer.reset()}>
          <Plus className="mr-2 h-4 w-4 rotate-45" aria-hidden="true" />
          Réinitialiser
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <div className="text-xs text-muted-foreground" aria-live="polite">
        {composer.isDictating && 'Dictée en cours… Parlez distinctement.'}
        {composer.dictationError === 'not_supported' && "La dictée n'est pas supportée sur cet appareil."}
        {composer.dictationError === 'permission_denied' && 'Autorisez le micro pour utiliser la dictée.'}
        {composer.dictationError === 'no_microphone' && 'Micro injoignable ou silencieux.'}
        {composer.dictationError === 'transcription_error' && 'Transcription vocale indisponible pour le moment.'}
        {composer.isSubmittingVoice && 'Transcription vocale en cours…'}
      </div>
    </form>
  )
}

function translateError(code: string): string {
  switch (code) {
    case 'auth_required':
      return 'Connectez-vous pour enregistrer votre journal.'
    case 'journal_insert_failed':
      return "Impossible d'enregistrer la note. Réessayez plus tard."
    case 'voice_transcription_unavailable':
      return 'La transcription vocale est momentanément indisponible.'
    case 'empty_text':
      return 'Ajoutez du contenu avant de publier.'
    default:
      return 'Une erreur inattendue est survenue.'
  }
}
