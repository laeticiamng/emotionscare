
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import YoutubeEmbed from './YoutubeEmbed';
import VRSessionControls from './VRSessionControls';
import VRSessionProgress from './VRSessionProgress';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { VRSessionTemplate } from '@/types';
import { MusicTrack } from '@/types';
import { useVRSessionTimer } from '@/hooks/useVRSessionTimer';
import { useToast } from '@/hooks/use-toast';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({ template, onCompleteSession }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const { 
    timeRemaining, 
    progress, 
    startTimer, 
    pauseTimer, 
    resumeTimer 
  } = useVRSessionTimer({
    totalDurationSeconds: template.duration * 60,
    isPaused: isPaused,
    onComplete: handleSessionComplete,
  });

  useEffect(() => {
    // Set a sample music track
    const sampleTrack: MusicTrack = {
      id: '1',
      title: 'Méditation calme',
      artist: 'Ambiance naturelle',
      duration: template.duration * 60,
      coverUrl: '',
      audioUrl: template.audio_url || 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3',
    };
    setCurrentTrack(sampleTrack);

    // Start the timer
    startTimer();

    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [startTimer, template]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle mute toggle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle music toggle
  useEffect(() => {
    if (isMusicPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        if (currentTrack?.audioUrl) {
          audioRef.current.src = currentTrack.audioUrl;
          audioRef.current.volume = volume / 100;
          audioRef.current.loop = true;
        }
      }
      
      const playPromise = audioRef.current?.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: 'Erreur audio',
            description: 'Impossible de lire la musique de fond',
          });
        });
      }
    } else {
      audioRef.current?.pause();
    }
  }, [isMusicPlaying, currentTrack, volume, toast]);

  function handleSessionComplete() {
    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // Notify parent component
    onCompleteSession();
    
    // Show toast
    toast({
      title: 'Session terminée',
      description: `Votre session de ${template.duration} minutes est terminée`,
    });
  }

  function handleTogglePause() {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
    setIsPaused(!isPaused);
  }

  function handleToggleMusic() {
    setIsMusicPlaying(!isMusicPlaying);
    
    toast({
      title: isMusicPlaying ? 'Musique désactivée' : 'Musique activée',
      description: isMusicPlaying 
        ? 'La musique de fond a été désactivée' 
        : 'Musique de fond ajoutée à votre session',
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Session VR{template.is_audio_only ? " Audio" : ""}</span>
            <span className="text-primary">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {template.is_audio_only ? (
            <div className="bg-gradient-to-br from-purple-900 to-indigo-600 p-10 rounded-lg flex flex-col items-center justify-center h-80 text-white">
              <div className="text-xl font-medium mb-4">Méditation guidée</div>
              <p className="text-center text-white/80 max-w-md">
                Fermez les yeux et laissez-vous guider par cette séance de méditation.
                Concentrez-vous sur votre respiration et libérez votre esprit.
              </p>
            </div>
          ) : (
            <div className="aspect-video rounded-md overflow-hidden">
              <YoutubeEmbed 
                videoUrl={template.preview_url} 
                autoplay={true} 
                controls={false}
                showInfo={false}
                loop={true}
                mute={true}
              />
            </div>
          )}

          <VRSessionProgress percentComplete={progress} />
          
          {currentTrack && isMusicPlaying && (
            <div className="space-y-2">
              <VRMusicTrackInfo currentTrack={currentTrack} />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0])}
                  aria-label="Volume"
                  className="flex-1"
                />
              </div>
            </div>
          )}

          <VRSessionControls
            isPaused={isPaused}
            isAudioOnly={!!template.is_audio_only}
            isMusicPlaying={isMusicPlaying}
            onTogglePause={handleTogglePause}
            onToggleMusic={handleToggleMusic}
            onComplete={onCompleteSession}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionWithMusic;
