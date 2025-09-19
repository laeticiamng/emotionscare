import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { listFeed } from '@/services/journal/journalApi'
import { Link } from 'react-router-dom'
import { SafeNote } from '@/modules/journal/components/JournalList'

export function LastJournalEntriesCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['journal', 'dashboard', { limit: 3 }],
    queryFn: () => listFeed({ limit: 3 }),
    staleTime: 60_000,
  })

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
        {!isLoading && !data?.length && (
          <p className="text-sm text-muted-foreground">Aucune entrée récente.</p>
        )}
        <ul className="space-y-3">
          {(data ?? []).map(note => (
            <li key={note.id} className="rounded-md border p-3">
              <SafeNote text={note.text} />
              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(note.created_at).toLocaleString('fr-FR')}
              </div>
            </li>
          ))}
        </ul>
        <div className="text-right">
          <Link className="text-sm font-medium text-primary underline" to="/app/journal">
            Voir tout le journal
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
