
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicTrack, EmotionMusicParams } from '@/types/music';
import { motion } from 'framer-motion';

interface VRMusicIntegrationProps {
  sessionId: string;
  emotionTarget: string;
  onMusicReady?: () => void;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  sessionId,
  emotionTarget,
  onMusicReady
}) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const music = useMusic();
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  // Automatically load music when component mounts
  useEffect(() => {
    const loadRecommendation = async () => {
      setIsLoading(true);
      
      try {
        const params: EmotionMusicParams = {
          emotion: emotionTarget,
          intensity: 0.7
        };
        
        const result = await activateMusicForEmotion(params);
        
        if (result) {
          if (onMusicReady) {
            onMusicReady();
          }
          
          if (music.currentTrack) {
            setCurrentTrack(music.currentTrack);
          }
        }
      } catch (error) {
        console.error('Failed to load recommended music:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendation();
  }, [emotionTarget, activateMusicForEmotion, music.currentTrack, onMusicReady]);
  
  const handleTogglePlay = () => {
    if (music.isPlaying) {
      music.pauseTrack ? music.pauseTrack() : (music.pause && music.pause());
    } else {
      music.resumeTrack ? music.resumeTrack() : (music.resume && music.resume());
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="h-5 w-5 mr-2 text-primary" />
            Musique immersive
          </CardTitle>
          <CardDescription>
            Musique adaptée à cette session immersive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-sm font-medium">Thème émotionnel</p>
              <p className="text-sm text-muted-foreground">{emotionTarget.charAt(0).toUpperCase() + emotionTarget.slice(1)}</p>
            </div>
            
            {currentTrack && (
              <div className="bg-primary/10 p-3 rounded-md">
                <p className="text-sm font-medium">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
              </div>
            )}
            
            <Button 
              onClick={handleTogglePlay} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Music className="animate-pulse mr-2 h-4 w-4" />
                  Chargement...
                </span>
              ) : music.isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Jouer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VRMusicIntegration;
