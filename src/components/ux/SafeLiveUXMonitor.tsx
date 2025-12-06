// @ts-nocheck
import React from 'react';
import { useLocation } from 'react-router-dom';
import LiveUXMonitor from './LiveUXMonitor';
import { logger } from '@/lib/logger';

const SafeLiveUXMonitor: React.FC = () => {
  try {
    // Test si useLocation() est disponible
    useLocation();
    return <LiveUXMonitor />;
  } catch (error) {
    // Si useLocation() échoue, on ne rend rien
    logger.warn('LiveUXMonitor: Router context not available yet', {}, 'UI');
    return null;
  }
};

export default SafeLiveUXMonitor;