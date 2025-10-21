/**
 * HomePage - Page d'accueil accessible à tous
 * VERSION TEST SIMPLIFIÉE pour diagnostic
 */

import React from 'react';
import { logger } from '@/lib/logger';

// Utiliser la version simple pour tester
import SimpleTestHome from './SimpleTestHome';

const HomePage: React.FC = () => {
  logger.info('HomePage rendering (simple test version)', undefined, 'UI');
  
  return <SimpleTestHome />;
};

export default HomePage;