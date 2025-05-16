
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/music';
import { VRSessionWithMusicProps, VRSession } from '@/types/vr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  sessionId,
  templateId,
  onComplete,
  autoPlay = false,
  className = '',
  template,
  session,
  onSessionComplete
}) => {
  const { toast } = useToast();
  const { loadPlaylistForEmotion, isPlaying, play, pause } = useMusic();
  const [currentSession, setCurrentSession] = useState<VRSession | null>(session || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId && !session) return;

    const loadSession = async () => {
      setIsLoading(true);
      try {
        if (session) {
          setCurrentSession(session);
        } else {
          // Mocked session data for development
          const mockSession: VRSession = {
            id: sessionId,
            templateId: templateId || 'default-template',
            userId: 'user-1',
            startedAt: new Date(),
            completed: false,
            duration: 300,
          };
          setCurrentSession(mockSession);
        }

        // Load music based on session or template properties
        const emotionTarget = template?.emotionTarget || template?.emotion_target || 'calm';
        await loadPlaylistForEmotion(emotionTarget, 0.8);
        
        if (autoPlay) {
          play();
        }
      } catch (err) {
        setError('Failed to load session data or music');
        toast({
          title: 'Error',
          description: 'Failed to load session with music',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    return () => {
      if (isPlaying) {
        pause();
      }
    };
  }, [sessionId, templateId, session, template, autoPlay, loadPlaylistForEmotion, play, pause, isPlaying, toast]);

  const handleComplete = () => {
    if (currentSession) {
      const completedSession: VRSession = {
        ...currentSession,
        completed: true,
        endedAt: new Date(),
      };
      
      setCurrentSession(completedSession);
      
      if (onComplete) {
        onComplete(completedSession);
      }
      
      if (onSessionComplete) {
        onSessionComplete(completedSession);
      }
      
      toast({
        title: 'Session completed',
        description: 'Your session has been completed successfully',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>VR Session with Adaptive Music</CardTitle>
      </CardHeader>
      <CardContent>
        {currentSession && (
          <div>
            <p>Session ID: {currentSession.id}</p>
            <p>Duration: {currentSession.duration} seconds</p>
            <p>Status: {currentSession.completed ? 'Completed' : 'In Progress'}</p>
            
            {!currentSession.completed && (
              <button 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
                onClick={handleComplete}
              >
                Complete Session
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionWithMusic;
