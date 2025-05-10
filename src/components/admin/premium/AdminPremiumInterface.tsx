
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PremiumAdminHeader from './PremiumAdminHeader';
import EmotionalClimateAnalytics from './EmotionalClimateAnalytics';
import SocialMetricsCard from './SocialMetricsCard';
import GamificationCard from './GamificationCard';
import ReportGenerator from './ReportGenerator';
import EmotionalTeamView from './EmotionalTeamView';
import { User } from '@/types/user';

interface AdminPremiumInterfaceProps {
  user?: User | null;
}

const AdminPremiumInterface: React.FC<AdminPremiumInterfaceProps> = ({ user }) => {
  return (
    <div className="container px-4 py-6">
      <PremiumAdminHeader user={user} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EmotionalClimateAnalytics className="col-span-full" />
        
        <SocialMetricsCard />
        <GamificationCard />
        <ReportGenerator />
        <EmotionalTeamView className="md:col-span-2" teamId="team-1" />
      </div>
    </div>
  );
};

export default AdminPremiumInterface;
