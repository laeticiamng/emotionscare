// @ts-nocheck
/**
 * MusicJourneyPlayer - Lecteur de parcours musical guidé
 * Visualisation progressive des transitions émotionnelles
 */

import React, { useEffect, useState } from 'react';
import { LazyMotionWrapper, m, AnimatePresence } from '@/utils/lazy-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipForward,
  Star,
  CheckCircle2,
  Music2,
  TrendingUp,
  Sparkles
} from '@/components/music/icons';
import { useMusicJourney, type MusicJourney } from '@/hooks/useMusicJourney';

interface Props {
  journeyId: string;
  onComplete?: () => void;
}

const EMOTION_COLORS = {
  anxious: '#F97316',
  worried: '#FB923C',
  sad: '#6366F1',
  melancholic: '#818CF8',
  anger: '#DC2626',
  frustrated: '#EF4444',
  stressed: '#EA580C',
  tense: '#F97316',
  neutral: '#6B7280',
  balanced: '#10B981',
  peaceful: '#14B8A6',
  relaxed: '#06B6D4',
  hopeful: '#3B82F6',
  motivated: '#8B5CF6',
  calm: '#10B981',
  joy: '#F59E0B',
  energetic: '#EC4899'
};

export const MusicJourneyPlayer: React.FC<Props> = ({ journeyId, onComplete }) => {
  const { 
    activeJourney, 
    loadJourney, 
    playNextStep, 
    completeStep, 
    completeJourney,
    isGeneratingTrack 
  } = useMusicJourney();

  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(3);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    loadJourney(journeyId);
  }, [journeyId, loadJourney]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = async () => {
    if (!activeJourney) return;

    // Valider l'étape actuelle
    const currentTrack = activeJourney.tracks?.[currentTrackIndex];
    if (currentTrack) {
      await completeStep(currentTrack.id, 'improved', rating);
    }

    // Passer à l'étape suivante
    if (currentTrackIndex < (activeJourney.total_steps - 1)) {
      await playNextStep(journeyId);
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      // Parcours terminé
      await completeJourney(journeyId);
      onComplete?.();
    }
  };

  if (!activeJourney) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Music2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const currentTrack = activeJourney.tracks?.[currentTrackIndex];
  const progressPercent = ((currentTrackIndex + 1) / activeJourney.total_steps) * 100;

  return (
    <LazyMotionWrapper>
      <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* En-tête du parcours */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {activeJourney.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {activeJourney.description}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentTrackIndex + 1}/{activeJourney.total_steps}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Progression: {Math.round(progressPercent)}%
          </p>
        </CardContent>
      </Card>

      {/* Visualisation du parcours émotionnel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-8">
            {activeJourney.tracks?.map((track, index) => (
              <div key={track.id} className="flex flex-col items-center gap-2 flex-1">
                <m.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: index === currentTrackIndex ? 1.2 : 1,
                    opacity: index <= currentTrackIndex ? 1 : 0.4
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                    index < currentTrackIndex 
                      ? 'border-green-500 bg-green-500/20' 
                      : index === currentTrackIndex
                      ? 'border-primary bg-primary/20'
                      : 'border-muted bg-muted/20'
                  }`}
                  style={{
                    backgroundColor: EMOTION_COLORS[track.emotion_level as keyof typeof EMOTION_COLORS] + '20',
                    borderColor: EMOTION_COLORS[track.emotion_level as keyof typeof EMOTION_COLORS]
                  }}
                >
                  {track.is_completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </m.div>
                <p className="text-xs text-center capitalize font-medium">
                  {track.emotion_level}
                </p>
                {index < activeJourney.total_steps - 1 && (
                  <TrendingUp className="h-4 w-4 text-muted-foreground rotate-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lecteur actuel */}
      <AnimatePresence mode="wait">
        {currentTrack && (
          <m.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  Étape {currentTrack.step_number}: {currentTrack.emotion_level}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contrôles de lecture */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={handlePlayPause}
                    disabled={isGeneratingTrack}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16"
                    onClick={handleNextStep}
                    disabled={isGeneratingTrack}
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                {/* Évaluation de l'étape */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-center">
                    Comment vous sentez-vous après cette écoute ?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setRating(value)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            value <= rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {isGeneratingTrack && (
                  <div className="text-center text-sm text-muted-foreground">
                    <Music2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Génération de la prochaine étape...
                  </div>
                )}
              </CardContent>
            </Card>
          </m.div>
        )}
      </AnimatePresence>
    </div>
    </LazyMotionWrapper>
  );
};
