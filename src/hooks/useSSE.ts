// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseSSEOptions {
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  autoReconnect?: boolean;
  maxRetries?: number;
  retryInterval?: number;
}

interface UseSSEReturn {
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  close: () => void;
}

export const useSSE = (url: string | null, options: UseSSEOptions = {}): UseSSEReturn => {
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    autoReconnect = true,
    maxRetries = 5,
    retryInterval = 1000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (!url || eventSourceRef.current) return;

    try {
      logger.debug('SSE: Connecting to', { url }, 'SYSTEM');
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        logger.debug('SSE: Connected', {}, 'SYSTEM');
        setIsConnected(true);
        setError(null);
        retryCountRef.current = 0;
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        logger.debug('SSE: Message received', { data: event.data }, 'SYSTEM');
        onMessage?.(event);
      };

      eventSource.onerror = (event) => {
        logger.error('SSE: Error', event as any, 'SYSTEM');
        setIsConnected(false);
        
        if (eventSource.readyState === EventSource.CLOSED) {
          setError('Connection fermée');
          eventSourceRef.current = null;
          
          // Auto-reconnect avec backoff exponentiel
          if (autoReconnect && shouldReconnectRef.current && retryCountRef.current < maxRetries) {
            const delay = Math.min(retryInterval * Math.pow(2, retryCountRef.current), 8000);
            logger.debug('SSE: Reconnecting', { 
              delay, 
              attempt: retryCountRef.current + 1, 
              maxRetries 
            }, 'SYSTEM');
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              connect();
            }, delay);
          } else if (retryCountRef.current >= maxRetries) {
            setError('Impossible de se reconnecter après plusieurs tentatives');
          }
        }
        
        onError?.(event);
      };

      // Gérer les événements personnalisés
      eventSource.addEventListener('chapter', onMessage || (() => {}));
      eventSource.addEventListener('choices', onMessage || (() => {}));
      eventSource.addEventListener('music', onMessage || (() => {}));
      eventSource.addEventListener('prompt', onMessage || (() => {}));

    } catch (err) {
      logger.error('SSE: Failed to create EventSource', err as Error, 'SYSTEM');
      setError('Échec de la connexion');
    }
  }, [url, onMessage, onError, onOpen, autoReconnect, maxRetries, retryInterval]);

  const disconnect = useCallback(() => {
    logger.debug('SSE: Disconnecting', {}, 'SYSTEM');
    shouldReconnectRef.current = false;
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
    onClose?.();
  }, [onClose]);

  const reconnect = useCallback(() => {
    logger.debug('SSE: Manual reconnect', {}, 'SYSTEM');
    shouldReconnectRef.current = true;
    retryCountRef.current = 0;
    disconnect();
    setTimeout(connect, 500);
  }, [connect, disconnect]);

  // Effet de connexion initiale
  useEffect(() => {
    if (url) {
      shouldReconnectRef.current = true;
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  // Cleanup sur unmount
  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    error,
    reconnect,
    close: disconnect,
  };
};