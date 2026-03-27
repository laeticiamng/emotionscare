// @ts-nocheck
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { listFeed } from '@/services/journal/journalApi'
import { Link } from 'react-router-dom'
import type { SanitizedNote } from '@/modules/journal/types'

const DAY_MS = 24 * 60 * 60 * 1000

export type JournalDashboardSummary = {
  headline: string
  detail: string
}

export function buildJournalSummaryMessage(notes: SanitizedNote[]): JournalDashboardSummary {
  if (!notes.length) {
    return {
      headline: 'Ton journal est prêt pour accueillir tes ressentis.',
      detail: 'Ajoute une première note quand tu te sens prêt·e, cet espace t’attend.',
    }
  }

  const tags = Array.from(new Set(notes.flatMap(note => note.tags))).slice(0, 3)
  const tagLabel = tags.length ? tags.map(tag => `#${tag}`).join(', ') : null
  const headline = tagLabel
    ? `Tes notes récentes évoquent ${tagLabel}.`
    : 'Tes notes récentes témoignent de ton écoute intérieure.'

  const latest = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0]
  const latestDate = latest?.created_at ? new Date(latest.created_at) : null

  let detail = 'Ton espace reste disponible à tout moment.'
  if (latestDate && !Number.isNaN(latestDate.getTime())) {
    const diff = Date.now() - latestDate.getTime()
    if (diff <= DAY_MS) {
      detail = 'Dernière note ajoutée aujourd’hui, belle continuité.'
    } else if (diff <= 3 * DAY_MS) {
      detail = 'Dernière note ajoutée il y a quelques jours, tu gardes le lien.'
    } else if (diff <= 7 * DAY_MS) {
      detail = 'Une note cette semaine maintient ton journal vivant.'
    } else {
      detail = 'Reviens écrire dès que tu en ressens le besoin, ton espace reste ouvert.'
    }
  }

  return { headline, detail }
}

export function LastJournalEntriesCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['journal', 'dashboard', { limit: 3 }],
    queryFn: () => listFeed({ limit: 3 }),
    staleTime: 60_000,
  })

  const summary = useMemo(() => buildJournalSummaryMessage(data ?? []), [data])

  return (
    <Card aria-labelledby="last-journal-title">
      <CardHeader>
        <CardTitle id="last-journal-title">Dernières entrées du journal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {isError && !isLoading && (
          <p className="text-sm text-destructive">Journal indisponible pour le moment.</p>
        )}
        {!isError && !isLoading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{summary.headline}</p>
            <p className="text-sm text-muted-foreground">{summary.detail}</p>
          </div>
        )}
        <div className="text-right">
          <Link className="text-sm font-medium text-primary underline" to="/app/journal">
            Voir tout le journal
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
