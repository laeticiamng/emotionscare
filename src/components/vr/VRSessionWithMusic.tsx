import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VRSessionProgress from './VRSessionProgress';
import VRSessionControls from './VRSessionControls';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { VRSessionTemplate, MusicTrack, VRSessionWithMusicProps } from '@/types';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  session,
  musicTracks = [],
  onSessionComplete,
  isAudioOnly = false,
  videoUrl,
  audioUrl,
  emotion
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(musicTracks[0] || null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [percentComplete, setPercentComplete] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (musicTracks.length > 0) {
      setCurrentTrack(musicTracks[0]);
    }
  }, [musicTracks]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && !isPaused && session) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;
          const newPercentComplete = Math.min((newTimer / session.duration) * 100, 100);
          setPercentComplete(newPercentComplete);
          return newTimer;
        });
      }, 60000); // Update every 60 seconds (1 minute)
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, isPaused, session]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const completeSession = () => {
    setIsPlaying(false);
    setIsPaused(false);
    onSessionComplete();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{session?.title || 'Session VR'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VRSessionProgress percentComplete={percentComplete} />
          {currentTrack && isMusicPlaying && (
            <VRMusicTrackInfo currentTrack={currentTrack} />
          )}
          <VRSessionControls
            isPaused={isPaused}
            isAudioOnly={isAudioOnly}
            isMusicPlaying={isMusicPlaying}
            onTogglePause={togglePause}
            onToggleMusic={toggleMusic}
            onComplete={completeSession}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionWithMusic;
