import React from 'react';
import Shell from '@/Shell';
import ReportsDashboard from '@/components/admin/reports/ReportsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdminRole } from '@/utils/roleUtils';
import { useToast } from '@/hooks/use-toast';

const AdminReportingPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  if (!isLoading && (!user || !isAdminRole(user?.role))) {
    toast({
      title: 'Accès non autorisé',
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      variant: 'destructive'
    });
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 border-4 border-t-primary border-primary/30 rounded-full animate-spin" />
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <ReportsDashboard />
      </div>
    </Shell>
  );
};

export default AdminReportingPage;
