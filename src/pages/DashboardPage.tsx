
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { isAdminRole, isUserRole } from '@/utils/roleUtils';
import LoadingAnimation from '@/components/ui/loading-animation';
import SessionTimeoutAlert from '@/components/SessionTimeoutAlert';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardPage: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionContinued, setSessionContinued] = useState(false);
  const isMobile = useIsMobile();
  
  console.log("DashboardPage - Auth state:", { user, isAuthenticated, isLoading });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("DashboardPage - Not authenticated, redirecting to login");
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate, toast]);
  
  if (isLoading) {
    console.log("DashboardPage - Loading...");
    return <LoadingAnimation />;
  }
  
  // Determine dashboard type based on user role with appropriate fallback
  const isAdmin = isAdminRole(user?.role);
  const isUser = isUserRole(user?.role);
  
  console.log(`DashboardPage - Determining dashboard type: isAdmin=${isAdmin}, isUser=${isUser}, role=${user?.role}`);
  
  // Default to UserDashboard if role is not explicitly admin/direction
  const renderDashboard = () => {
    if (isAdmin) {
      console.log("DashboardPage - Rendering AdminDashboard");
      return <AdminDashboard />;
    } else if (isUser || !user?.role) {
      console.log("DashboardPage - Rendering UserDashboard");
      return <UserDashboard user={user} />;
    } else {
      console.warn(`Unknown user role: ${user?.role}, defaulting to UserDashboard`);
      return <UserDashboard user={user} />;
    }
  };
  
  return (
    <div className={`${isMobile ? 'w-full px-0' : 'container mx-auto py-6'}`}>
      {renderDashboard()}
      <SessionTimeoutAlert />
    </div>
  );
};

export default DashboardPage;
