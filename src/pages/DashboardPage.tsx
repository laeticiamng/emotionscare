
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { prepareReportData } from '@/utils/chartUtils';
import KpiCards from '@/components/dashboard/KpiCards';
import TrendCharts from '@/components/dashboard/TrendCharts';
import VrPromptBanner from '@/components/dashboard/VrPromptBanner';
import QuickNavGrid from '@/components/dashboard/QuickNavGrid';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Prepare chart data
  const absenteeismData = prepareReportData('absenteeism');
  const productivityData = prepareReportData('productivity');
  
  // Count VR sessions in the last 30 days (mock data)
  const vrSessionsThisMonth = 8; // This would come from real data
  const vrSessionsLastMonth = 6; // This would come from real data
  
  // Count badges for current user (mock data)
  const userBadgesCount = user?.id === '1' ? 2 : 0; // This would come from real data
  
  return (
    <div className="cocoon-page">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">EmotionsCare</h1>
        <h2 className="text-xl text-muted-foreground">par ResiMax™ 4.0</h2>
      </div>
      
      <KpiCards 
        vrSessionsThisMonth={vrSessionsThisMonth}
        vrSessionsLastMonth={vrSessionsLastMonth}
        userBadgesCount={userBadgesCount}
      />

      <TrendCharts 
        absenteeismData={absenteeismData}
        productivityData={productivityData}
      />

      <VrPromptBanner userName={user?.name || 'utilisateur'} />

      <QuickNavGrid />
    </div>
  );
};

export default DashboardPage;
