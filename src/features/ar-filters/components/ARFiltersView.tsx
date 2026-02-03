/**
 * Vue principale des filtres AR
 * Interface pour sélectionner et utiliser les filtres de réalité augmentée
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, X, Heart, Zap, Moon, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useARFilters, type ARFilter, type MoodImpact } from '../index';
import { FilterCard } from './FilterCard';
import { FilterPreview } from './FilterPreview';
import { cn } from '@/lib/utils';

const FILTER_ICONS: Record<string, React.ReactNode> = {
  'mood-aura': <Sparkles className="h-4 w-4" />,
  'emotion-mask': <Heart className="h-4 w-4" />,
  'zen-particles': <Moon className="h-4 w-4" />,
  'nature-overlay': <Leaf className="h-4 w-4" />,
  'dream-filter': <Moon className="h-4 w-4" />,
  'energy-flow': <Zap className="h-4 w-4" />,
};

export function ARFiltersView() {
  const {
    activeFilter,
    isActive,
    photoCount,
    stats,
    allFilters,
    startSession,
    endSession,
    takePhoto,
  } = useARFilters();

  const [showFeedback, setShowFeedback] = useState(false);

  const handleEndSession = () => {
    setShowFeedback(true);
  };

  const handleFeedback = (impact: MoodImpact) => {
    endSession(impact);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Filtres AR</h1>
        </div>
        {stats && (
          <Badge variant="secondary">
            {stats.totalSessions} sessions • {stats.moodImprovementRate}% positif
          </Badge>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isActive && activeFilter ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-border/50">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Preview Area */}
                  <FilterPreview filter={activeFilter} />

                  {/* Filter Info */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {FILTER_ICONS[activeFilter.type]}
                      <span className="font-medium text-foreground">{activeFilter.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activeFilter.description}</p>
                  </div>

                  {/* Photo Counter */}
                  <div className="flex items-center justify-center gap-4">
                    <Badge variant="outline" className="text-primary">
                      📸 {photoCount} photos
                    </Badge>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={takePhoto}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Camera className="h-5 w-5" />
                      Capturer
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleEndSession}
                      className="gap-2"
                    >
                      <X className="h-5 w-5" />
                      Terminer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <h2 className="text-lg font-semibold mb-2">
                  Exprimez vos émotions en réalité augmentée
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Choisissez un filtre qui reflète votre humeur actuelle et capturez des moments
                  de bien-être.
                </p>
              </CardContent>
            </Card>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFilters.map((filter) => (
                <FilterCard
                  key={filter.id}
                  filter={filter}
                  onSelect={() => startSession(filter)}
                  icon={FILTER_ICONS[filter.type]}
                />
              ))}
            </div>

            {/* Stats */}
            {stats && stats.totalSessions > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vos statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.totalMinutes}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.photosTaken}</div>
                      <div className="text-xs text-muted-foreground">Photos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{stats.moodImprovementRate}%</div>
                      <div className="text-xs text-muted-foreground">Impact positif</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Dialog */}
      {showFeedback && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center">Comment vous sentez-vous ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Ce filtre vous a-t-il aidé ?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFeedback('positive')}
                  className="flex-col h-auto py-4"
                >
                  <span className="text-2xl mb-1">😊</span>
                  <span className="text-xs">Mieux</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFeedback('neutral')}
                  className="flex-col h-auto py-4"
                >
                  <span className="text-2xl mb-1">😐</span>
                  <span className="text-xs">Pareil</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFeedback('negative')}
                  className="flex-col h-auto py-4"
                >
                  <span className="text-2xl mb-1">😔</span>
                  <span className="text-xs">Moins bien</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
