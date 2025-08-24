
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirection vers HomePage qui est la vraie page d'accueil
  return <Navigate to="/" replace />;
};

export default Index;
