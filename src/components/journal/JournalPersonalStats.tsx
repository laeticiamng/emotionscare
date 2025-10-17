import { useMemo } from 'react';
import { BarChart3, Clock, Tag, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalPersonalStatsProps {
  notes: SanitizedNote[];
}

interface Stats {
  totalNotes: number;
  totalWords: number;
  averageLength: number;
  mostProductiveDay: string;
  mostProductiveHour: string;
  favoriteTag: string;
  notesPerDay: number;
  longestNote: number;
  shortestNote: number;
  uniqueTags: number;
}

/**
 * Statistiques personnelles détaillées du journal
 * Analyse les habitudes d'écriture et patterns de l'utilisateur
 */
export function JournalPersonalStats({ notes }: JournalPersonalStatsProps) {
  const stats = useMemo((): Stats => {
    if (notes.length === 0) {
      return {
        totalNotes: 0,
        totalWords: 0,
        averageLength: 0,
        mostProductiveDay: '-',
        mostProductiveHour: '-',
        favoriteTag: '-',
        notesPerDay: 0,
        longestNote: 0,
        shortestNote: 0,
        uniqueTags: 0,
      };
    }

    // Mots totaux
    const totalWords = notes.reduce((sum, note) => {
      return sum + note.text.split(/\s+/).filter(Boolean).length;
    }, 0);

    // Longueur moyenne
    const averageLength = Math.round(totalWords / notes.length);

    // Jour le plus productif (jour de la semaine)
    const dayCount = new Map<string, number>();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const day = days[date.getDay()];
      dayCount.set(day, (dayCount.get(day) || 0) + 1);
    });
    const mostProductiveDay = Array.from(dayCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    // Heure la plus productive
    const hourCount = new Map<number, number>();
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const hour = date.getHours();
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });
    const mostProductiveHourNum = Array.from(hourCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostProductiveHour = mostProductiveHourNum !== undefined
      ? `${mostProductiveHourNum}h-${mostProductiveHourNum + 1}h`
      : '-';

    // Tag favori
    const tagCount = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    const favoriteTag = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    // Notes par jour (moyenne)
    const firstNote = new Date(notes[notes.length - 1].created_at);
    const lastNote = new Date(notes[0].created_at);
    const daysDiff = Math.ceil((lastNote.getTime() - firstNote.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const notesPerDay = parseFloat((notes.length / daysDiff).toFixed(2));

    // Plus longue et plus courte note
    const lengths = notes.map(note => note.text.split(/\s+/).filter(Boolean).length);
    const longestNote = Math.max(...lengths);
    const shortestNote = Math.min(...lengths);

    // Tags uniques
    const uniqueTags = new Set(notes.flatMap(note => note.tags)).size;

    return {
      totalNotes: notes.length,
      totalWords,
      averageLength,
      mostProductiveDay,
      mostProductiveHour,
      favoriteTag,
      notesPerDay,
      longestNote,
      shortestNote,
      uniqueTags,
    };
  }, [notes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Statistiques personnelles
        </CardTitle>
        <CardDescription>
          Vos habitudes d'écriture en chiffres
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalNotes}</span>
            </div>
            <p className="text-sm text-muted-foreground">Notes écrites</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Mots au total</p>
          </div>
        </div>

        {/* Statistiques d'écriture */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Habitudes d'écriture</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Longueur moyenne</span>
              </div>
              <Badge variant="secondary">{stats.averageLength} mots</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Note la plus longue</span>
              </div>
              <Badge variant="secondary">{stats.longestNote} mots</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Note la plus courte</span>
              </div>
              <Badge variant="secondary">{stats.shortestNote} mots</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fréquence</span>
              </div>
              <Badge variant="secondary">{stats.notesPerDay} notes/jour</Badge>
            </div>
          </div>
        </div>

        {/* Patterns temporels */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Quand j'écris le plus</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Jour favori</span>
              </div>
              <Badge variant="default">{stats.mostProductiveDay}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Créneau favori</span>
              </div>
              <Badge variant="default">{stats.mostProductiveHour}</Badge>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Thématiques</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tag le plus utilisé</span>
              </div>
              <Badge variant="default">{stats.favoriteTag}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tags différents</span>
              </div>
              <Badge variant="secondary">{stats.uniqueTags}</Badge>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground italic">
            {stats.totalNotes >= 100 && 
              "🎖️ Centenaire ! Vous avez développé une pratique solide."
            }
            {stats.totalNotes >= 50 && stats.totalNotes < 100 && 
              "⭐ Déjà 50 notes ! Votre journal prend forme."
            }
            {stats.totalNotes >= 10 && stats.totalNotes < 50 && 
              "📝 Bon début ! Continuez à explorer vos pensées."
            }
            {stats.totalNotes < 10 && stats.totalNotes > 0 && 
              "🌱 Bienvenue dans votre pratique de journaling !"
            }
            {stats.totalNotes === 0 && 
              "Commencez votre voyage de réflexion aujourd'hui."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
