
/**
 * 🚀 MIGRATED TO ROUTERV2 - Phase 2 Complete
 * All hardcoded links replaced with typed Routes.xxx() helpers
 * TICKET: FE/BE-Router-Cleanup-02
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from '@/routerV2';

const Index: React.FC = () => {
  // Redirection vers HomePage qui est la vraie page d'accueil
  return <Navigate to={Routes.home()} replace />;
};

export default Index;
