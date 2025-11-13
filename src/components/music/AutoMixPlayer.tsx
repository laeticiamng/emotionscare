// @ts-nocheck
/**
 * AutoMixPlayer - Lecteur intelligent avec contexte temps réel
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Sunrise,
  Sunset,
  Moon,
  Zap,
  Loader2,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useAutoMix } from '@/hooks/useAutoMix';

const TimeIcons = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon
};

const WeatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  snowy: CloudSnow,
  stormy: Zap,
  neutral: Cloud
};

export const AutoMixPlayer: React.FC = () => {
  const {
    context,
    activePlaylist,
    isGenerating,
    generateAutoMix,
    fetchContext,
    saveContextPreferences,
    submitFeedback
  } = useAutoMix();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackCount, setTrackCount] = useState(7);
  const [weatherSensitivity, setWeatherSensitivity] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (activePlaylist) {
      setFeedbackGiven(false);
    }
  }, [activePlaylist?.id]);

  const handleGenerate = async () => {
    await generateAutoMix(trackCount);
    setFeedbackGiven(false);
  };

  const TimeIcon = context ? TimeIcons[context.timeContext as keyof typeof TimeIcons] || Sun : Sun;
  const WeatherIcon = context ? WeatherIcons[context.weatherContext as keyof typeof WeatherIcons] || Cloud : Cloud;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Contexte en temps réel */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Contexte Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {context ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                <TimeIcon className="h-8 w-8 text-orange-500" />
                <span className="text-sm font-medium capitalize">{context.timeContext}</span>
                <span className="text-xs text-muted-foreground">{context.hour}h</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                <WeatherIcon className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-medium capitalize">{context.weatherContext}</span>
                <span className="text-xs text-muted-foreground">{context.temperature}°C</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                <span className="text-2xl">😌</span>
                <span className="text-sm font-medium capitalize">{context.recommendedMood}</span>
                <span className="text-xs text-muted-foreground">Humeur suggérée</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                <span className="text-2xl">🎵</span>
                <span className="text-sm font-medium">{context.recommendedTempo} BPM</span>
                <span className="text-xs text-muted-foreground">Tempo optimal</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Analyse du contexte...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration AutoMix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Nombre de tracks: {trackCount}</Label>
            <Slider
              value={[trackCount]}
              onValueChange={(v) => setTrackCount(v[0])}
              min={5}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="weather-sensitivity">Sensibilité météo</Label>
            <Switch
              id="weather-sensitivity"
              checked={weatherSensitivity}
              onCheckedChange={(checked) => {
                setWeatherSensitivity(checked);
                saveContextPreferences({ weather_sensitivity: checked });
              }}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Shuffle className="h-5 w-5 mr-2" />
                Générer AutoMix Intelligent
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Player */}
      {activePlaylist && (
        <Card>
          <CardHeader>
            <CardTitle>{activePlaylist.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {activePlaylist.generated_tracks?.length || 0} tracks
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button size="icon" variant="outline">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button size="icon" variant="outline">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Track {currentIndex + 1}/{activePlaylist.generated_tracks?.length || 0}</span>
                <Badge variant="secondary">Crossfade 3s</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / (activePlaylist.generated_tracks?.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {activePlaylist && !feedbackGiven && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="bg-card/95 backdrop-blur-lg border-primary/20 shadow-xl">
            <CardContent className="p-4">
              <p className="text-sm mb-3 font-medium">Comment trouvez-vous cette playlist ?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    await submitFeedback(activePlaylist.id, 1);
                    setFeedbackGiven(true);
                  }}
                >
                  <ThumbsUp className="h-4 w-4" />
                  J'adore
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    await submitFeedback(activePlaylist.id, -1);
                    setFeedbackGiven(true);
                  }}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Pas mon style
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
