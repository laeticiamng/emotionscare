import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export const useMicPermission = () => {
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      setStream(mediaStream);
      setPermission('granted');
      return true;
    } catch (error) {
      logger.error('Microphone permission denied', error as Error, 'SYSTEM');
      setPermission('denied');
      return false;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    // Check existing permission on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermission(result.state as PermissionState);
          result.addEventListener('change', () => {
            setPermission(result.state as PermissionState);
          });
        })
        .catch(() => {
          setPermission('prompt');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    permission,
    hasPermission: permission === 'granted',
    requestPermission,
    stopStream,
    stream,
  };
};
