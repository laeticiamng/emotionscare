
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// A simple layout component that ensures users are authenticated
const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login()} replace />;
  }

  // Render the layout with the outlet for child routes
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
