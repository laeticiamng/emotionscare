/**
 * Contextual Recommendations - Recommandations basées sur le contexte
 * Heure, météo, jour de la semaine, activité
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Zap,
  Heart,
  Music,
  TrendingUp,
} from 'lucide-react';

interface RecommendedPlaylist {
  id: string;
  title: string;
  description: string;
  mood: string;
  emoji: string;
  color: string;
  context: string;
  trackCount: number;
  duration: number; // in minutes
}

interface ContextualRecommendationsProps {
  onPlaylistSelect?: (playlist: RecommendedPlaylist) => void;
  currentWeather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  userActivityLevel?: 'rest' | 'light' | 'moderate' | 'intense';
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const CONTEXT_RECOMMENDATIONS: Record<TimeOfDay, RecommendedPlaylist[]> = {
  morning: [
    {
      id: 'morning-wake',
      title: 'Réveil Énergique',
      description: 'Commence ta journée avec énergie et positivité',
      mood: 'Énergique',
      emoji: '🌅',
      color: 'from-orange-400 to-yellow-300',
      context: 'Matin',
      trackCount: 15,
      duration: 45,
    },
    {
      id: 'morning-calm',
      title: 'Matin Tranquille',
      description: 'Une douce transition vers la journée',
      mood: 'Calme',
      emoji: '☕',
      color: 'from-amber-400 to-orange-300',
      context: 'Matin',
      trackCount: 12,
      duration: 40,
    },
    {
      id: 'morning-focus',
      title: 'Focus Matinal',
      description: 'Musique pour une concentration maximale',
      mood: 'Concentré',
      emoji: '🎯',
      color: 'from-blue-400 to-cyan-300',
      context: 'Matin',
      trackCount: 18,
      duration: 50,
    },
  ],
  afternoon: [
    {
      id: 'afternoon-focus',
      title: 'Après-midi Productif',
      description: 'Rester concentré et productif l\'après-midi',
      mood: 'Concentré',
      emoji: '💼',
      color: 'from-blue-500 to-indigo-400',
      context: 'Après-midi',
      trackCount: 20,
      duration: 60,
    },
    {
      id: 'afternoon-relax',
      title: 'Détente Créative',
      description: 'Musiques créatives pour un moment de pause',
      mood: 'Créatif',
      emoji: '🎨',
      color: 'from-purple-400 to-pink-300',
      context: 'Après-midi',
      trackCount: 16,
      duration: 45,
    },
    {
      id: 'afternoon-upbeat',
      title: 'Groove Après-midi',
      description: 'Des rythmes pour relancer ta journée',
      mood: 'Heureux',
      emoji: '🎉',
      color: 'from-green-400 to-emerald-300',
      context: 'Après-midi',
      trackCount: 14,
      duration: 40,
    },
  ],
  evening: [
    {
      id: 'evening-unwind',
      title: 'Soirée Détente',
      description: 'Ralentir et se détendre après la journée',
      mood: 'Calme',
      emoji: '🌙',
      color: 'from-indigo-500 to-purple-400',
      context: 'Soirée',
      trackCount: 17,
      duration: 55,
    },
    {
      id: 'evening-social',
      title: 'Soirée Conviviale',
      description: 'Musiques pour une bonne ambiance sociale',
      mood: 'Heureux',
      emoji: '🎊',
      color: 'from-pink-400 to-rose-300',
      context: 'Soirée',
      trackCount: 19,
      duration: 60,
    },
    {
      id: 'evening-romantic',
      title: 'Moment Poétique',
      description: 'Des mélodies douces et émouvantes',
      mood: 'Émotionnel',
      emoji: '💕',
      color: 'from-red-400 to-pink-300',
      context: 'Soirée',
      trackCount: 13,
      duration: 45,
    },
  ],
  night: [
    {
      id: 'night-sleep',
      title: 'Bonne Nuit Paisible',
      description: 'Pour s\'endormir sereinement',
      mood: 'Calme',
      emoji: '😴',
      color: 'from-slate-600 to-slate-500',
      context: 'Nuit',
      trackCount: 10,
      duration: 30,
    },
    {
      id: 'night-study',
      title: 'Nuit Studieuse',
      description: 'Concentration pour le travail nocturne',
      mood: 'Concentré',
      emoji: '📚',
      color: 'from-slate-700 to-blue-600',
      context: 'Nuit',
      trackCount: 16,
      duration: 50,
    },
    {
      id: 'night-chill',
      title: 'Nuit Chill',
      description: 'Ambiance relaxe pour la nuit',
      mood: 'Relaxe',
      emoji: '🌃',
      color: 'from-slate-500 to-cyan-600',
      context: 'Nuit',
      trackCount: 14,
      duration: 45,
    },
  ],
};

const WEATHER_MODIFIERS: Record<
  string,
  { emoji: string; mood: string; description: string }
> = {
  sunny: {
    emoji: '☀️',
    mood: 'Énergique',
    description: 'Beau temps - musiques optimistes',
  },
  cloudy: {
    emoji: '☁️',
    mood: 'Réfléchi',
    description: 'Temps couvert - musiques contemplatives',
  },
  rainy: {
    emoji: '🌧️',
    mood: 'Mélancolique',
    description: 'Pluie - musiques émotionnelles',
  },
  snowy: {
    emoji: '❄️',
    mood: 'Magique',
    description: 'Neige - musiques féériques',
  },
};

export const ContextualRecommendations: React.FC<
  ContextualRecommendationsProps
> = ({
  onPlaylistSelect,
  currentWeather = 'sunny',
  userActivityLevel = 'moderate',
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [recommendations, setRecommendations] = useState<RecommendedPlaylist[]>(
    CONTEXT_RECOMMENDATIONS[timeOfDay]
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  // Update time of day every minute
  useEffect(() => {
    const updateTime = () => {
      const newTime = getTimeOfDay();
      if (newTime !== timeOfDay) {
        setTimeOfDay(newTime);
      }
    };

    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timeOfDay]);

  // Update recommendations based on context
  useEffect(() => {
    setRecommendations(CONTEXT_RECOMMENDATIONS[timeOfDay]);
    setSelectedPlaylist(null);
  }, [timeOfDay]);

  const weatherInfo = WEATHER_MODIFIERS[currentWeather] || WEATHER_MODIFIERS.sunny;

  const timeEmojis: Record<TimeOfDay, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
  };

  const timeLabels: Record<TimeOfDay, string> = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soirée',
    night: 'Nuit',
  };

  const handleSelectPlaylist = (playlist: RecommendedPlaylist) => {
    setSelectedPlaylist(playlist.id);
    onPlaylistSelect?.(playlist);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommandations Intelligentes
          </CardTitle>

          {/* Context Info */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge
              variant="secondary"
              className="gap-1 flex items-center"
            >
              <Clock className="h-3 w-3" />
              {timeEmojis[timeOfDay]} {timeLabels[timeOfDay]}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1 flex items-center"
            >
              {weatherInfo.emoji} {weatherInfo.mood}
            </Badge>
            {userActivityLevel === 'intense' && (
              <Badge
                variant="secondary"
                className="gap-1 flex items-center bg-red-500/20 text-red-700 border-red-500/30"
              >
                <Zap className="h-3 w-3" />
                Activité intense
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weather-based suggestion */}
        {currentWeather !== 'sunny' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-accent/10 border border-accent/20"
          >
            <p className="text-xs text-foreground">
              <span className="font-semibold">{weatherInfo.emoji} Conseil météo:</span>{' '}
              {weatherInfo.description}
            </p>
          </motion.div>
        )}

        {/* Recommendations Grid */}
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {recommendations.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all overflow-hidden group ${
                  selectedPlaylist === playlist.id
                    ? 'bg-accent/20 border-accent'
                    : 'bg-gradient-to-br border-muted hover:border-accent hover:shadow-lg'
                }`}
                onClick={() => handleSelectPlaylist(playlist)}
                style={
                  selectedPlaylist !== playlist.id
                    ? {
                        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      }
                    : {}
                }
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${playlist.color}`}
                />

                <div className="relative space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{playlist.emoji}</span>
                        <h4 className="font-semibold text-sm truncate">
                          {playlist.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {playlist.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>♪ {playlist.trackCount} titres</span>
                    <span>⏱️ {playlist.duration} min</span>
                  </div>

                  {/* Mood Badge */}
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: `${playlist.color.split(' ')[1]}20`,
                    }}
                  >
                    {playlist.mood}
                  </Badge>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant={
                      selectedPlaylist === playlist.id ? 'default' : 'outline'
                    }
                    className="w-full text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlaylist(playlist);
                    }}
                  >
                    {selectedPlaylist === playlist.id ? '✓ Sélectionné' : '▶️ Écouter'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Smart Insights */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/30 border">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Music className="h-3 w-3" />
              Meilleure heure
            </p>
            <p className="text-sm font-medium">
              {timeLabels[timeOfDay]}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Humeur suggérée
            </p>
            <p className="text-sm font-medium">{weatherInfo.mood}</p>
          </div>
        </div>

        {/* Tip */}
        <div className="text-xs text-muted-foreground p-2 rounded bg-accent/5 border border-accent/20">
          💡 <strong>Astuce:</strong> Les recommandations changent automatiquement
          toutes les heures selon votre contexte!
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextualRecommendations;
