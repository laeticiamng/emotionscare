
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProtectedLayout from "@/components/ProtectedLayout";
import ScanTabContent from "@/components/scan/ScanTabContent";
import HistoryTabContent from "@/components/scan/HistoryTabContent";
import TeamTabContent from "@/components/scan/TeamTabContent";
import ScanPageHeader from "@/components/scan/ScanPageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLogging } from '@/hooks/useActivityLogging';

const ScanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("scan");
  const { user } = useAuth();
  const { logUserAction } = useActivityLogging('scan_page');
  
  // Function to handle starting a new scan
  const handleStartScan = () => {
    setActiveTab('scan');
    if (user?.id) {
      logUserAction('start_scan', { method: 'manual' });
    }
  };

  if (!user) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Chargement...</h1>
            <p className="text-muted-foreground">Veuillez patienter pendant que nous chargeons vos données</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Page Header */}
        <ScanPageHeader 
          activeTab={activeTab}
        />
        
        <Card className="mt-6">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 py-2">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="scan">Nouveau scan</TabsTrigger>
                <TabsTrigger value="history">Mon historique</TabsTrigger>
                <TabsTrigger value="team">Équipe</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tabs Content */}
            <div className="p-6">
              <TabsContent value="scan" className="mt-0">
                <ScanTabContent userId={user.id} />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <HistoryTabContent />
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <TeamTabContent 
                  filteredUsers={[]} 
                  selectedFilter="all" 
                  filterUsers={() => {}} 
                  periodFilter="week"
                  setPeriodFilter={() => {}}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default ScanPage;
