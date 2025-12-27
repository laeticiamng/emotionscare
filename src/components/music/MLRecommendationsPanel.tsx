/**
 * ML Recommendations Panel - Recommandations intelligentes
 * Explications, scores de confiance, filtres avancés
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Heart,
  Zap,
  Filter,
  Info,
  Play,
  Plus,
  ChevronDown,
  ChevronUp,
  Music,
  Clock,
  Target,
} from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

interface MLRecommendation {
  track: MusicTrack;
  score: number;
  reasons: string[];
  factors: {
    emotionMatch: number;
    historyMatch: number;
    trendingScore: number;
    diversityBonus: number;
  };
  category: 'perfect' | 'discovery' | 'trending' | 'similar';
}

interface MLRecommendationsPanelProps {
  currentEmotion?: string;
  userId?: string;
  onPlayTrack?: (track: MusicTrack) => void;
  onAddToPlaylist?: (track: MusicTrack) => void;
}

const MOCK_RECOMMENDATIONS: MLRecommendation[] = [
  {
    track: {
      id: '1',
      title: 'Calm Waters',
      artist: 'Ambient Collective',
      url: '',
      audioUrl: '/audio/calm.mp3',
      duration: 245,
      emotion: 'calm',
      mood: 'peaceful',
    },
    score: 0.95,
    reasons: ['Correspond à votre humeur actuelle', 'Artiste que vous aimez', 'Tendance cette semaine'],
    factors: { emotionMatch: 0.98, historyMatch: 0.85, trendingScore: 0.72, diversityBonus: 0.1 },
    category: 'perfect',
  },
  {
    track: {
      id: '2',
      title: 'Focus Flow',
      artist: 'Deep Work',
      url: '',
      audioUrl: '/audio/focus.mp3',
      duration: 320,
      emotion: 'focus',
      mood: 'concentrated',
    },
    score: 0.88,
    reasons: ['Idéal pour la concentration', 'Nouveau dans votre genre préféré'],
    factors: { emotionMatch: 0.75, historyMatch: 0.92, trendingScore: 0.45, diversityBonus: 0.3 },
    category: 'discovery',
  },
  {
    track: {
      id: '3',
      title: 'Energy Boost',
      artist: 'Motivation Lab',
      url: '',
      audioUrl: '/audio/energy.mp3',
      duration: 198,
      emotion: 'energetic',
      mood: 'motivated',
    },
    score: 0.82,
    reasons: ['Populaire cette semaine', 'Boost d\'énergie recommandé'],
    factors: { emotionMatch: 0.55, historyMatch: 0.6, trendingScore: 0.98, diversityBonus: 0.2 },
    category: 'trending',
  },
  {
    track: {
      id: '4',
      title: 'Sunset Dreams',
      artist: 'Chill Horizon',
      url: '',
      audioUrl: '/audio/sunset.mp3',
      duration: 275,
      emotion: 'relaxed',
      mood: 'dreamy',
    },
    score: 0.79,
    reasons: ['Similaire à vos favoris', 'Recommandé pour le soir'],
    factors: { emotionMatch: 0.82, historyMatch: 0.78, trendingScore: 0.35, diversityBonus: 0.15 },
    category: 'similar',
  },
];

const CATEGORY_CONFIG = {
  perfect: { label: 'Match parfait', icon: Target, color: 'text-green-500' },
  discovery: { label: 'Découverte', icon: Sparkles, color: 'text-purple-500' },
  trending: { label: 'Tendance', icon: TrendingUp, color: 'text-orange-500' },
  similar: { label: 'Similaire', icon: Heart, color: 'text-pink-500' },
};

export const MLRecommendationsPanel: React.FC<MLRecommendationsPanelProps> = ({
  currentEmotion = 'neutral',
  onPlayTrack,
  onAddToPlaylist,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minScore, setMinScore] = useState(0.5);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecommendations = useMemo(() => {
    return MOCK_RECOMMENDATIONS.filter((rec) => {
      if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
      if (rec.score < minScore) return false;
      return true;
    }).sort((a, b) => b.score - a.score);
  }, [selectedCategory, minScore]);

  const handlePlay = (track: MusicTrack) => {
    onPlayTrack?.(track);
    toast({
      title: '▶️ Lecture',
      description: `${track.title} - ${track.artist}`,
    });
  };

  const handleAdd = (track: MusicTrack) => {
    onAddToPlaylist?.(track);
    toast({
      title: '➕ Ajouté',
      description: `${track.title} ajouté à votre playlist`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Recommandations IA
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Basé sur votre humeur: <Badge variant="secondary">{currentEmotion}</Badge>
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 space-y-3"
            >
              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-5 h-8">
                  <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <TabsTrigger key={key} value={key} className="text-xs gap-1">
                      <config.icon className={`h-3 w-3 ${config.color}`} />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Score Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Score minimum</span>
                  <Badge variant="outline">{Math.round(minScore * 100)}%</Badge>
                </div>
                <Slider
                  value={[minScore]}
                  onValueChange={([v]) => setMinScore(v)}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Recommendations List */}
        <div className="space-y-2">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((rec, index) => {
              const CategoryIcon = CATEGORY_CONFIG[rec.category].icon;
              const isExpanded = expandedTrack === rec.track.id;

              return (
                <motion.div
                  key={rec.track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  <div
                    className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedTrack(isExpanded ? null : rec.track.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Score Circle */}
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <svg className="h-12 w-12 -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-muted/20"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${rec.score * 125.6} 125.6`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                          {Math.round(rec.score * 100)}
                        </span>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{rec.track.title}</p>
                          <CategoryIcon
                            className={`h-4 w-4 flex-shrink-0 ${CATEGORY_CONFIG[rec.category].color}`}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{rec.track.artist}</p>
                        <div className="flex gap-1 mt-1">
                          {rec.reasons.slice(0, 2).map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] h-4">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(rec.track);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(rec.track);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-3 border-t bg-muted/20"
                      >
                        <div className="pt-3 space-y-3">
                          <p className="text-xs font-semibold flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Pourquoi cette recommandation ?
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Émotion</span>
                                <span>{Math.round(rec.factors.emotionMatch * 100)}%</span>
                              </div>
                              <Progress value={rec.factors.emotionMatch * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Historique</span>
                                <span>{Math.round(rec.factors.historyMatch * 100)}%</span>
                              </div>
                              <Progress value={rec.factors.historyMatch * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Tendance</span>
                                <span>{Math.round(rec.factors.trendingScore * 100)}%</span>
                              </div>
                              <Progress value={rec.factors.trendingScore * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Diversité</span>
                                <span>{Math.round(rec.factors.diversityBonus * 100)}%</span>
                              </div>
                              <Progress value={rec.factors.diversityBonus * 100} className="h-1.5" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {rec.reasons.map((reason, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune recommandation avec ces critères</p>
              <Button size="sm" variant="link" onClick={() => setMinScore(0)}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredRecommendations.length} recommandation(s)</span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Mis à jour il y a 2 min
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLRecommendationsPanel;
