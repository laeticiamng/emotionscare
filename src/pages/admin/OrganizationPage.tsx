
import React from 'react';
import Shell from '@/Shell';
import OrganizationStructure from '@/components/admin/OrganizationStructure';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdminRole } from '@/utils/roleUtils';
import { useToast } from '@/hooks/use-toast';

const OrganizationPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Redirect to home if not authenticated or not admin
  if (!isLoading && (!user || !isAdminRole(user?.role))) {
    toast({
      title: "Accès non autorisé",
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container py-6 max-w-6xl">
        <OrganizationStructure />
      </div>
    </Shell>
  );
};

export default OrganizationPage;
