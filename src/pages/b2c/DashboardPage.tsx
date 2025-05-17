
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMusic } from '@/contexts/music';
import PageTitle from '@/components/ui/page-title';
import RecentJournalEntries from '@/components/dashboard/RecentJournalEntries';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';
import PredictiveRecommendations from '@/components/predictive/PredictiveRecommendations';
import QuickNavGrid from '@/components/dashboard/QuickNavGrid';

const B2CDashboardPage: React.FC = () => {
  const { isInitialized } = useMusic();
  
  return (
    <div className="container mx-auto py-6 px-4">
      <PageTitle 
        title="Tableau de bord" 
        description="Bienvenue sur votre espace personnel EmotionsCare"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <QuickNavGrid />
        </div>
        <div>
          <PredictiveRecommendations />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentJournalEntries />
        <UpcomingReminders />
      </div>
    </div>
  );
};

export default B2CDashboardPage;
