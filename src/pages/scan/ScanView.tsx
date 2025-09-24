import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mic, Sparkles, Brain, ArrowRight, Wind, Music4 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useEmotionScan } from '@/modules/emotion-scan/hooks/useEmotionScan'
import { type ScanResult } from '@/modules/emotion-scan/types'
import { useMotionPrefs } from '@/hooks/useMotionPrefs'

const CTA_LINKS = [
  { to: '/app/flash-glow', label: 'FlashGlow', icon: Sparkles },
  { to: '/app/breath', label: 'Respiration guidée', icon: Wind },
  { to: '/app/music', label: 'Musique apaisante', icon: Music4 },
]

const describeValence = (valence?: number) => {
  if (typeof valence !== 'number') return 'Équilibre émotionnel'
  if (valence > 0.4) return 'Climat positif'
  if (valence > 0.1) return 'Légèrement positif'
  if (valence < -0.4) return 'Tension élevée'
  if (valence < -0.1) return 'Fragilité émotionnelle'
  return 'Équilibre neutre'
}

const valenceColor = (valence?: number) => {
  if (typeof valence !== 'number') return 'bg-slate-400'
  if (valence > 0.4) return 'bg-emerald-500'
  if (valence > 0.1) return 'bg-emerald-300'
  if (valence < -0.4) return 'bg-rose-600'
  if (valence < -0.1) return 'bg-rose-400'
  return 'bg-amber-400'
}

const computeMicroGestures = (result: ScanResult) => {
  const gestures: string[] = []
  const { valence, arousal } = result

  if (typeof valence === 'number' && typeof arousal === 'number') {
    if (valence < -0.2 && arousal > 0.2) {
      gestures.push('Expire longuement 6 secondes, répète 4 fois')
      gestures.push('Étire doucement la nuque pour relâcher la tension')
    } else if (valence < 0) {
      gestures.push('Pose une main sur le cœur et respire calmement')
    } else if (arousal > 0.4) {
      gestures.push('Fais une marche lente de 2 minutes en conscience')
    }
  }

  if (gestures.length === 0) {
    gestures.push('Note trois sensations présentes avant de poursuivre ta journée')
  }

  return gestures.slice(0, 3)
}

export default function ScanView() {
  const { prefersReducedMotion } = useMotionPrefs()
  const { runScan, status, error, result, reset, isLoading } = useEmotionScan()
  const [text, setText] = useState('')
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [lang] = useState<'fr' | 'en'>('fr')
  const statusRef = useRef<HTMLDivElement | null>(null)
  const resultRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.focus()
    }
  }, [status])

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.focus()
    }
  }, [result])

  useEffect(() => () => reset(), [reset])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()

    try {
      await runScan({ text, lang, transcript: voiceTranscript || undefined })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
    }
  }, [lang, runScan, text, voiceTranscript])

  const dominantLabel = result?.labels?.[0]
  const gestures = useMemo(() => (result ? computeMicroGestures(result) : []), [result])

  const canSubmit = text.trim().length > 4 && !isLoading

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <Badge variant="secondary" className="w-max" aria-label="Module Emotion Scan">
          <Brain className="mr-2 h-4 w-4" aria-hidden /> Emotion Scan
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Analyse instantanée de ton humeur</h1>
        <p className="text-muted-foreground">
          Décris ta situation ou colle une transcription vocale. Nous te proposons un feedback doux et des micro-gestes immédiats.
        </p>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="scan-status">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Exprime-toi librement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label htmlFor="scan-text" className="flex flex-col gap-2 text-sm font-medium">
              Comment te sens-tu en ce moment ?
              <Textarea
                id="scan-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                minLength={5}
                rows={6}
                className="resize-none"
                placeholder="Exemple : Je me sens tendu avant ma réunion importante..."
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && canSubmit) {
                    handleSubmit(event as unknown as FormEvent)
                  }
                }}
                aria-required
              />
            </label>

            {showVoiceInput ? (
              <div className="space-y-2">
                <label htmlFor="voice-transcript" className="text-sm font-medium">
                  Transcription vocale (optionnel)
                </label>
                <Textarea
                  id="voice-transcript"
                  rows={3}
                  value={voiceTranscript}
                  onChange={(event) => setVoiceTranscript(event.target.value)}
                  placeholder="Colle ici le texte détecté via le micro"
                />
                <p className="text-xs text-muted-foreground">
                  Nous n'enregistrons jamais ton audio. Tu peux désactiver ce champ via le bouton micro.
                </p>
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              id="scan-status"
              ref={statusRef}
              tabIndex={-1}
              className="text-sm text-muted-foreground"
              aria-live="polite"
              role="status"
            >
              {status === 'loading'
                ? 'Analyse en cours…'
                : status === 'success'
                  ? 'Analyse terminée avec succès.'
                  : status === 'error'
                    ? 'Une erreur est survenue. Merci de réessayer.'
                    : 'Saisis au moins une phrase pour lancer l’analyse.'}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                type="button"
                variant={showVoiceInput ? 'secondary' : 'outline'}
                className="w-full sm:w-auto"
                onClick={() => setShowVoiceInput((value) => !value)}
              >
                <Mic className="mr-2 h-4 w-4" aria-hidden /> {showVoiceInput ? 'Masquer le micro' : 'Ajouter un micro'}
              </Button>
              <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" aria-hidden />
                )}
                Lancer l’analyse
              </Button>
            </div>
          </CardFooter>
          {error && status === 'error' ? (
            <p className="px-6 pb-4 text-sm text-destructive">
              {error === 'scan_invalid'
                ? 'La réponse reçue est invalide. Nos équipes ont été notifiées.'
                : 'Impossible de finaliser le scan pour le moment. Merci de réessayer.'}
            </p>
          ) : null}
        </form>
      </Card>

      {status === 'loading' ? (
        <Card aria-live="polite" aria-busy="true">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Analyse de ton humeur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className={`h-5 w-1/3 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
            <Skeleton className={`h-4 w-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
            <Skeleton className={`h-4 w-2/3 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
          </CardContent>
        </Card>
      ) : null}

      {result ? (
        <Card className="border-primary/30">
          <CardHeader className="space-y-2">
            <CardTitle
              ref={resultRef}
              tabIndex={-1}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Sparkles className="h-5 w-5 text-primary" aria-hidden /> Ton état dominant : {dominantLabel ?? '—'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${valenceColor(result.valence)}`} aria-hidden />
              <span className="text-sm text-muted-foreground">{describeValence(result.valence)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Micro-gestes recommandés</h2>
              <ul className="space-y-2">
                {gestures.map((gesture) => (
                  <li key={gesture} className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
                    {gesture}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Prochaine étape</h2>
              <div className="flex flex-wrap gap-2">
                {CTA_LINKS.map(({ to, label, icon: Icon }) => (
                  <Button key={to} asChild variant="outline" className="gap-2">
                    <Link to={to}>
                      <Icon className="h-4 w-4" aria-hidden /> {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Tu peux consulter l’historique détaillé dans la{' '}
              <Link to="/app/scan/history" className="underline">
                timeline des scans
              </Link>.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setText('')
                setVoiceTranscript('')
                setShowVoiceInput(false)
              }}
            >
              Refaire une analyse
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}
