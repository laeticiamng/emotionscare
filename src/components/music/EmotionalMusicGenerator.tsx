/**
 * EMOTIONAL MUSIC GENERATOR - EmotionsCare
 * Composant de génération de musique basée sur les émotions
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m, AnimatePresence } from '@/utils/lazy-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Music2, Heart, Zap, Loader2, Play, Download } from '@/components/music/icons';
import { useEmotionalMusicAI } from '@/hooks/useEmotionalMusicAI';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { cn } from '@/lib/utils';

const emotionIcons: Record<string, any> = {
  joy: Sparkles,
  calm: Heart,
  sad: Heart,
  anger: Zap,
  anxious: Brain,
  energetic: Zap,
  neutral: Music2,
};

const emotionColors: Record<string, string> = {
  joy: 'from-yellow-500 to-orange-400',
  calm: 'from-blue-500 to-cyan-400',
  sad: 'from-indigo-500 to-purple-400',
  anger: 'from-red-500 to-orange-500',
  anxious: 'from-purple-500 to-pink-400',
  energetic: 'from-green-500 to-emerald-400',
  neutral: 'from-gray-500 to-slate-400',
};

export const EmotionalMusicGenerator: React.FC = () => {
  const {
    isAnalyzing,
    isGenerating,
    emotionAnalysis,
    generationProgress,
    currentGeneration,
    recommendations,
    analyzeEmotions,
    generateFromCurrentEmotion,
    pollGenerationStatus,
  } = useEmotionalMusicAI();

  const { play } = useMusicCompat();
  const [completedTrack, setCompletedTrack] = useState<any>(null);

  // Analyser automatiquement au montage
  useEffect(() => {
    analyzeEmotions();
  }, []);

  // Poll le statut si une génération est en cours
  useEffect(() => {
    if (currentGeneration && !completedTrack) {
      pollGenerationStatus(
        currentGeneration.taskId,
        currentGeneration.trackId,
        (track) => {
          setCompletedTrack(track);
        }
      );
    }
  }, [currentGeneration, completedTrack, pollGenerationStatus]);

  const handleGenerate = async () => {
    const result = await generateFromCurrentEmotion();
    if (result) {
      setCompletedTrack(null);
    }
  };

  const handlePlay = () => {
    if (completedTrack?.audio_url) {
      play({
        id: currentGeneration!.trackId,
        title: `Musique ${emotionAnalysis?.dominantEmotion}`,
        artist: 'EmotionsCare AI',
        url: completedTrack.audio_url,
        audioUrl: completedTrack.audio_url,
        duration: completedTrack.duration || 180,
        emotion: emotionAnalysis?.dominantEmotion,
        isGenerated: true,
      });
    }
  };

  const EmotionIcon = emotionAnalysis ? emotionIcons[emotionAnalysis.dominantEmotion] || Music2 : Music2;

  return (
    <LazyMotionWrapper>
      <div className="space-y-6">
      {/* Analyse émotionnelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Votre État Émotionnel
          </CardTitle>
          <CardDescription>
            Analyse de vos émotions récentes pour générer de la musique personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : emotionAnalysis ? (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-full bg-gradient-to-br",
                    emotionColors[emotionAnalysis.dominantEmotion]
                  )}>
                    <EmotionIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Émotion dominante</p>
                    <p className="text-xl font-semibold capitalize">{emotionAnalysis.dominantEmotion}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  Intensité: {Math.round(emotionAnalysis.avgIntensity * 100)}%
                </Badge>
              </div>

              {emotionAnalysis.musicProfile && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Profil musical recommandé</p>
                  <p className="text-sm">{emotionAnalysis.musicProfile.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emotionAnalysis.musicProfile.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer ma musique thérapeutique
                  </>
                )}
              </Button>
            </m.div>
          ) : (
            <Button onClick={analyzeEmotions} variant="outline" className="w-full">
              Analyser mes émotions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Progression de génération */}
      <AnimatePresence>
        {isGenerating && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Génération IA en cours...</span>
                    <span className="font-medium">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Création de votre composition unique avec Suno AI
                  </p>
                </div>
              </CardContent>
            </Card>
          </m.div>
        )}
      </AnimatePresence>

      {/* Track généré */}
      <AnimatePresence>
        {completedTrack && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-primary/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Votre Musique Personnalisée
                </CardTitle>
                <CardDescription>
                  Générée spécialement pour votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedTrack.image_url && (
                  <img
                    src={completedTrack.image_url}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div className="flex gap-2">
                  <Button onClick={handlePlay} className="flex-1" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Écouter maintenant
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href={completedTrack.audio_url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </m.div>
        )}
      </AnimatePresence>

      {/* Historique */}
      {recommendations && recommendations.recentTracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5" />
              Vos Compositions Précédentes
            </CardTitle>
            <CardDescription>
              {recommendations.totalGenerated} compositions générées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.recentTracks.slice(0, 5).map((track: any) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {track.image_url ? (
                      <img
                        src={track.image_url}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <Music2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium capitalize">{track.emotion}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(track.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {track.audio_url && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => play({
                        id: track.id,
                        title: `Musique ${track.emotion}`,
                        artist: 'EmotionsCare AI',
                        url: track.audio_url,
                        audioUrl: track.audio_url,
                        duration: track.duration || 180,
                        emotion: track.emotion,
                        isGenerated: true,
                      })}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </LazyMotionWrapper>
  );
};
