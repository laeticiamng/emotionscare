
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  return <Outlet />;
};

export default ProtectedRoute;
