
import React from 'react';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { User } from '@/types/user';

const DashboardPage: React.FC = () => {
  const { userMode } = useUserMode();
  
  // Données utilisateur fictives pour la démo
  const mockUser: User = {
    id: "demo-user-id",
    name: "Utilisateur Démo",
    email: "user@example.com",
    avatar_url: "",
    role: userMode === 'b2b-admin' ? "admin" : "user",
    created_at: new Date().toISOString(),
    onboarded: true
  };
  
  // Données émotion fictives
  const mockEmotion = {
    emotion: "calm", 
    score: 85
  };
  
  return (
    <div className="w-full">
      <SegmentProvider>
        <UserDashboard 
          user={mockUser} 
          latestEmotion={mockEmotion}
        />
      </SegmentProvider>
    </div>
  );
};

export default DashboardPage;
