import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CalendarClock, Filter, RefreshCcw } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { fetchScanHistory } from '@/services/scan/scanApi'
import { useMotionPrefs } from '@/hooks/useMotionPrefs'

const periodFilters = [
  { id: '7d', label: '7 jours', days: 7 },
  { id: '30d', label: '30 jours', days: 30 },
  { id: '90d', label: '90 jours', days: 90 },
  { id: 'all', label: 'Tout afficher', days: null as number | null },
]

const valenceTone = (valence?: number | null) => {
  if (typeof valence !== 'number') return 'bg-slate-300'
  if (valence > 0.4) return 'bg-emerald-500'
  if (valence > 0.1) return 'bg-emerald-300'
  if (valence < -0.4) return 'bg-rose-600'
  if (valence < -0.1) return 'bg-rose-400'
  return 'bg-amber-400'
}

const describeDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const filterByPeriod = (items: Awaited<ReturnType<typeof fetchScanHistory>>, days: number | null) => {
  if (!days) return items
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000
  return items.filter((item) => new Date(item.created_at).getTime() >= threshold)
}

export default function ScanHistory() {
  const { user } = useAuth()
  const { prefersReducedMotion } = useMotionPrefs()
  const [period, setPeriod] = useState(periodFilters[0])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['scan-history', user?.id],
    queryFn: () => fetchScanHistory(20),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const scans = useMemo(() => {
    const list = data ?? []
    return filterByPeriod(list, period.days).slice(0, 10)
  }, [data, period.days])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <Badge variant="outline" className="w-max" aria-label="Historique Emotion Scan">
          <CalendarClock className="mr-2 h-4 w-4" aria-hidden /> Timeline émotionnelle
        </Badge>
        <h1 className="text-3xl font-semibold">Historique de tes scans</h1>
        <p className="text-muted-foreground">
          Visualise l’évolution de ton état émotionnel. Chaque entrée est enregistrée de manière sécurisée grâce à Supabase.
        </p>
      </header>

      <section aria-label="Filtres de la timeline" className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
        {periodFilters.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={item.id === period.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod(item)}
          >
            {item.label}
          </Button>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden /> Rafraîchir
        </Button>
      </section>

      <Card aria-live="polite" aria-busy={isLoading}>
        <CardHeader>
          <CardTitle className="text-lg font-medium">10 derniers scans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user?.id ? (
            <p className="text-sm text-muted-foreground">
              Tu dois être connecté·e pour consulter ton historique.
            </p>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Skeleton className={`mt-1 h-2.5 w-2.5 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  <div className="flex-1 space-y-2">
                    <Skeleton className={`h-4 w-1/4 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                    <Skeleton className={`h-3 w-2/3 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-muted-foreground">
              Impossible de récupérer l’historique pour le moment. Merci de réessayer.
            </p>
          ) : scans.length === 0 ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Aucun scan sur cette période.</p>
              <Button asChild size="sm">
                <Link to="/app/scan">Effectuer un scan</Link>
              </Button>
            </div>
          ) : (
            <ol className="relative space-y-4" role="list">
              <span className="absolute left-3 top-2 bottom-2 w-px bg-border" aria-hidden />
              {scans.map((scan) => {
                const label = scan.payload.labels[0]
                return (
                  <li key={scan.id} className="relative ml-6 rounded-lg border bg-card/70 p-4" data-testid="scan-history-item">
                    <span className={`absolute left-[-18px] top-5 h-3 w-3 rounded-full ${valenceTone(scan.payload.valence)}`} aria-hidden />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold capitalize">{label ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{describeDate(scan.created_at)}</p>
                      </div>
                      {typeof scan.payload.mood_score === 'number' ? (
                        <Badge variant="secondary" className="text-xs">
                          Score bien-être : {Math.round(scan.payload.mood_score)}
                        </Badge>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
