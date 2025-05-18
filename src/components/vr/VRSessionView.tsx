
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Pause, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';

interface VRSessionViewProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionView: React.FC<VRSessionViewProps> = ({ template, onCompleteSession }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const totalDurationSeconds = template.duration * 60;
  const percentageComplete = Math.min((elapsed / totalDurationSeconds) * 100, 100);

  // Auto-complete session when time is up
  useEffect(() => {
    if (elapsed >= totalDurationSeconds) {
      onCompleteSession();
    }
  }, [elapsed, totalDurationSeconds, onCompleteSession]);

  // Timer logic
  useEffect(() => {
    let timer: number | undefined;
    if (!isPaused && elapsed < totalDurationSeconds) {
      timer = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, elapsed, totalDurationSeconds]);

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const remainingSeconds = Math.max(totalDurationSeconds - elapsed, 0);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsAudioPlaying(!isPaused);
  };

  // Get the session title, handling missing theme property
  const getSessionTitle = () => {
    return template.theme || template.title || template.name || "Session VR";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">{getSessionTitle()}</h2>
          
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-muted">
              {template.is_audio_only ? (
                <div className="bg-gradient-to-br from-purple-900 to-indigo-600 p-10 rounded-lg flex flex-col items-center justify-center space-y-6">
                  <div className="h-32 w-32 rounded-full bg-indigo-700/50 flex items-center justify-center">
                    {isPaused ? (
                      <Play className="h-16 w-16 text-white" />
                    ) : (
                      <Pause className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <div className="text-white text-xl font-medium">Méditation guidée</div>
                  {template.audio_url && (
                    <audio
                      src={template.audio_url}
                      autoPlay={!isPaused}
                      loop={false}
                      onEnded={onCompleteSession}
                      className="hidden"
                    />
                  )}
                </div>
              ) : (
                <AspectRatio ratio={16/9} className="max-w-4xl mx-auto">
                  <YoutubeEmbed 
                    videoUrl={template.preview_url}
                    autoplay={true}
                    controls={true}
                    showInfo={false}
                    loop={true}
                  />
                </AspectRatio>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>Temps restant</span>
                </div>
                <span className="font-mono">{formatTimeRemaining()}</span>
              </div>
              <Progress value={percentageComplete} className="h-2" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {template.is_audio_only && (
                <Button 
                  onClick={togglePlayPause}
                  variant="outline"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={onCompleteSession}
                variant={template.is_audio_only ? "outline" : "default"}
              >
                Terminer la session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionView;
