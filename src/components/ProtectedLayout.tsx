
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireRole?: string;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  requireRole
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for role requirements
  if (requireRole && user?.role !== requireRole) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </Layout>
    );
  }
  
  // Return the children if all checks pass
  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;
