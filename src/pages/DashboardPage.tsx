
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { User } from '@/types/user';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { userMode } = useUserMode();
  
  console.log('DashboardPage rendering with userMode:', userMode);
  
  // Mock user data for demonstration
  const mockUser: User = {
    id: "demo-user-id",
    name: "Utilisateur Démo",
    email: "user@example.com",
    avatar_url: "",
    role: userMode === 'b2b-admin' ? "admin" : "user",
    created_at: new Date().toISOString(),
    onboarded: true
  };
  
  // Mock emotion data
  const mockEmotion = {
    emotion: "calm", 
    score: 85
  };

  useEffect(() => {
    console.log('Dashboard loaded with userMode:', userMode);
    // Welcome notification
    toast({
      title: "Tableau de bord chargé",
      description: userMode === 'b2b-admin' 
        ? "Bienvenue dans votre espace administrateur" 
        : "Bienvenue dans votre espace personnel"
    });
  }, [toast, userMode]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <DashboardContainer>
      <div className={`${isMobile ? 'w-full px-0 py-1' : 'w-full premium-layout py-4'}`}>
        <SegmentProvider>
          <UserDashboard 
            user={mockUser} 
            latestEmotion={mockEmotion}
          />
        </SegmentProvider>
      </div>
    </DashboardContainer>
  );
};

export default DashboardPage;
