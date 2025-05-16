
import React from 'react';
import { useLocation } from 'react-router-dom';
import B2CLogin from './b2c/Login';
import B2BUserLogin from './b2b/user/Login';
import B2BAdminLogin from './b2b/admin/Login';

// Cette page est un routeur qui redirige vers le bon type de login en fonction de l'URL
const LoginPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/b2c/login')) {
    return <B2CLogin />;
  } else if (path.includes('/b2b/user/login')) {
    return <B2BUserLogin />;
  } else if (path.includes('/b2b/admin/login')) {
    return <B2BAdminLogin />;
  } else {
    // Default to B2C login
    return <B2CLogin />;
  }
};

export default LoginPage;
