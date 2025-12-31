// @ts-nocheck
/**
 * JournalFavoritesPage - Affichage des notes favorites enrichi
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { SanitizedNote } from '@/modules/journal/types';
import { useJournalFavorites } from '@/hooks/useJournalFavorites';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface JournalFavoritesPageProps {
  notes: SanitizedNote[];
}

export const JournalFavoritesPage = memo<JournalFavoritesPageProps>(({ notes }) => {
  const { favorites, isFavorite } = useJournalFavorites();
  
  const favoriteNotes = notes.filter(note => note.id && isFavorite(note.id));

  // Stats
  const favStats = {
    total: favoriteNotes.length,
    thisMonth: favoriteNotes.filter(f => {
      const date = new Date(f.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    totalWords: favoriteNotes.reduce((acc, f) => acc + (f.text?.split(/\s+/).length || 0), 0),
    topTags: Array.from(
      favoriteNotes.reduce((map, f) => {
        (f.tags || []).forEach(tag => map.set(tag, (map.get(tag) || 0) + 1));
        return map;
      }, new Map<string, number>())
    ).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-7 w-7 text-destructive" aria-hidden="true" />
          Mes Favoris
        </h1>
        <p className="text-muted-foreground mt-1">
          Vos notes les plus importantes
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Heart className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favStats.total}</p>
                <p className="text-xs text-muted-foreground">Favoris</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favStats.thisMonth}</p>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <FileText className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favStats.totalWords.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Mots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Sparkles className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favStats.topTags.length}</p>
                <p className="text-xs text-muted-foreground">Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tags */}
      {favStats.topTags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tags fréquents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favStats.topTags.map(([tag, count]) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <span className="text-muted-foreground">({count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites List */}
      {favoriteNotes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
            <p className="text-muted-foreground mb-6">
              Cliquez sur le cœur d'une note pour l'ajouter.
            </p>
            <Button asChild>
              <Link to="/app/journal">
                Voir mes notes
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {favoriteNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Heart className="h-5 w-5 text-destructive fill-destructive flex-shrink-0" aria-hidden="true" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(note.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

JournalFavoritesPage.displayName = 'JournalFavoritesPage';
