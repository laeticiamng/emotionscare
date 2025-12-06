// @ts-nocheck
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export const useMicPermission = () => {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestPermission = async (): Promise<boolean> => {
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
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    // Check existing permission on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermission(result.state as any);
          result.addEventListener('change', () => {
            setPermission(result.state as any);
          });
        })
        .catch(() => {
          setPermission('prompt');
        });
    }

    return () => stopStream();
  }, []);

  return {
    permission,
    hasPermission: permission === 'granted',
    requestPermission,
    stopStream,
    stream,
  };
};