
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Clock } from "lucide-react";
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionTemplate, MusicTrack } from '@/types';
import ProgressBar from '@/components/music/player/ProgressBar';
import { formatTime } from '@/lib/utils';

interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onSessionComplete?: () => void;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  session,
  onSessionComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionTracks, setSessionTracks] = useState<MusicTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const { loadPlaylistForEmotion, playTrack, pauseTrack } = useMusic();
  
  // Load music that matches the session's emotional target
  useEffect(() => {
    const loadSessionMusic = async () => {
      if (session.emotion_target) {
        try {
          const playlist = await loadPlaylistForEmotion(session.emotion_target);
          
          if (playlist && playlist.tracks && playlist.tracks.length > 0) {
            setSessionTracks(playlist.tracks);
          }
        } catch (error) {
          console.error('Error loading music for session:', error);
        }
      }
    };
    
    loadSessionMusic();
  }, [session.emotion_target, loadPlaylistForEmotion]);
  
  // Handle playing and pausing the current track
  const togglePlayPause = () => {
    if (sessionTracks.length === 0) return;
    
    if (isPlaying) {
      pauseTrack();
      setIsPlaying(false);
    } else {
      const currentTrack = sessionTracks[currentTrackIndex];
      playTrack(currentTrack);
      setIsPlaying(true);
    }
  };
  
  // Skip to the next track
  const nextTrack = () => {
    if (sessionTracks.length === 0) return;
    
    const nextIndex = (currentTrackIndex + 1) % sessionTracks.length;
    setCurrentTrackIndex(nextIndex);
    playTrack(sessionTracks[nextIndex]);
    setIsPlaying(true);
  };
  
  // Go to the previous track
  const previousTrack = () => {
    if (sessionTracks.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 ? sessionTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    playTrack(sessionTracks[prevIndex]);
    setIsPlaying(true);
  };
  
  // Update the progress bar as the session progresses
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Check if session is complete
          if (newTime >= session.duration) {
            clearInterval(interval);
            setIsPlaying(false);
            onSessionComplete?.();
            return session.duration;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, session.duration, onSessionComplete]);
  
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Session Audio</h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" /> {formatTime(session.duration)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousTrack} disabled={sessionTracks.length === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button onClick={togglePlayPause} variant={isPlaying ? "secondary" : "default"} disabled={sessionTracks.length === 0}>
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button variant="outline" size="icon" onClick={nextTrack} disabled={sessionTracks.length === 0}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ProgressBar
          currentTime={currentTime}
          duration={session.duration}
          onSeek={(time) => setCurrentTime(time)}
        />
        
        {sessionTracks.length > 0 && (
          <div className="bg-muted/20 p-3 rounded-md">
            <p className="text-sm font-medium">
              Now Playing: {sessionTracks[currentTrackIndex]?.title || 'Unknown Track'}
            </p>
            <p className="text-xs text-muted-foreground">
              By {sessionTracks[currentTrackIndex]?.artist || 'Unknown Artist'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionWithMusic;
