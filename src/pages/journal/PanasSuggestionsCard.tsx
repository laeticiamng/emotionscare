import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import { AlertCircle, Brain, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { usePanasSuggestions } from '@/modules/journal/usePanasSuggestions'
import type { useJournalComposer } from '@/modules/journal/useJournalComposer'
import type { PanasSuggestion } from '@/modules/journal/usePanasSuggestions'
import { cn } from '@/lib/utils'
import { useFlags } from '@/core/flags'

type JournalComposerRef = ReturnType<typeof useJournalComposer>

type PanasSuggestionsCardProps = {
  composer: JournalComposerRef
}

const orientationBadges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pa: { label: 'PA en soutien', variant: 'default' },
  na: { label: 'NA à apaiser', variant: 'secondary' },
  balanced: { label: 'État stable', variant: 'outline' },
}

const sanitizeDescription = (value: string) =>
  DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['strong', 'em'],
    ALLOWED_ATTR: {},
  })

const suggestionToPlainText = (suggestion: PanasSuggestion) => suggestion.prompt

export function PanasSuggestionsCard({ composer }: PanasSuggestionsCardProps) {
  const { toast } = useToast()
  const { has } = useFlags()
  const assessEnabled = has('FF_ASSESS_PANAS')
  const {
    orientation,
    suggestions,
    recencyLabel,
    promptVisible,
    requestConsent,
    skipPrompt,
    isRequestingConsent,
    isLoading,
    hasConsent,
  } = usePanasSuggestions({ enabled: assessEnabled })

  if (!assessEnabled) {
    return null
  }

  const sanitizedSuggestions = useMemo(
    () =>
      suggestions.map(item => ({
        ...item,
        sanitized: sanitizeDescription(item.description),
      })),
    [suggestions],
  )

  const handleUseSuggestion = (suggestion: PanasSuggestion) => {
    const plain = suggestionToPlainText(suggestion)
    composer.setText(prev => {
      if (!prev.trim()) return plain
      return `${prev.trim()}\n\n${plain}`
    })
    toast({
      title: 'Inspiration ajoutée',
      description: 'Le thème choisi a été ajouté à ta note.',
    })
  }

  const orientationMeta = orientationBadges[orientation] ?? orientationBadges.balanced

  return (
    <Card aria-live="polite" className="border-primary/20 bg-muted/30">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <CardTitle className="text-base sm:text-lg">Suggestions guidées par ton PANAS</CardTitle>
            <p className="text-sm text-muted-foreground">{recencyLabel}</p>
          </div>
        </div>
        <Badge variant={orientationMeta.variant}>{orientationMeta.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {promptVisible && !hasConsent && (
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-primary">Activer le suivi affectif&nbsp;?</p>
                <p>
                  Nous pouvons te proposer quelques invitations PANAS chaque semaine pour affiner les thèmes du journal. Tu peux
                  arrêter à tout moment.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void requestConsent()} disabled={isRequestingConsent}>
                    {isRequestingConsent ? 'Activation…' : 'Oui, activer'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={skipPrompt}>
                    Plus tard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={cn('space-y-4', isLoading && 'opacity-60')}>
          {sanitizedSuggestions.map(suggestion => (
            <article
              key={suggestion.id}
              className="rounded-lg border border-border/60 bg-background/60 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold leading-snug sm:text-base">{suggestion.title}</h3>
                  <p
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: suggestion.sanitized }}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => handleUseSuggestion(suggestion)}
                >
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Explorer ce thème
                </Button>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
