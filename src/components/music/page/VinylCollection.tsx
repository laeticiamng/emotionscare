/**
 * VinylCollection - Grille des vinyles thérapeutiques
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Heart, Loader2, Sparkles, Clock } from 'lucide-react';
import type { MusicTrack } from '@/types/music';

interface VinylTrack extends MusicTrack {
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  description: string;
}

interface VinylCollectionProps {
  tracks: VinylTrack[];
  audioSources: Record<string, string>;
  loadingTrackId: string | null;
  categoryIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  isFavorite: (id: string) => boolean;
  isLoadingFavorites: boolean;
  onStartTrack: (track: VinylTrack) => void;
  onToggleFavorite: (track: VinylTrack) => void;
  filterCategory?: string;
  sortBy?: 'title' | 'duration' | 'category';
}

export const VinylCollection: React.FC<VinylCollectionProps> = ({
  tracks,
  audioSources,
  loadingTrackId,
  categoryIcons,
  isFavorite,
  isLoadingFavorites,
  onStartTrack,
  onToggleFavorite,
  filterCategory,
  sortBy = 'title'
}) => {
  // Apply filtering and sorting
  const displayTracks = React.useMemo(() => {
    let result = [...tracks];
    
    // Filter by category
    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'duration') return a.duration - b.duration;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return a.title.localeCompare(b.title);
    });
    
    return result;
  }, [tracks, filterCategory, sortBy]);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
      {displayTracks.map((track) => {
        const Icon = categoryIcons[track.category];
        const favorite = isFavorite(track.id);
        const isLoading = loadingTrackId === track.id;
        const audioSource = audioSources[track.id] || 'fallback';
        
        return (
          <Tooltip key={track.id}>
            <TooltipTrigger asChild>
              <div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    role="button"
                    tabIndex={0}
                    aria-label={`Lancer le vinyle ${track.title} de ${track.artist}, catégorie ${track.category}`}
                    className="h-full bg-card/90 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    onClick={() => !isLoading && onStartTrack(track)}
                    onKeyDown={(e) => {
                      if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onStartTrack(track);
                      }
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Vinyl Disc with enhanced 3D effect */}
                      <div className="relative perspective-1000">
                        <motion.div
                          animate={isLoading ? { rotate: 360 } : { rotateY: 0 }}
                          whileHover={{ rotateY: 15, scale: 1.05 }}
                          transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                          className="w-28 h-28 mx-auto rounded-full relative overflow-hidden shadow-2xl"
                          style={{ 
                            background: `radial-gradient(circle at 30% 30%, ${track.vinylColor}, ${track.color}40)`,
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          {/* Vinyl grooves */}
                          <div className="absolute inset-2 rounded-full border-2 border-foreground/20" />
                          <div className="absolute inset-4 rounded-full border border-foreground/15" />
                          <div className="absolute inset-6 rounded-full border border-foreground/15" />
                          <div className="absolute inset-8 rounded-full border border-foreground/10" />
                          
                          {/* Vinyl shine effect */}
                          <div 
                            className="absolute inset-0 rounded-full opacity-40"
                            style={{ 
                              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)'
                            }}
                          />
                          
                          {/* Center label */}
                          <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full bg-card border-2 border-foreground/30 flex items-center justify-center shadow-inner">
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" style={{ color: track.color }} />
                            ) : Icon ? (
                              <Icon className="w-4 h-4" style={{ color: track.color }} />
                            ) : null}
                          </div>
                        </motion.div>
                        
                        {/* Glow effect */}
                        <motion.div 
                          className="absolute -inset-4 rounded-full opacity-20 blur-xl -z-10"
                          style={{ background: track.vinylColor }}
                          animate={{ opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium text-foreground">
                          {track.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {track.artist}
                        </p>
                        
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${track.color}20`,
                            color: track.color
                          }}
                        >
                          {track.mood}
                        </Badge>

                        <Badge
                          variant={audioSource === 'supabase' ? 'default' : 'outline'}
                          className="text-xs ml-1"
                        >
                          {audioSource === 'supabase' ? (
                            <>
                              <Sparkles className="h-3 w-3 mr-1" />
                              Cloud
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Backup
                            </>
                          )}
                        </Badge>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {track.description}
                        </p>

                        <div className="pt-2 space-y-2">
                          <Button
                            size="sm"
                            className="w-full"
                            aria-label={`Lancer ${track.title}`}
                            disabled={isLoading}
                            style={{
                              backgroundColor: `${track.color}15`,
                              color: track.color,
                              borderColor: `${track.color}30`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartTrack(track);
                            }}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" aria-hidden="true" />
                                Chargement...
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                                Lancer le vinyle
                              </>
                            )}
                          </Button>
                          <Button
                            variant={favorite ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full"
                            aria-label={favorite ? `Retirer ${track.title} des favoris` : `Ajouter ${track.title} aux favoris`}
                            aria-pressed={favorite}
                            disabled={isLoadingFavorites}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(track);
                            }}
                          >
                            <Heart className={`h-3 w-3 mr-2 ${favorite ? 'fill-current text-destructive' : ''}`} aria-hidden="true" />
                            {favorite ? 'Favori' : 'Ajouter'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-semibold">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.description}</p>
                <p className="text-xs">
                  <span className="font-medium">Mood:</span> {track.mood}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Durée:</span> {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default VinylCollection;
