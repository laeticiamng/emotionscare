
import React, { useState, useEffect } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import TeamTabContent from '@/components/scan/TeamTabContent';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import { useAuth } from '@/contexts/AuthContext';
import useScanPage from '@/hooks/useScanPage';

const ScanPage = () => {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const { user } = useAuth();
  const { emotions, isLoading, error, filteredUsers, selectedFilter, filterUsers } = useScanPage();
  
  // Check if user is a manager for team tab visibility
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  
  const handleScanComplete = () => {
    // Switch to history tab after completing a scan
    setActiveTab('history');
  };
  
  return (
    <ProtectedLayoutWrapper>
      <div className="container mx-auto p-4">
        <ScanPageHeader 
          showScanForm={showScanForm}
          activeTab={activeTab}
          setShowScanForm={setShowScanForm}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="scan">Scan</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            {isManager && (
              <TabsTrigger value="team">Équipe</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="scan" className="mt-6">
            <ScanTabContent 
              onScanComplete={handleScanComplete} 
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryTabContent 
              emotions={emotions}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>
          
          {isManager && (
            <TabsContent value="team" className="mt-6">
              <TeamTabContent
                filteredUsers={filteredUsers}
                selectedFilter={selectedFilter}
                filterUsers={filterUsers}
                periodFilter="all"
                setPeriodFilter={() => {}}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ProtectedLayoutWrapper>
  );
};

export default ScanPage;
