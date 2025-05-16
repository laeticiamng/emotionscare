
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This page redirects to the appropriate login page based on the URL
const LoginPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Par défaut, rediriger vers la page d'accueil
  return <Navigate to="/" replace />;
};

export default LoginPage;
