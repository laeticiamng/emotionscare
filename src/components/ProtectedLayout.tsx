
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import LoadingAnimation from '@/components/ui/loading-animation';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireRole?: string;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  requireRole
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedLayout - Auth state:", { 
    isAuthenticated, 
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null, 
    isLoading, 
    path: location.pathname 
  });
  
  // Skip protection for authentication pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/admin-login';
  if (isAuthPage) {
    console.log("ProtectedLayout - On auth page, skipping protection");
    return <Layout>{children}</Layout>;
  }
  
  // Show loading state
  if (isLoading) {
    console.log("ProtectedLayout - Loading...");
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedLayout - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check for role requirements
  if (requireRole && user?.role !== requireRole && user?.role !== 'admin' && user?.role !== 'Admin') {
    console.log(`ProtectedLayout - Role check failed: user role ${user?.role} vs required ${requireRole}`);
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
  console.log("ProtectedLayout - All checks passed, rendering content");
  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;
