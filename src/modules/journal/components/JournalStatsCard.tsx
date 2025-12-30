/**
 * JournalStatsCard - Stats display card for journal
 */

import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Flame, Heart, FileText, PenLine, Calendar } from 'lucide-react'
import type { JournalStats } from '../useJournalEnriched'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface JournalStatsCardProps {
  stats: JournalStats
  isLoading?: boolean
}

export const JournalStatsCard = memo<JournalStatsCardProps>(({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement des statistiques...</div>
        </CardContent>
      </Card>
    )
  }

  const statItems = [
    {
      icon: FileText,
      label: 'Notes totales',
      value: stats.totalNotes,
      color: 'text-blue-500',
    },
    {
      icon: PenLine,
      label: 'Mots écrits',
      value: stats.totalWords.toLocaleString(),
      color: 'text-green-500',
    },
    {
      icon: Heart,
      label: 'Favoris',
      value: stats.favoriteCount,
      color: 'text-red-500',
    },
    {
      icon: Flame,
      label: 'Streak actuel',
      value: `${stats.currentStreak} jour${stats.currentStreak > 1 ? 's' : ''}`,
      color: 'text-orange-500',
    },
    {
      icon: BarChart3,
      label: 'Mots/note',
      value: stats.avgWordsPerNote,
      color: 'text-purple-500',
    },
    {
      icon: Flame,
      label: 'Meilleur streak',
      value: `${stats.longestStreak} jour${stats.longestStreak > 1 ? 's' : ''}`,
      color: 'text-amber-500',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Vos statistiques
        </CardTitle>
        <CardDescription>
          Aperçu de votre activité d'écriture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="p-4 rounded-lg border bg-card/50 space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Last entry info */}
        {stats.lastEntryDate && (
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Dernière entrée</span>
            </div>
            <Badge variant="secondary">
              {format(parseISO(stats.lastEntryDate), 'dd MMMM yyyy', { locale: fr })}
            </Badge>
          </div>
        )}

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Badges débloqués</h4>
          <div className="flex flex-wrap gap-2">
            {stats.totalNotes >= 1 && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                ✍️ Première note
              </Badge>
            )}
            {stats.totalNotes >= 10 && (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                📚 10 notes
              </Badge>
            )}
            {stats.totalNotes >= 50 && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">
                🏆 50 notes
              </Badge>
            )}
            {stats.currentStreak >= 7 && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                🔥 7 jours de suite
              </Badge>
            )}
            {stats.currentStreak >= 30 && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                🌟 30 jours de suite
              </Badge>
            )}
            {stats.totalWords >= 10000 && (
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">
                📝 10K mots
              </Badge>
            )}
            {stats.favoriteCount >= 5 && (
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                ❤️ 5 favoris
              </Badge>
            )}
          </div>
          {stats.totalNotes === 0 && (
            <p className="text-sm text-muted-foreground">
              Commencez à écrire pour débloquer vos premiers badges !
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

JournalStatsCard.displayName = 'JournalStatsCard'
