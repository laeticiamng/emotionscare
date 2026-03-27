// @ts-nocheck
/**
 * MusicRecommendations - Système de recommandations musicales IA
 * Suggère des morceaux basés sur l'écoute et les émotions
 */

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Play, Plus, TrendingUp } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { toast } from '@/hooks/use-toast';

interface Recommendation {
  track: MusicTrack;
  score: number; // 0-1
  reason: string;
  category: 'mood' | 'similar' | 'discovery' | 'trending';
}

interface MusicRecommendationsProps {
  currentMood?: string;
  recentTracks?: MusicTrack[];
  onPlayTrack?: (track: MusicTrack) => void;
  onAddToPlaylist?: (track: MusicTrack) => void;
}

export const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({
  currentMood = 'calm',
  recentTracks = [],
  onPlayTrack,
  onAddToPlaylist
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    generateRecommendations();
  }, [currentMood, recentTracks]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulation de génération de recommandations
    // Dans un environnement réel, cela ferait appel à une API
    const mockRecommendations: Recommendation[] = [
      {
        track: {
          id: 'rec-1',
          title: 'Sérénité Océanique',
          artist: 'Nature Sounds',
          url: '/audio/serenite.mp3',
          audioUrl: '/audio/serenite.mp3',
          duration: 240,
          emotion: currentMood,
          mood: currentMood
        },
        score: 0.95,
        reason: 'Correspond parfaitement à votre humeur actuelle',
        category: 'mood'
      },
      {
        track: {
          id: 'rec-2',
          title: 'Harmonies Zen',
          artist: 'Meditation Masters',
          url: '/audio/zen.mp3',
          audioUrl: '/audio/zen.mp3',
          duration: 300,
          emotion: currentMood
        },
        score: 0.88,
        reason: 'Similaire à vos écoutes récentes',
        category: 'similar'
      },
      {
        track: {
          id: 'rec-3',
          title: 'Voyage Intérieur',
          artist: 'Mindful Journey',
          url: '/audio/voyage.mp3',
          audioUrl: '/audio/voyage.mp3',
          duration: 360,
          emotion: 'focused'
        },
        score: 0.82,
        reason: 'Nouvelle découverte pour vous',
        category: 'discovery'
      },
      {
        track: {
          id: 'rec-4',
          title: 'Énergie Positive',
          artist: 'Uplifting Vibes',
          url: '/audio/energie.mp3',
          audioUrl: '/audio/energie.mp3',
          duration: 210,
          emotion: 'happy'
        },
        score: 0.75,
        reason: 'Tendance de la semaine',
        category: 'trending'
      }
    ];

    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 800);
  };

  const categoryLabels: Record<string, string> = {
    all: 'Toutes',
    mood: 'Humeur',
    similar: 'Similaires',
    discovery: 'Découvertes',
    trending: 'Tendances'
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    mood: <Sparkles className="w-4 h-4" />,
    similar: <Play className="w-4 h-4" />,
    discovery: <Plus className="w-4 h-4" />,
    trending: <TrendingUp className="w-4 h-4" />
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedCategory);

  const handlePlay = (track: MusicTrack) => {
    onPlayTrack?.(track);
    toast({
      title: "Lecture démarrée",
      description: `${track.title} - ${track.artist}`
    });
  };

  const handleAddToPlaylist = (track: MusicTrack) => {
    onAddToPlaylist?.(track);
    toast({
      title: "Ajouté à la playlist",
      description: `${track.title} ajouté avec succès`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Recommandations pour vous
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={generateRecommendations}
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      {/* Filtres de catégories */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Badge
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1"
            onClick={() => setSelectedCategory(key)}
          >
            {categoryIcons[key]}
            {label}
          </Badge>
        ))}
      </div>

      <ScrollArea className="h-[600px]">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucune recommandation</p>
              <p className="text-muted-foreground">
                Écoutez plus de musique pour obtenir des recommandations personnalisées
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.track.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{rec.track.title}</h3>
                        <Badge variant="outline" className="shrink-0">
                          {categoryIcons[rec.category]}
                          {categoryLabels[rec.category]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.track.artist}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${rec.score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {Math.round(rec.score * 100)}% match
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {rec.reason}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePlay(rec.track)}
                        className="whitespace-nowrap"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Écouter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToPlaylist(rec.track)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
