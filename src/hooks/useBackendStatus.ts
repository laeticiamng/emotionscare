// @ts-nocheck

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

export const useBackendStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const connected = await ApiService.testConnection();
      setIsConnected(connected);
      setLastCheck(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    lastCheck,
    refetch: checkConnection,
  };
};
