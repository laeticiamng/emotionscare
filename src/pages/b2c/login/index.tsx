/**
 * B2C Login Page - Page de connexion B2C
 * Redirection vers la page de login unifiée
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

export const B2CLoginPage: React.FC = () => {
  return <Navigate to="/login?segment=b2c" replace />;
};

export default B2CLoginPage;