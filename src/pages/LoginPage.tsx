
import React from 'react';
import { Navigate } from 'react-router-dom';

// On ne conserve plus cette page car on a des pages de login spécifiques
const LoginPage: React.FC = () => {
  // Rediriger vers la landing page
  return <Navigate to="/" replace />;
};

export default LoginPage;
