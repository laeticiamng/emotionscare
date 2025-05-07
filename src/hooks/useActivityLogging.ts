
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { activityLogService } from '@/lib/activity';

/**
 * Hook to automatically log activities based on route changes and user actions
 */
export const useActivityLogging = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Log page views/consultations based on route changes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    console.log(`useActivityLogging - Detected path change: ${location.pathname}`);
    
    // We don't want to log every single page view, just meaningful ones
    const pagesToLog = {
      '/scan': { title: 'Scan émotionnel', type: 'feature' },
      '/journal': { title: 'Journal de bien-être', type: 'feature' },
      '/vr-sessions': { title: 'Sessions de réalité virtuelle', type: 'feature' },
      '/gamification': { title: 'Tableau des badges', type: 'feature' },
      '/social-cocoon': { title: 'Communauté Social Cocoon', type: 'feature' },
      '/buddy': { title: 'Programme Buddy', type: 'feature' },
      '/coach': { title: 'Coach AI personnel', type: 'feature' },
      '/music-wellbeing': { title: 'Musique bien-être', type: 'feature' }
    };
    
    const currentPath = location.pathname;
    const exactMatch = pagesToLog[currentPath];
    
    if (exactMatch) {
      console.log(`useActivityLogging - Logging consultation for: ${exactMatch.title}`);
      activityLogService.logConsultation(user.id, {
        title: exactMatch.title,
        type: exactMatch.type
      });
      return;
    }
    
    // Check for pattern matches
    if (currentPath.startsWith('/scan/')) {
      activityLogService.logConsultation(user.id, {
        title: 'Détail d\'un scan émotionnel',
        type: 'scan_detail',
        id: currentPath.split('/').pop()
      });
    }
    else if (currentPath.startsWith('/journal/')) {
      activityLogService.logConsultation(user.id, {
        title: 'Entrée de journal',
        type: 'journal_entry',
        id: currentPath.split('/').pop()
      });
    }
    else if (currentPath.startsWith('/vr-sessions/')) {
      activityLogService.logConsultation(user.id, {
        title: 'Session VR',
        type: 'vr_session',
        id: currentPath.split('/').pop()
      });
    }
    
  }, [location.pathname, isAuthenticated, user?.id]);
  
  // Functions to explicitly log specific activities
  const logProfileUpdate = (details?: Record<string, any>) => {
    if (isAuthenticated && user?.id) {
      activityLogService.logProfileUpdate(user.id, details);
    }
  };
  
  const logEventRegistration = (event: { title: string; date?: string; id?: string }) => {
    if (isAuthenticated && user?.id) {
      activityLogService.logEventRegistration(user.id, event);
    }
  };
  
  const logQuestionnaireResponse = (questionnaire: { title: string; id?: string }) => {
    if (isAuthenticated && user?.id) {
      activityLogService.logQuestionnaireResponse(user.id, questionnaire);
    }
  };
  
  return {
    logProfileUpdate,
    logEventRegistration,
    logQuestionnaireResponse
  };
};
