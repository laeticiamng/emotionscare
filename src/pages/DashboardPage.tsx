
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { isAdminRole, isUserRole } from '@/utils/roleUtils';
import LoadingAnimation from '@/components/ui/loading-animation';
import { useIsMobile } from '@/hooks/use-mobile';
import { notificationService } from '@/lib/coach/notification-service';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

const DashboardPage: React.FC = () => {
  console.log("DashboardPage Component - Initializing");
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  console.log("DashboardPage - Auth state:", { 
    user: user ? { id: user.id, role: user.role } : null, 
    isAuthenticated, 
    isLoading 
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("DashboardPage - Auth effect running, isLoading:", isLoading, "isAuthenticated:", isAuthenticated);
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
  
  // Demo: Add a sample notification when the dashboard loads
  useEffect(() => {
    if (user?.id) {
      // Add a welcome notification
      setTimeout(() => {
        console.log("DashboardPage - Adding welcome notification");
        notificationService.addNotification(user.id, {
          id: `welcome-${Date.now()}`,
          title: 'Bienvenue dans votre dashboard',
          message: 'Découvrez les nouvelles fonctionnalités disponibles',
          type: 'info',
          timestamp: new Date(),
          read: false
        });
        
        // Add another notification after a delay
        setTimeout(() => {
          console.log("DashboardPage - Adding reminder notification");
          notificationService.addNotification(user.id, {
            id: `reminder-${Date.now()}`,
            title: 'Rappel: Scan émotionnel',
            message: 'N\'oubliez pas de compléter votre scan émotionnel quotidien',
            type: 'reminder',
            timestamp: new Date(),
            read: false
          });
        }, 10000); // 10 seconds later
      }, 3000); // 3 seconds after load
    }
  }, [user?.id]);
  
  if (isLoading) {
    console.log("DashboardPage - Showing loading animation");
    return <LoadingAnimation />;
  }
  
  // Determine dashboard type based on user role with appropriate fallback
  const isAdmin = isAdminRole(user?.role);
  const isUser = isUserRole(user?.role);
  
  console.log(`DashboardPage - Determining dashboard type: isAdmin=${isAdmin}, isUser=${isUser}, role=${user?.role}`);
  
  return (
    <DashboardContainer>
      <div className={`${isMobile ? 'w-full px-0 py-1' : 'w-full premium-layout py-4'}`}>
        {isAdmin ? (
          <>
            {console.log("DashboardPage - Rendering AdminDashboard")}
            <AdminDashboard />
          </>
        ) : (
          <>
            {console.log("DashboardPage - Rendering UserDashboard")}
            <UserDashboard user={user} />
          </>
        )}
      </div>
    </DashboardContainer>
  );
};

export default DashboardPage;
