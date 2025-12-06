import { useEffect, useRef, useState, useCallback } from 'react';

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
      console.log('SSE: Connecting to', url);
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE: Connected');
        setIsConnected(true);
        setError(null);
        retryCountRef.current = 0;
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        console.log('SSE: Message received', event.data);
        onMessage?.(event);
      };

      eventSource.onerror = (event) => {
        console.error('SSE: Error', event);
        setIsConnected(false);
        
        if (eventSource.readyState === EventSource.CLOSED) {
          setError('Connection fermée');
          eventSourceRef.current = null;
          
          // Auto-reconnect avec backoff exponentiel
          if (autoReconnect && shouldReconnectRef.current && retryCountRef.current < maxRetries) {
            const delay = Math.min(retryInterval * Math.pow(2, retryCountRef.current), 8000);
            console.log(`SSE: Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
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
      console.error('SSE: Failed to create EventSource', err);
      setError('Échec de la connexion');
    }
  }, [url, onMessage, onError, onOpen, autoReconnect, maxRetries, retryInterval]);

  const disconnect = useCallback(() => {
    console.log('SSE: Disconnecting');
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
    console.log('SSE: Manual reconnect');
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