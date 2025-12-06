// @ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * B2B User Login Page - Redirects to main login
 */
const LoginPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default LoginPage;