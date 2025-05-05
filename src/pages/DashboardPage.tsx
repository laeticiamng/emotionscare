
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { isAdminRole, isUserRole } from '@/utils/roleUtils';
import LoadingAnimation from '@/components/ui/loading-animation';

const DashboardPage: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate, toast]);
  
  if (isLoading) {
    return <LoadingAnimation />;
  }
  
  // Determine dashboard type based on user role with appropriate fallback
  const isAdmin = isAdminRole(user?.role);
  const isUser = isUserRole(user?.role);
  
  // Default to UserDashboard if role is not explicitly admin/direction
  const renderDashboard = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isUser || !user?.role) {
      return <UserDashboard />;
    } else {
      console.warn(`Unknown user role: ${user?.role}, defaulting to UserDashboard`);
      return <UserDashboard />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
