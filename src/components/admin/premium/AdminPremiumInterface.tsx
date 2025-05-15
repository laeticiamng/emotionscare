
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PremiumAdminHeader from './PremiumAdminHeader';
import EmotionalClimateAnalytics from './EmotionalClimateAnalytics';
import SocialMetricsCard from './SocialMetricsCard';
import GamificationCard from './GamificationCard';
import ReportGenerator from './ReportGenerator';
import EmotionalTeamView from './EmotionalTeamView';
import { User } from '@/types';

interface AdminPremiumInterfaceProps {
  user?: User | null;
}

const AdminPremiumInterface: React.FC<AdminPremiumInterfaceProps> = ({ user }) => {
  // Create a dateRange object for the EmotionalTeamView component
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const dateRange = {
    start: oneWeekAgo,
    end: today,
  };
  
  return (
    <div className="container px-4 py-6">
      <PremiumAdminHeader user={user} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EmotionalClimateAnalytics className="col-span-full" />
        
        <SocialMetricsCard />
        <GamificationCard />
        <ReportGenerator />
        <EmotionalTeamView 
          className="md:col-span-2" 
          teamId="team-1"
          userId={user?.id || 'admin'}
          period="week"
          anonymized={true}
        />
      </div>
    </div>
  );
};

export default AdminPremiumInterface;
