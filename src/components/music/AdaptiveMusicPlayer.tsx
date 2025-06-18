
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAdaptiveMusic } from '@/hooks/useAdaptiveMusic';
import PlayerControls from './player/PlayerControls';
import TrackInfo from './player/TrackInfo';
import ProgressBar from './player/ProgressBar';
import VolumeControl from './player/VolumeControl';
import { Music, Settings } from 'lucide-react';

interface AdaptiveMusicPlayerProps {
  emotion?: string;
  autoStart?: boolean;
  className?: string;
}

const AdaptiveMusicPlayer: React.FC<AdaptiveMusicPlayerProps> = ({
  emotion = 'calm',
  autoStart = false,
  className = ""
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentEmotion,
    isTransitioning,
    config,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    adaptToEmotion,
    updateConfig,
    isAdaptiveEnabled,
    setAdaptiveEnabled,
    getRecommendation
  } = useAdaptiveMusic({ emotion, autoStart });

  const handlePrevious = () => {
    // Logique pour track précédent si nécessaire
    console.log('Previous track');
  };

  const handleNext = () => {
    // Logique pour track suivant si nécessaire
    console.log('Next track');
  };

  const handleEmotionChange = (newEmotion: string) => {
    adaptToEmotion(newEmotion);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musique adaptative
          {isTransitioning && (
            <span className="text-xs text-muted-foreground">(transition...)</span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contrôle d'activation */}
        <div className="flex items-center justify-between">
          <Label htmlFor="adaptive-music">Musique adaptative</Label>
          <Switch
            id="adaptive-music"
            checked={isAdaptiveEnabled}
            onCheckedChange={setAdaptiveEnabled}
          />
        </div>

        {isAdaptiveEnabled && (
          <>
            {/* Information sur le track actuel */}
            <TrackInfo track={currentTrack} showEmotion />
            
            {/* Barre de progression */}
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
            
            {/* Contrôles de lecture */}
            <div className="flex items-center justify-between">
              <PlayerControls
                isPlaying={isPlaying}
                onPlay={play}
                onPause={pause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                size="sm"
              />
              
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={setVolume}
                onMuteToggle={toggleMute}
              />
            </div>

            {/* Sélection rapide d'émotion */}
            <div className="space-y-2">
              <Label className="text-sm">Adaptation émotionnelle</Label>
              <div className="flex gap-2 flex-wrap">
                {['calm', 'happy', 'anxious', 'energetic'].map((emotionOption) => (
                  <Button
                    key={emotionOption}
                    variant={currentEmotion === emotionOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEmotionChange(emotionOption)}
                    className="text-xs"
                  >
                    {emotionOption === 'calm' && '😌'}
                    {emotionOption === 'happy' && '😊'}
                    {emotionOption === 'anxious' && '😰'}
                    {emotionOption === 'energetic' && '⚡'}
                    <span className="ml-1 capitalize">{emotionOption}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Informations sur l'adaptation */}
            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <p>Émotion détectée: <span className="capitalize font-medium">{currentEmotion}</span></p>
              {currentTrack && (
                <p>Musique adaptée pour favoriser un état {currentTrack.emotion}</p>
              )}
            </div>
          </>
        )}

        {!isAdaptiveEnabled && (
          <div className="text-center py-4 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Activez la musique adaptative pour une expérience personnalisée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveMusicPlayer;
