// @ts-nocheck
import { useCallback, useEffect, useRef } from 'react';
import { useARStore, type VisionReading } from '@/store/ar.store';
import { supabase } from '@/integrations/supabase/client';
import { useCamera } from './useCamera';
import { usePrivacyPrefs } from './usePrivacyPrefs';
import { logger } from '@/lib/logger';

const FRAME_THROTTLE_MS = 15000; // Toutes les 15 secondes

export const useHumeVision = () => {
  const store = useARStore();
  const { prefs } = usePrivacyPrefs();
  const { captureFrame } = useCamera();
  const lastFrameTimeRef = useRef<number>(0);

  // Stop session and cleanup
  const stopSession = useCallback(() => {
    store.reset();
    logger.info('Hume Vision session stopped', undefined, 'SYSTEM');
  }, [store]);

  // Get emotion comment from backend
  const getEmotionComment = useCallback(async (emotion: string, context?: 'work' | 'study' | 'chill') => {
    try {
      const { data, error } = await supabase.functions.invoke('face-filter-comment', {
        body: { emotion, context }
      });

      if (error || !data) {
        logger.error('Error getting emotion comment', { error }, 'SYSTEM');
        return;
      }

      store.setComment(data.text);
      
      // Clear comment after 3 seconds
      setTimeout(() => {
        store.setComment(null);
      }, 3000);

    } catch (error) {
      logger.error('Error fetching emotion comment', error as Error, 'SYSTEM');
    }
  }, [store]);

  // Send metrics (fire-and-forget)
  const sendMetrics = useCallback(async (emotion: string, confidence?: number, source: 'camera' | 'fallback' = 'camera') => {
    try {
      // Fire-and-forget metrics
      supabase.functions.invoke('metrics/face_filter', {
        body: {
          emotion,
          confidence,
          source,
          ts: Date.now()
        }
      }).catch(error => {
        logger.warn('Failed to send metrics', { error }, 'ANALYTICS');
      });
    } catch (error) {
      logger.warn('Error sending metrics', { error }, 'ANALYTICS');
    }
  }, []);

  // Start vision session
  const startSession = useCallback(async (deviceId?: string) => {
    // Check privacy preferences
    if (!prefs.camera) {
      logger.info('Camera disabled by privacy preferences', undefined, 'SYSTEM');
      store.setSource('fallback');
      return null;
    }
    
    try {
      store.setError(null);
      
      const { data, error } = await supabase.functions.invoke('face-filter-start', {
        body: { deviceId }
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to start face filter session');
      }

      const { session_id } = data;
      store.setSessionData(session_id, '');
      store.setSource('camera');
      
      logger.info('Hume Vision session started', { session_id }, 'SYSTEM');
      return { session_id };

    } catch (error: any) {
      logger.error('Error starting Hume Vision session', error as Error, 'SYSTEM');
      store.setError(error.message);
      return null;
    }
  }, [store, prefs.camera]);

  // Send frame for analysis (throttled to 1 FPS)
  const sendFrame = useCallback(async () => {
    const now = Date.now();
    
    if (now - lastFrameTimeRef.current < FRAME_THROTTLE_MS || !store.sessionId) {
      return;
    }

    const frameData = captureFrame();
    if (!frameData) return;

    try {
      // Send frame to Hume proxy with throttling
      const { data, error } = await supabase.functions.invoke('hume-ws-proxy', {
        body: { 
          session_id: store.sessionId,
          frame: frameData,
          ts: now
        }
      });

      if (!error && data) {
        const reading: VisionReading = {
          emotion: data.emotion,
          confidence: data.confidence,
          ts: now
        };
        
        store.setCurrentEmotion(reading);
        lastFrameTimeRef.current = now;
        
        // Get comment for this emotion
        getEmotionComment(data.emotion);
        
        // Send metrics (fire-and-forget)
        sendMetrics(data.emotion, data.confidence, 'camera');
      }
      
    } catch (error) {
      logger.error('Error sending frame', error as Error, 'SYSTEM');
    }
  }, [store.sessionId, captureFrame, getEmotionComment, sendMetrics]);

  // Auto-send frames when active
  useEffect(() => {
    if (!store.active || !store.hasCamera) return;

    const interval = setInterval(() => {
      sendFrame();
    }, FRAME_THROTTLE_MS); // Send at 1 FPS

    return () => {
      clearInterval(interval);
    };
  }, [store.active, store.hasCamera, sendFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return {
    // State
    active: store.active,
    hasCamera: store.hasCamera,
    currentEmotion: store.currentEmotion,
    comment: store.comment,
    error: store.error,
    
    // Actions
    startSession,
    stopSession,
    sendFrame,
    sendMetrics,
    getEmotionComment,
    
    // Setters
    setActive: store.setActive,
    setSource: store.setSource,
  };
};