import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, History } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { fetchRecentScans } from '@/services/scan/scanApi'
import { useMotionPrefs } from '@/hooks/useMotionPrefs'

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const valenceTone = (valence?: number | null) => {
  if (typeof valence !== 'number') return 'bg-slate-300'
  if (valence > 0.4) return 'bg-emerald-500'
  if (valence > 0.1) return 'bg-emerald-300'
  if (valence < -0.4) return 'bg-rose-600'
  if (valence < -0.1) return 'bg-rose-400'
  return 'bg-amber-400'
}

export function LastEmotionScansCard() {
  const { user } = useAuth()
  const { prefersReducedMotion } = useMotionPrefs()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['last-emotion-scans', user?.id],
    queryFn: () => fetchRecentScans(5),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const scans = useMemo(() => data ?? [], [data])

  return (
    <Card aria-labelledby="last-scans-title" data-testid="last-emotion-scans">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle id="last-scans-title" className="flex items-center gap-2 text-lg font-semibold">
          <History className="h-5 w-5" aria-hidden /> Derniers scans
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Actualisé automatiquement après chaque analyse émotionnelle.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user?.id ? (
          <p className="text-sm text-muted-foreground">
            Connecte-toi pour retrouver tes analyses récentes.
          </p>
        ) : isLoading ? (
          <div className="space-y-3" aria-live="polite">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className={`h-3 w-3 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <Skeleton className={`h-4 flex-1 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Impossible de charger les scans. Vérifie ta connexion.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        ) : scans.length === 0 ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Aucun scan enregistré pour le moment.</p>
            <Button asChild size="sm">
              <Link to="/app/scan">Lancer mon premier scan</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3" aria-live="polite">
            {scans.slice(0, 4).map((scan) => {
              const label = scan.payload.labels[0]
              return (
                <li key={scan.id} className="flex items-center justify-between gap-4" data-testid="last-scan-item">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${valenceTone(scan.payload.valence)}`} aria-hidden />
                    <span className="text-sm font-medium capitalize">{label ?? '—'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(scan.created_at)}</span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" aria-hidden />
          {scans.length ? 'Synchronisé avec Supabase en temps réel' : 'Les scans sont privés et chiffrés côté Supabase'}
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/app/scan/history">
            Voir la timeline complète
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default LastEmotionScansCard
