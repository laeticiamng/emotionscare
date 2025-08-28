
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './index';

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
