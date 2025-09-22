/**
 * HomePage - Page d'accueil accessible à tous
 * Accessible même aux utilisateurs connectés
 */

import React from 'react';
import TestPage from './TestPage';

const HomePage: React.FC = () => {
  console.log('[HomePage] Loading test page to isolate issue');
  return <TestPage />;
};

export default HomePage;