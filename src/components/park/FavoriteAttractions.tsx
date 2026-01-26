/**
 * FavoriteAttractions - Affichage des attractions favorites
 */

import { motion } from 'framer-motion';
import { Heart, Star, Clock, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useParkFavorites, type FavoriteAttraction } from '@/hooks/useParkFavorites';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FavoriteAttractionsProps {
  onSelectAttraction?: (attractionId: string) => void;
  showHeader?: boolean;
  maxItems?: number;
  className?: string;
}

export function FavoriteAttractions({
  onSelectAttraction,
  showHeader = true,
  maxItems,
  className = ''
}: FavoriteAttractionsProps) {
  const {
    favorites,
    isLoading,
    removeFavorite,
    getMostVisited,
    favoritesCount
  } = useParkFavorites();

  const displayFavorites = maxItems ? favorites.slice(0, maxItems) : favorites;
  const mostVisited = getMostVisited(3);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-20">
            <div className="animate-pulse text-muted-foreground">
              Chargement des favoris...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas encore d'attractions favorites.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Cliquez sur ❤️ sur une attraction pour l'ajouter.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              Mes Favoris
            </CardTitle>
            <Badge variant="secondary">{favoritesCount}</Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4 pt-0">
        {/* Most Visited Section */}
        {mostVisited.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Plus visités
            </p>
            <div className="flex gap-2">
              {mostVisited.map((fav, index) => (
                <motion.button
                  key={fav.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectAttraction?.(fav.attractionId)}
                  className="flex-1 p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50 hover:border-primary/50 transition-all text-left"
                >
                  <p className="text-xs font-medium truncate">{fav.attractionName}</p>
                  <p className="text-xs text-muted-foreground">{fav.visitCount} visites</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All Favorites */}
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {displayFavorites.map((favorite, index) => (
              <FavoriteItem
                key={favorite.id}
                favorite={favorite}
                index={index}
                onSelect={() => onSelectAttraction?.(favorite.attractionId)}
                onRemove={() => removeFavorite(favorite.attractionId)}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface FavoriteItemProps {
  favorite: FavoriteAttraction;
  index: number;
  onSelect: () => void;
  onRemove: () => void;
}

function FavoriteItem({ favorite, index, onSelect, onRemove }: FavoriteItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
    >
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{favorite.attractionName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {favorite.zone}
            </span>
            {favorite.lastVisited && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(favorite.lastVisited, { locale: fr })}
              </span>
            )}
          </div>
        </div>
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}

export default FavoriteAttractions;
