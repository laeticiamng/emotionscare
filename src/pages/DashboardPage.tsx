
import React, { useEffect, useCallback, useState } from 'react';
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
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { motion } from 'framer-motion';
import { Confetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { User } from '@/types/user';

const DashboardPage: React.FC = () => {
  const logger = useLogger('DashboardPage');
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { getLatestEmotion, lastEmotion } = useEmotionScan();
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastLoginDate, setLastLoginDate] = useState<Date | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  logger.debug('Component initializing', { 
    data: {
      user: user ? { id: user.id, role: user.role } : null, 
      isAuthenticated, 
      isLoading 
    }
  });
  
  // Get the user's latest emotion on component mount
  useEffect(() => {
    if (user && user.id) {
      getLatestEmotion();
    }
  }, [user, getLatestEmotion]);
  
  // Show confetti and welcome message for users returning after 24+ hours
  useEffect(() => {
    if (user && user.id) {
      const lastLogin = localStorage.getItem(`lastLogin_${user.id}`);
      const now = new Date();
      
      if (lastLogin) {
        const lastDate = new Date(lastLogin);
        setLastLoginDate(lastDate);
        
        // If it's been more than 24 hours since last login
        if ((now.getTime() - lastDate.getTime()) > 24 * 60 * 60 * 1000) {
          setShowWelcome(true);
          setShowConfetti(true);
          
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
        }
      }
      
      // Update last login time
      localStorage.setItem(`lastLogin_${user.id}`, now.toISOString());
    }
  }, [user]);
  
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
  
  // Cast user to User type from user.ts for compatibility
  const typedUser = user as User;
  
  return (
    <DashboardContainer>
      {/* Confetti animation for returning users */}
      {showConfetti && <Confetti duration={3000} />}
      
      {/* Welcome back message */}
      {showWelcome && (
        <motion.div 
          className="mb-6 p-4 bg-primary/10 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1 flex items-center gap-1 bg-primary/20">
              <Heart className="h-3 w-3" />
              Bon retour
            </Badge>
            <h3 className="text-lg font-medium">
              Ravi de vous revoir, {typedUser?.name}! Votre dernière visite était il y a{' '}
              {lastLoginDate ? Math.floor((new Date().getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)) : '?'} jours.
            </h3>
          </div>
        </motion.div>
      )}
      
      <div className={`${isMobile ? 'w-full px-0 py-1' : 'w-full premium-layout py-4'}`}>
        <SegmentProvider>
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <UserDashboard user={typedUser} latestEmotion={lastEmotion ? { emotion: lastEmotion.emotion, score: lastEmotion.score } : undefined} />
          )}
        </SegmentProvider>
      </div>
    </DashboardContainer>
  );
}

export default DashboardPage;
