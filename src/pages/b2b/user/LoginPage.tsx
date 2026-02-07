// @ts-nocheck
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * B2B User Login Page - Redirects to main login with B2B params
 */
const LoginPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (!params.has('segment')) params.set('segment', 'b2b');
  if (!params.has('role')) params.set('role', 'user');
  return <Navigate to={`/login?${params.toString()}`} replace />;
};

export default LoginPage;