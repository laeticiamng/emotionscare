// @ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * B2B User Register Page - Redirects to main signup
 */
const RegisterPage: React.FC = () => {
  return <Navigate to="/signup" replace />;
};

export default RegisterPage;