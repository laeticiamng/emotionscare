import { useCallback, useEffect, useRef, useState } from 'react';
import { useARStore, type VisionReading } from '@/store/ar.store';
import { supabase } from '@/integrations/supabase/client';
import { useCamera } from './useCamera';

const FRAME_THROTTLE_MS = 1000; // 1 FPS

export const useHumeVision = () => {
  const store = useARStore();
  const { captureFrame } = useCamera();
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Start vision session
  const startSession = useCallback(async (deviceId?: string) => {
    try {
      store.setError(null);
      
      const { data, error } = await supabase.functions.invoke('face-filter-start', {
        body: { deviceId }
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to start face filter session');
      }

      const { session_id, ws_url } = data;
      store.setSessionData(session_id, ws_url);
      
      // Connect to WebSocket
      connectWebSocket(ws_url, session_id);
      
      console.log('Hume Vision session started:', session_id);
      return { session_id, ws_url };

    } catch (error: any) {
      console.error('Error starting Hume Vision session:', error);
      store.setError(error.message);
      return null;
    }
  }, [store]);

  // Connect to WebSocket for real-time emotion detection
  const connectWebSocket = useCallback((wsUrl: string, sessionId: string) => {
    try {
      // Use full WebSocket URL for the edge function
      const fullWsUrl = wsUrl.startsWith('ws') ? wsUrl : 
        `wss://yaincoxihiqdksxgrsrk.functions.supabase.co/functions/v1/hume-vision-ws`;
      
      const ws = new WebSocket(fullWsUrl);
      
      ws.onopen = () => {
        console.log('Hume Vision WebSocket connected');
        store.setConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Send session ID
        ws.send(JSON.stringify({ 
          type: 'session',
          session_id: sessionId 
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Hume Vision response:', data);
          
          if (data.emotion && data.confidence !== undefined) {
            const reading: VisionReading = {
              emotion: data.emotion,
              confidence: data.confidence,
              ts: Date.now()
            };
            
            store.setCurrentEmotion(reading);
            
            // Get comment for this emotion
            getEmotionComment(data.emotion);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Hume Vision WebSocket error:', error);
        store.setError('Connection error');
      };

      ws.onclose = (event) => {
        console.log('Hume Vision WebSocket closed:', event.code);
        store.setConnected(false);
        setWsConnection(null);
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 8000);
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket(wsUrl, sessionId);
          }, delay);
        } else {
          store.setError('Connection lost - please refresh');
        }
      };

      setWsConnection(ws);
      
    } catch (error: any) {
      console.error('Error connecting WebSocket:', error);
      store.setError('Failed to connect');
    }
  }, [store]);

  // Send frame for analysis (throttled to 1 FPS)
  const sendFrame = useCallback(() => {
    const now = Date.now();
    
    if (now - lastFrameTimeRef.current < FRAME_THROTTLE_MS || !wsConnection || !store.isConnected) {
      return;
    }

    const frameData = captureFrame();
    if (!frameData || !store.sessionId) return;

    try {
      // Extract base64 data without the data URL prefix
      const base64Data = frameData.split(',')[1];
      
      const message = {
        type: 'frame',
        session_id: store.sessionId,
        frame: base64Data,
        ts: now
      };

      wsConnection.send(JSON.stringify(message));
      lastFrameTimeRef.current = now;
      
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  }, [wsConnection, store.isConnected, store.sessionId, captureFrame]);

  // Get emotion comment from backend
  const getEmotionComment = useCallback(async (emotion: string, context?: 'work' | 'study' | 'chill') => {
    try {
      const { data, error } = await supabase.functions.invoke('face-filter-comment', {
        body: { emotion, context }
      });

      if (error || !data) {
        console.error('Error getting emotion comment:', error);
        return;
      }

      store.setComment(data.text);
      
      // Clear comment after 3 seconds
      setTimeout(() => {
        store.setComment(null);
      }, 3000);

    } catch (error) {
      console.error('Error fetching emotion comment:', error);
    }
  }, [store]);

  // Send metrics (fire-and-forget)
  const sendMetrics = useCallback(async (emotion: string, confidence?: number, source: 'camera' | 'fallback' = 'camera') => {
    try {
      // Fire-and-forget metrics
      supabase.functions.invoke('metrics-face-filter', {
        body: {
          emotion,
          confidence,
          source,
          ts: Date.now()
        }
      }).catch(error => {
        console.warn('Failed to send metrics:', error);
      });
    } catch (error) {
      console.warn('Error sending metrics:', error);
    }
  }, []);

  // Stop session and cleanup
  const stopSession = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
    
    store.reset();
    console.log('Hume Vision session stopped');
  }, [wsConnection, store]);

  // Auto-send frames when active
  useEffect(() => {
    if (!store.active || !store.hasCamera) return;

    const interval = setInterval(() => {
      sendFrame();
    }, 100); // Check every 100ms, but throttled internally to 1 FPS

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
    isConnected: store.isConnected,
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