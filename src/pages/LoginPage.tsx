
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This page redirects to the appropriate login page based on the URL
const LoginPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/b2c/login')) {
    return <Navigate to="/b2c/login" replace />;
  } else if (path.includes('/b2b/user/login')) {
    return <Navigate to="/b2b/user/login" replace />;
  } else if (path.includes('/b2b/admin/login')) {
    return <Navigate to="/b2b/admin/login" replace />;
  } else {
    // Redirect to B2C login as default
    return <Navigate to="/b2c/login" replace />;
  }
};

export default LoginPage;
