import React, { useState, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusicCompat';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, 
  Repeat, Music, Waveform, Heart, Download, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '@/utils/musicCompatibility';
import { toast } from 'sonner';

const emotions = [
  'calm', 'energetic', 'happy', 'sad', 'focused', 'creative', 'stressed', 'tired'
];

const musicStyles = [
  'ambient', 'classical', 'electronic', 'acoustic', 'meditation', 'nature'
];

export const MusicModule: React.FC = () => {
  const { state, play, pause, next, previous, setVolume } = useMusic();
  const { 
    activateMusicForEmotion, 
    getMusicRecommendations,
    isGenerating, 
    generationProgress,
    therapeuticMode 
  } = useMusicEmotionIntegration();

  const [selectedEmotion, setSelectedEmotion] = useState<string>('calm');
  const [selectedStyle, setSelectedStyle] = useState<string>('ambient');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Charger les recommandations
  useEffect(() => {
    if (selectedEmotion) {
      getMusicRecommendations(selectedEmotion).then(setRecommendations);
    }
  }, [selectedEmotion, getMusicRecommendations]);

  const handleGenerateMusic = async () => {
    try {
      const playlist = await activateMusicForEmotion({
        emotion: selectedEmotion,
        style: selectedStyle,
        intensity: 0.7,
        instrumental: true
      });
      
      if (playlist) {
        toast.success(`Playlist "${selectedEmotion}" activée avec succès!`);
      }
    } catch (error) {
      toast.error('Erreur lors de la génération de musique');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Music className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Module Musical Thérapeutique</h1>
          <p className="text-muted-foreground">
            Génération et recommandation de musique adaptée à vos émotions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lecteur principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lecteur Musical</span>
                {therapeuticMode && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Waveform className="h-3 w-3" />
                    Mode thérapeutique
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.currentTrack ? (
                <div className="space-y-4">
                  {/* Info du track */}
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Music className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{state.currentTrack.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{state.currentTrack.artist}</p>
                      {state.currentTrack.emotion && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {state.currentTrack.emotion}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <Progress 
                      value={(state.currentTime / state.duration) * 100} 
                      className="h-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatDuration(state.currentTime)}</span>
                      <span>{formatDuration(state.duration)}</span>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* shuffle */}}
                      className={state.shuffleMode ? 'text-primary' : ''}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={previous}>
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => state.isPlaying ? pause() : play()}
                      className="w-12 h-12 rounded-full"
                    >
                      {state.isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={next}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={state.repeatMode !== 'none' ? 'text-primary' : ''}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[state.volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-10">
                      {Math.round(state.volume * 100)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune musique en cours</p>
                  <p className="text-sm">Sélectionnez une émotion pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Génération en cours */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Waveform className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <h3 className="font-semibold">Génération en cours...</h3>
                      <p className="text-sm text-muted-foreground">
                        Création d'une musique thérapeutique personnalisée
                      </p>
                      <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(generationProgress)}% complété
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playlist */}
          {state.playlist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Playlist Actuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.playlist.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        state.currentPlaylistIndex === index 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => play(track)}
                    >
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(track.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panneau de contrôle */}
        <div className="space-y-4">
          {/* Génération personnalisée */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Génération Musicale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Émotion cible</label>
                <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emotions.map(emotion => (
                      <SelectItem key={emotion} value={emotion}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style musical</label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {musicStyles.map(style => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateMusic} 
                disabled={isGenerating}
                className="w-full"
              >
                <Waveform className="h-4 w-4 mr-2" />
                {isGenerating ? 'Génération...' : 'Générer la musique'}
              </Button>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-2">
                  {recommendations.slice(0, 5).map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50"
                      onClick={() => play(track)}
                    >
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune recommandation disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tracks en playlist:</span>
                <span className="font-medium">{state.playlist.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Durée totale:</span>
                <span className="font-medium">
                  {formatDuration(state.playlist.reduce((total, track) => total + track.duration, 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mode:</span>
                <Badge variant={therapeuticMode ? "default" : "secondary"} className="text-xs">
                  {therapeuticMode ? 'Thérapeutique' : 'Standard'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};