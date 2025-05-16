
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

// Cette page est un routeur qui redirige vers le bon type de login en fonction de l'URL
const LoginPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/login') {
    // Rediriger vers le login B2C par défaut
    return <Navigate to="/b2c/login" replace />;
  }

  if (path.includes('/b2c/login')) {
    return <Navigate to="/b2c/login" replace />;
  } else if (path.includes('/b2b/user/login')) {
    return <Navigate to="/b2b/user/login" replace />;
  } else if (path.includes('/b2b/admin/login')) {
    return <Navigate to="/b2b/admin/login" replace />;
  } else {
    // En cas de doute, rediriger vers le login B2C
    return <Navigate to="/b2c/login" replace />;
  }
};

export default LoginPage;
