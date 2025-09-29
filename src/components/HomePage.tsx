/**
 * HomePage - Page d'accueil accessible à tous
 * Accessible même aux utilisateurs connectés
 * Version améliorée avec fonctionnalités modernes
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ModernHomePage from '@/components/modern-features/ModernHomePage';

const HomePage: React.FC = () => {
  return <ModernHomePage />;
};

export default HomePage;