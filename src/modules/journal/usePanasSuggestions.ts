import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useAssessment } from '@/hooks/useAssessment'
import { logger } from '@/lib/logger'

const PROMPT_STORAGE_KEY = 'journal.panas_prompt_last_seen'
const PROMPT_INTERVAL_MS = 72 * 60 * 60 * 1000 // 72h ≈ 2-3 rappels par semaine

const POSITIVE_KEYWORDS = [
  'positif',
  'positive',
  'enthousiasme',
  'énergie',
  'élan',
  'ressource',
  'soutien',
  'lumière',
  'ouverture',
]

const NEGATIVE_KEYWORDS = [
  'tension',
  'fatigue',
  'charge',
  'agitation',
  'difficile',
  'négatif',
  'fragile',
  'saturé',
  'apaisement nécessaire',
  'apaisement',
]

type RawAssessment = {
  score_json: Record<string, unknown> | null
  submitted_at: string | null
  ts: string | null
}

type StoredPrompt = number | null

export type AffectOrientation = 'pa' | 'na' | 'balanced'

export type PanasSuggestion = {
  id: string
  title: string
  description: string
  prompt: string
}

type SuggestionSet = Record<AffectOrientation, PanasSuggestion[]>

const SUGGESTIONS: SuggestionSet = {
  na: [
    {
      id: 'soothing-anchor',
      title: 'Ancrage apaisant',
      description:
        "Décris un lieu, un geste ou ta respiration d’endormissement qui t'aide à retrouver un <em>sentiment de sécurité</em> immédiat.",
      prompt: "Quel rituel apaisant ou respiration d’endormissement te permet de souffler et de te sentir en sécurité ?",
    },
    {
      id: 'micro-kindness',
      title: 'Micro-attention douce',
      description:
        "Liste trois attentions délicates que tu pourrais t'offrir aujourd'hui (Nyvée doux, chaleur, pause) pour <em>adoucir la journée</em>.",
      prompt: "Quelles petites attentions ou ressources Nyvée douces peux-tu t'accorder pour rendre cette journée plus douce ?",
    },
    {
      id: 'compassion-letter',
      title: 'Lettre de compassion',
      description:
        "Écris-toi quelques lignes comme si un ami te rappelait que tu as déjà traversé des moments <strong>compliqués avec courage</strong>.",
      prompt: "Si ton meilleur ami écrivait pour t'encourager, que te dirait-il aujourd'hui ?",
    },
  ],
  pa: [
    {
      id: 'amplify-joy',
      title: 'Amplifier l’élan',
      description:
        "Note ce qui t'a donné de l'<strong>élan positif</strong> récemment et comment tu pourrais en prolonger l'effet.",
      prompt: "Quel moment récent t'a donné de l'énergie et comment peux-tu en savourer encore les bénéfices ?",
    },
    {
      id: 'share-light',
      title: 'Partager la lumière',
      description:
        "Imagine une façon simple de <em>transmettre cette énergie</em> à quelqu'un aujourd'hui (un mot, un geste, une idée) en partageant un petit highlight privé.",
      prompt: "Quel petit highlight as-tu envie de partager en douceur aujourd'hui, même juste pour toi ?",
    },
    {
      id: 'future-self',
      title: 'Message au futur toi',
      description:
        "Écris un message à ton toi futur pour lui rappeler ce qui te rend <strong>si vivant(e)</strong> en ce moment.",
      prompt: "Quel message as-tu envie d'envoyer à ton toi futur pour qu'il se rappelle ce qui te porte aujourd'hui ?",
    },
  ],
  balanced: [
    {
      id: 'body-scan',
      title: 'Scan météo intérieure',
      description:
        "Observe comment ton corps réagit aujourd'hui : où se trouve l'<em>espace le plus détendu</em>, où la tension est-elle présente ?",
      prompt: "Si ton corps avait une météo, comment décrirais-tu les zones calmes et celles en besoin de douceur ?",
    },
    {
      id: 'micro-gratitude',
      title: 'Gratitude en nuance',
      description:
        "Repère une petite chose qui t'a fait du bien et une autre qui a demandé de l'énergie, sans jugement, juste pour <strong>reconnaître</strong>.",
      prompt: "Quelle petite chose te fait du bien aujourd'hui et qu'est-ce qui pourrait recevoir un peu plus de soin ?",
    },
    {
      id: 'gentle-next-step',
      title: 'Pas doux suivant',
      description:
        "Écris une intention simple pour avancer d'un pas, même minuscule, vers plus d'<em>équilibre</em> cette semaine.",
      prompt: "Quel pas tout doux pourrais-tu poser cette semaine pour prendre soin de ton équilibre ?",
    },
  ],
}

const getStoredPromptTimestamp = (): StoredPrompt => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(PROMPT_STORAGE_KEY)
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
}

const persistPromptTimestamp = (value: number) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROMPT_STORAGE_KEY, String(value))
}

const collectTextClues = (scoreJson: Record<string, unknown> | null | undefined): string => {
  if (!scoreJson) return ''
  const fragments: string[] = []

  const summary = scoreJson.summary
  const focus = scoreJson.focus

  if (typeof summary === 'string') fragments.push(summary)
  if (typeof focus === 'string') fragments.push(focus)

  const subs = scoreJson.subs
  if (subs && typeof subs === 'object') {
    Object.values(subs).forEach(value => {
      if (!value) return
      if (typeof value === 'string') {
        fragments.push(value)
      } else if (typeof value === 'object') {
        const maybeLabel = (value as Record<string, unknown>).label
        const maybeTrend = (value as Record<string, unknown>).trend
        const maybeHint = (value as Record<string, unknown>).hint

        if (typeof maybeLabel === 'string') fragments.push(maybeLabel)
        if (typeof maybeTrend === 'string') fragments.push(maybeTrend)
        if (typeof maybeHint === 'string') fragments.push(maybeHint)
      }
    })
  }

  return fragments.join(' ').toLowerCase()
}

const countMatches = (haystack: string, needles: string[]) =>
  needles.reduce((total, needle) => (haystack.includes(needle) ? total + 1 : total), 0)

const resolveOrientation = (scoreJson: Record<string, unknown> | null | undefined): AffectOrientation => {
  const clues = collectTextClues(scoreJson)
  if (!clues) {
    return 'balanced'
  }

  const positive = countMatches(clues, POSITIVE_KEYWORDS)
  const negative = countMatches(clues, NEGATIVE_KEYWORDS)

  if (negative > positive) return 'na'
  if (positive > negative) return 'pa'
  return 'balanced'
}

const describeRecency = (isoDate?: string | null): string => {
  if (!isoDate) return "Pas encore d'auto-évaluation PANAS."
  const parsed = Number.isNaN(Date.parse(isoDate)) ? null : new Date(isoDate)
  if (!parsed) return "Mise à jour PANAS disponible."

  const now = Date.now()
  const diff = now - parsed.getTime()
  const dayMs = 24 * 60 * 60 * 1000

  if (diff < 2 * dayMs) {
    return 'Dernière photo émotionnelle toute récente.'
  }
  if (diff < 7 * dayMs) {
    return 'Évaluation PANAS réalisée cette semaine.'
  }
  if (diff < 30 * dayMs) {
    return 'Dernier point PANAS pris ce mois-ci.'
  }
  return 'La prochaine auto-évaluation rapprochera le suivi.'
}

export type UsePanasSuggestionsOptions = {
  enabled?: boolean
}

export type UsePanasSuggestionsResult = {
  orientation: AffectOrientation
  suggestions: PanasSuggestion[]
  recencyLabel: string
  promptVisible: boolean
  isRequestingConsent: boolean
  requestConsent: () => Promise<void>
  skipPrompt: () => void
  isLoading: boolean
  hasConsent: boolean
}

export function usePanasSuggestions(options: UsePanasSuggestionsOptions = {}): UsePanasSuggestionsResult {
  const { user } = useAuth()
  const { toast } = useToast()
  const assessment = useAssessment('PANAS')
  const featureEnabled = options.enabled ?? true

  const [lastPromptTs, setLastPromptTs] = useState<StoredPrompt>(() => getStoredPromptTimestamp())
  const [promptVisible, setPromptVisible] = useState(false)
  const [isRequestingConsent, setIsRequestingConsent] = useState(false)

  const consentQuery = useQuery({
    queryKey: ['panas', 'consent', user?.id],
    enabled: featureEnabled && Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_consents')
        .select('is_active, granted_at, revoked_at')
        .eq('instrument_code', 'PANAS')
        .order('granted_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },
    staleTime: 60 * 1000,
  })

  const assessmentQuery = useQuery<RawAssessment | null>({
    queryKey: ['panas', 'latest', user?.id],
    enabled: featureEnabled && Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('score_json, submitted_at, ts')
        .eq('instrument', 'PANAS')
        .order('submitted_at', { ascending: false, nullsFirst: false })
        .order('ts', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data as RawAssessment | null
    },
    staleTime: 5 * 60 * 1000,
  })

  const hasConsent = useMemo(
    () =>
      (featureEnabled && assessment.state.hasConsent) ||
      Boolean(consentQuery.data?.is_active),
    [featureEnabled, assessment.state.hasConsent, consentQuery.data?.is_active],
  )

  const canPrompt = useMemo(() => {
    if (!featureEnabled) return false
    if (!user?.id) return false
    if (consentQuery.isLoading) return false
    if (hasConsent) return false
    if (!lastPromptTs) return true
    return Date.now() - lastPromptTs >= PROMPT_INTERVAL_MS
  }, [featureEnabled, user?.id, consentQuery.isLoading, hasConsent, lastPromptTs])

  useEffect(() => {
    if (!featureEnabled) {
      setPromptVisible(false)
      return
    }
    if (canPrompt && !promptVisible) {
      const now = Date.now()
      setPromptVisible(true)
      setLastPromptTs(now)
      persistPromptTimestamp(now)
    }
    if (!canPrompt && promptVisible) {
      setPromptVisible(false)
    }
  }, [featureEnabled, canPrompt, promptVisible])

  const orientation = useMemo<AffectOrientation>(() => {
    if (!featureEnabled) {
      return 'balanced'
    }
    if (!assessmentQuery.data?.score_json) {
      return 'balanced'
    }
    return resolveOrientation(
      assessmentQuery.data.score_json as Record<string, unknown>,
    )
  }, [featureEnabled, assessmentQuery.data?.score_json])

  const recencyLabel = useMemo(
    () =>
      featureEnabled
        ? describeRecency(assessmentQuery.data?.submitted_at ?? assessmentQuery.data?.ts ?? null)
        : 'Le suivi PANAS est désactivé.',
    [featureEnabled, assessmentQuery.data?.submitted_at, assessmentQuery.data?.ts],
  )

  const requestConsent = useCallback(async () => {
    if (!featureEnabled) return
    try {
      setIsRequestingConsent(true)
      await assessment.grantConsent()
      await assessment.triggerAssessment('PANAS')
      setPromptVisible(false)
      const now = Date.now()
      setLastPromptTs(now)
      persistPromptTimestamp(now)
      toast({
        title: 'Auto-évaluation activée',
        description: 'Nous t’inviterons régulièrement chaque semaine pour un court PANAS.',
      })
    } catch (error) {
      console.error('PANAS consent error', error)
      toast({
        title: 'Activation indisponible',
        description: "La demande n'a pas pu aboutir. Réessaie dans un instant.",
        variant: 'destructive',
      })
    } finally {
      setIsRequestingConsent(false)
    }
  }, [assessment, toast])

  const skipPrompt = useCallback(() => {
    if (!featureEnabled) return
    setPromptVisible(false)
    const now = Date.now()
    setLastPromptTs(now)
    persistPromptTimestamp(now)
  }, [featureEnabled])

  const suggestions = useMemo(
    () => (featureEnabled ? SUGGESTIONS[orientation] : SUGGESTIONS.balanced),
    [featureEnabled, orientation],
  )

  return {
    orientation,
    suggestions,
    recencyLabel,
    promptVisible: featureEnabled && promptVisible,
    isRequestingConsent,
    requestConsent,
    skipPrompt,
    isLoading: featureEnabled && (consentQuery.isLoading || assessmentQuery.isLoading),
    hasConsent,
  }
}
