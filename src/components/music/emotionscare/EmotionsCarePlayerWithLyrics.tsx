
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LyricLine {
  time: number;
  text: string;
}

interface EmotionsCareSong {
  id: string;
  title: string;
  suno_audio_id: string;
  meta: any;
  lyrics: any;
}

interface EmotionsCarePlayerWithLyricsProps {
  song: EmotionsCareSong;
  onClose?: () => void;
}

const EmotionsCarePlayerWithLyrics: React.FC<EmotionsCarePlayerWithLyricsProps> = ({ 
  song, 
  onClose 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch lyrics on mount
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        // D'abord essayer de récupérer les paroles depuis la DB
        const { data: songData } = await supabase
          .from('emotionscare_songs')
          .select('lyrics')
          .eq('id', song.id)
          .single();

        if (songData?.lyrics && Array.isArray(songData.lyrics)) {
          setLyrics(songData.lyrics);
        } else {
          // Si pas de paroles en DB, on pourrait appeler l'API Suno
          // Pour l'instant, on utilise des paroles par défaut
          setLyrics([
            { time: 0, text: "🎵 Paroles en cours de synchronisation..." },
            { time: 10, text: "EmotionsCare Music - Votre bien-être en musique" },
            { time: 20, text: "Profitez de cette mélodie relaxante" }
          ]);
        }
      } catch (error) {
        console.error('Erreur fetch lyrics:', error);
        setLyrics([
          { time: 0, text: "🎵 Musique EmotionsCare" },
          { time: 5, text: "Détendez-vous et profitez" }
        ]);
      }
    };

    fetchLyrics();
  }, [song.id]);

  // Update current line based on audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentLine = () => {
      const currentTime = audio.currentTime;
      setCurrentTime(currentTime);
      
      const lineIndex = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      });
      
      if (lineIndex !== -1 && lineIndex !== currentLine) {
        setCurrentLine(lineIndex);
      }
    };

    const updateDuration = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const updatePlayState = () => {
      setIsPlaying(!audio.paused);
    };

    audio.addEventListener('timeupdate', updateCurrentLine);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', updatePlayState);
    audio.addEventListener('pause', updatePlayState);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentLine);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', updatePlayState);
      audio.removeEventListener('pause', updatePlayState);
    };
  }, [lyrics, currentLine]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const seekTo = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, Math.min(seconds, duration));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Construire l'URL de streaming sécurisée
  const streamUrl = `/api/emotionscare/songs/${song.id}/stream`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold text-primary">
            🎵 {song.title}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Lecteur Audio */}
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={streamUrl}
              preload="metadata"
              className="hidden"
            />

            {/* Contrôles personnalisés */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => seekTo(currentTime - 10)}
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button 
                variant="default" 
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {isPlaying ? (
                  <Pause className="w-6 w-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => seekTo(currentTime + 10)}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Barre de progression */}
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Paroles avec Karaoké */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 h-48 overflow-y-auto">
            <div className="text-center space-y-2">
              {lyrics.map((line, i) => (
                <p
                  key={i}
                  className={`transition-all duration-300 text-lg leading-relaxed cursor-pointer ${
                    i === currentLine
                      ? 'text-primary font-semibold scale-105 animate-pulse'
                      : 'text-white/70 hover:text-white/90'
                  }`}
                  onClick={() => seekTo(line.time)}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>

          {/* Info EmotionsCare */}
          <div className="text-center text-sm text-muted-foreground">
            <p>🎵 EmotionsCare Music - Thérapie par la musique</p>
            <p>Streaming sécurisé • Aucun téléchargement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionsCarePlayerWithLyrics;
