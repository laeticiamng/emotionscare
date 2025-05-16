
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiCards from '@/components/dashboard/KpiCards';
import ModulesSection from '@/components/dashboard/ModulesSection';
import { UserDashboardSections } from '@/components/dashboard/UserDashboardSections';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import useDashboardState from '@/hooks/useDashboardState';

const { PopularSessionsSection, RecentActivitySection, UpcomingEventsSection } = UserDashboardSections;

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { collapsedSections, toggleSection } = useDashboardState();
  
  // Mock data for KPI cards
  const mockData = {
    vrSessionsThisMonth: 12,
    vrSessionsLastMonth: 8,
    userBadgesCount: 5,
    avgEmotionalScore: 75,
  };
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8 pb-24">
      <DashboardHeader user={user} onRefresh={handleRefresh} />
      
      <KpiCards 
        vrSessionsThisMonth={mockData.vrSessionsThisMonth}
        vrSessionsLastMonth={mockData.vrSessionsLastMonth}
        userBadgesCount={mockData.userBadgesCount}
        avgEmotionalScore={mockData.avgEmotionalScore}
        isLoading={isLoading}
      />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Navigation rapide</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleSection('modules')}
          >
            {collapsedSections.modules ? (
              <><ChevronDown className="h-4 w-4 mr-1" /> Afficher</>
            ) : (
              <><ChevronUp className="h-4 w-4 mr-1" /> Masquer</>
            )}
          </Button>
        </div>
        
        {!collapsedSections.modules && (
          <ModulesSection />
        )}
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="activity">Activités récentes</TabsTrigger>
          <TabsTrigger value="sessions">Sessions populaires</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <RecentActivitySection />
        </TabsContent>
        
        <TabsContent value="sessions">
          <PopularSessionsSection />
        </TabsContent>
        
        <TabsContent value="events">
          <UpcomingEventsSection />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Voir toutes les données
        </Button>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
