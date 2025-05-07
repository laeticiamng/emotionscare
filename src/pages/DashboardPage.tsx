
import React, { useEffect, useCallback } from 'react';
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
import { SegmentProvider } from '@/contexts/SegmentContext';
import useLogger from '@/hooks/useLogger';

const DashboardPage: React.FC = () => {
  const logger = useLogger('DashboardPage');
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  logger.debug('Component initializing', { 
    data: {
      user: user ? { id: user.id, role: user.role } : null, 
      isAuthenticated, 
      isLoading 
    }
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    logger.debug('Auth effect running', { 
      data: { isLoading, isAuthenticated }
    });
    
    if (!isLoading && !isAuthenticated) {
      logger.info('Not authenticated, redirecting to login');
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate, toast, logger]);
  
  // Add demo notifications
  const addWelcomeNotification = useCallback(() => {
    if (!user?.id) return;
    
    logger.debug('Adding welcome notification');
    notificationService.addNotification(user.id, {
      id: `welcome-${Date.now()}`,
      title: 'Bienvenue dans votre dashboard',
      message: 'Découvrez les nouvelles fonctionnalités disponibles',
      type: 'info',
      timestamp: new Date(),
      read: false
    });
  }, [user?.id, logger]);
  
  const addReminderNotification = useCallback(() => {
    if (!user?.id) return;
    
    logger.debug('Adding reminder notification');
    notificationService.addNotification(user.id, {
      id: `reminder-${Date.now()}`,
      title: 'Rappel: Scan émotionnel',
      message: 'N\'oubliez pas de compléter votre scan émotionnel quotidien',
      type: 'reminder',
      timestamp: new Date(),
      read: false
    });
  }, [user?.id, logger]);
  
  // Demo: Add sample notifications when the dashboard loads
  useEffect(() => {
    if (user?.id) {
      // Add notifications with delays
      const welcomeTimer = setTimeout(addWelcomeNotification, 3000);
      const reminderTimer = setTimeout(addReminderNotification, 13000);
      
      // Clean up timers
      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(reminderTimer);
      };
    }
  }, [user?.id, addWelcomeNotification, addReminderNotification]);
  
  if (isLoading) {
    logger.debug('Showing loading animation');
    return <LoadingAnimation />;
  }
  
  // Determine dashboard type based on user role
  const isAdmin = isAdminRole(user?.role);
  const isUser = isUserRole(user?.role);
  
  logger.debug('Determining dashboard type', { 
    data: { isAdmin, isUser, role: user?.role }
  });
  
  return (
    <DashboardContainer>
      <div className={`${isMobile ? 'w-full px-0 py-1' : 'w-full premium-layout py-4'}`}>
        <SegmentProvider>
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <UserDashboard user={user} />
          )}
        </SegmentProvider>
      </div>
    </DashboardContainer>
  );
};

export default DashboardPage;
