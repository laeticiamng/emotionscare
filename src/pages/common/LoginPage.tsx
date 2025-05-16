
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const LoginPage = () => {
  const navigate = useNavigate();
  
  return <Login />;
};

export default LoginPage;
