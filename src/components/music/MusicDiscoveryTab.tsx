/**
 * Music Discovery Tab - Exploration et découverte de musiques
 * Inclut: vinyles, générateur IA, recommandations, journeys
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Play,
  Sparkles,
  Radio,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  duration: number;
  description: string;
  waveform?: number[];
}

interface MusicDiscoveryTabProps {
  vinylTracks: MusicTrack[];
  loadingTrackId: string | null;
  onPlayTrack: (track: MusicTrack) => void;
  onFavoritesChange?: (trackId: string, isFavorite: boolean) => void;
  isFavorite?: (trackId: string) => boolean;
  showAIGenerator?: boolean;
  onOpenGenerator?: () => void;
  children?: React.ReactNode;
}

const categoryIcons = {
  doux: '💙',
  créatif: '✨',
  énergique: '⚡',
  guérison: '🧠',
};

export const MusicDiscoveryTab: React.FC<MusicDiscoveryTabProps> = ({
  vinylTracks,
  loadingTrackId,
  onPlayTrack,
  onFavoritesChange,
  isFavorite = () => false,
  showAIGenerator = true,
  onOpenGenerator,
  children,
}) => {
  // Group tracks by category
  const tracksByCategory = vinylTracks.reduce(
    (acc, track) => {
      if (!acc[track.category]) {
        acc[track.category] = [];
      }
      acc[track.category].push(track);
      return acc;
    },
    {} as Record<string, MusicTrack[]>
  );

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-foreground">
          Vinyles en Apesanteur
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvre des musiques générées par IA adaptées à ton état émotionnel.
        </p>
      </div>

      {/* AI Generator Section */}
      {showAIGenerator && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Générateur IA
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Crée ta musique thérapeutique personnalisée
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onOpenGenerator}
              className="w-full gap-2"
              size="lg"
            >
              <Radio className="h-5 w-5" />
              Créer une musique personnalisée
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Custom Children (EmotionalMusicGenerator, ML Recommendations, etc.) */}
      {children}

      {/* Vinyl Collection by Category */}
      {Object.entries(tracksByCategory).map(([category, tracks]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            <Badge variant="secondary">{tracks.length} titres</Badge>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track) => {
              const isLoading = loadingTrackId === track.id;
              const favorite = isFavorite(track.id);

              return (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="h-full bg-card/90 backdrop-blur-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    onClick={() => onPlayTrack(track)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onPlayTrack(track);
                      }
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Vinyl Disc */}
                      <div className="relative flex justify-center">
                        <motion.div
                          animate={isLoading ? { rotate: 360 } : {}}
                          transition={
                            isLoading
                              ? { duration: 2, repeat: Infinity, ease: 'linear' }
                              : {}
                          }
                          className="w-24 h-24 rounded-full relative overflow-hidden"
                          style={{ background: track.vinylColor }}
                        >
                          {/* Vinyl grooves */}
                          <div className="absolute inset-2 rounded-full border-2 border-foreground/20" />
                          <div className="absolute inset-4 rounded-full border border-foreground/20" />
                          <div className="absolute inset-6 rounded-full border border-foreground/20" />

                          {/* Center hole */}
                          <div className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full bg-card border-2 border-foreground/30 flex items-center justify-center">
                            {isLoading ? (
                              <Loader2
                                className="w-3 h-3 animate-spin"
                                style={{ color: track.color }}
                              />
                            ) : (
                              <Play
                                className="w-3 h-3"
                                style={{ color: track.color }}
                              />
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Track Info */}
                      <div className="text-center space-y-2">
                        <h4 className="font-medium truncate">{track.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {track.artist}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${track.color}20`,
                            color: track.color,
                          }}
                        >
                          {track.mood}
                        </Badge>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {track.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayTrack(track);
                          }}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Chargement...
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-2" />
                              Lancer
                            </>
                          )}
                        </Button>
                        <Button
                          variant={favorite ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full"
                          disabled={false}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFavoritesChange?.(track.id, !favorite);
                          }}
                        >
                          <Heart
                            className={`h-3 w-3 mr-2 ${
                              favorite ? 'fill-current text-destructive' : ''
                            }`}
                          />
                          {favorite ? 'Favori' : 'Ajouter'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicDiscoveryTab;
