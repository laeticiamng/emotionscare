/**
 * SunoGenerationNotifier - Composant de notification pour génération Suno
 * Affiche un toast persistant pendant la génération avec callback Realtime
 */

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSunoCallback } from '@/hooks/useSunoCallback';
import { Music, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface SunoGenerationNotifierProps {
  taskId: string | null;
  trackTitle?: string;
  onComplete?: (audioUrl: string) => void;
  onError?: (error: string) => void;
}

const SunoGenerationNotifier: React.FC<SunoGenerationNotifierProps> = ({
  taskId,
  trackTitle = 'Musique',
  onComplete,
  onError,
}) => {
  const [toastId, setToastId] = useState<string | number | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'complete' | 'error'>('idle');

 const { isWaiting, elapsedTime, signedUrl } = useSunoCallback({
    taskId,
    onComplete: (callback) => {
      setStatus('complete');
      // Use type assertion to handle potential snake_case from API
      const data = callback.data as Record<string, unknown> | undefined;
      const audioUrl = data?.audioUrl || data?.['audio_url'] || signedUrl;
      if (audioUrl) {
        onComplete?.(String(audioUrl));
      }
    },
    onError: (error) => {
      setStatus('error');
      onError?.(error);
    },
  });

  // Show/update toast based on generation status
  useEffect(() => {
    if (!taskId) {
      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }
      setStatus('idle');
      return;
    }

    if (isWaiting && status !== 'complete' && status !== 'error') {
      setStatus('generating');
      
      // Create or update toast
      const id = toast.loading(
        <div className="flex items-center gap-3">
          <div className="relative">
            <Music className="h-5 w-5 text-primary" />
            <div className="absolute -bottom-1 -right-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Génération en cours...</p>
            <p className="text-xs text-muted-foreground">
              "{trackTitle}" • {formatTime(elapsedTime)}
            </p>
          </div>
        </div>,
        {
          id: toastId || undefined,
          duration: Infinity,
        }
      );
      
      if (!toastId) {
        setToastId(id);
      }
    }
  }, [taskId, isWaiting, elapsedTime, status, toastId, trackTitle]);

  // Handle completion
  useEffect(() => {
    if (status === 'complete' && toastId) {
      toast.success(
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium text-sm">Génération terminée !</p>
            <p className="text-xs text-muted-foreground">
              "{trackTitle}" est prête ({formatTime(elapsedTime)})
            </p>
          </div>
        </div>,
        {
          id: toastId,
          duration: 5000,
        }
      );
      setToastId(null);
    }
  }, [status, toastId, trackTitle, elapsedTime]);

  // Handle error
  useEffect(() => {
    if (status === 'error' && toastId) {
      toast.error(
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-sm">Erreur de génération</p>
            <p className="text-xs text-muted-foreground">
              "{trackTitle}" n'a pas pu être créée
            </p>
          </div>
        </div>,
        {
          id: toastId,
          duration: 5000,
        }
      );
      setToastId(null);
    }
  }, [status, toastId, trackTitle]);

  // This component doesn't render anything visible - it just manages toasts
  return null;
};

// Helper to format elapsed time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

// Hook version for easier integration
export function useSunoNotification() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('Musique');

  const startNotification = (taskId: string, title?: string) => {
    setActiveTaskId(taskId);
    if (title) setActiveTitle(title);
  };

  const stopNotification = () => {
    setActiveTaskId(null);
  };

  const NotificationComponent = () => (
    <SunoGenerationNotifier 
      taskId={activeTaskId} 
      trackTitle={activeTitle}
      onComplete={() => stopNotification()}
      onError={() => stopNotification()}
    />
  );

  return {
    startNotification,
    stopNotification,
    NotificationComponent,
    isActive: !!activeTaskId,
  };
}

export default SunoGenerationNotifier;
