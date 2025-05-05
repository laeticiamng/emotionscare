
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EmotionScanSection from '@/components/dashboard/EmotionScanSection';
import UserSidePanel from '@/components/dashboard/UserSidePanel';
import ModulesSection from '@/components/dashboard/ModulesSection';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <DashboardHeader user={user} />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EmotionScanSection />
        <UserSidePanel />
      </div>

      <ModulesSection className="animate-slide-up" style={{ animationDelay: '0.5s' }} />
      
      <DashboardFooter />
    </div>
  );
};

export default UserDashboard;
