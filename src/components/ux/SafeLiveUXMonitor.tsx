import React from 'react';
import { useLocation } from 'react-router-dom';
import LiveUXMonitor from './LiveUXMonitor';

const SafeLiveUXMonitor: React.FC = () => {
  try {
    // Test si useLocation() est disponible
    useLocation();
    return <LiveUXMonitor />;
  } catch (error) {
    // Si useLocation() échoue, on ne rend rien
    console.warn('LiveUXMonitor: Router context not available yet');
    return null;
  }
};

export default SafeLiveUXMonitor;