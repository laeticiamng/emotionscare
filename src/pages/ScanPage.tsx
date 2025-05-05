
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useScanPageState } from '@/hooks/useScanPageState';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import TeamTabContent from '@/components/scan/TeamTabContent';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const {
    activeTab,
    setActiveTab,
    showScanForm,
    setShowScanForm,
    emotions,
    periodFilter,
    setPeriodFilter,
    filteredUsers,
    selectedFilter,
    filterUsers,
    handleScanSaved,
    refreshEmotionHistory
  } = useScanPageState(user?.id);
  
  // Cast Role to ensure we can compare correctly
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  return (
    <div className="container py-8 px-4">
      <ScanPageHeader 
        showScanForm={showScanForm} 
        activeTab={activeTab} 
        setShowScanForm={setShowScanForm} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="rounded-full bg-muted/50 p-1">
          <TabsTrigger value="scan" className="rounded-full">Mon Scan</TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">Historique</TabsTrigger>
          {isAdmin && <TabsTrigger value="team" className="rounded-full">Équipe</TabsTrigger>}
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          <ScanTabContent 
            showScanForm={showScanForm}
            userId={user?.id || ''}
            handleScanSaved={handleScanSaved}
            setShowScanForm={setShowScanForm}
            onResultSaved={refreshEmotionHistory}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-8">
          <HistoryTabContent emotions={emotions} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="team">
            <TeamTabContent 
              filteredUsers={filteredUsers}
              selectedFilter={selectedFilter}
              filterUsers={filterUsers}
              periodFilter={periodFilter}
              setPeriodFilter={setPeriodFilter}
            />
          </TabsContent>
        )}
      </Tabs>

      <div className="mt-8 text-xs text-center text-muted-foreground">
        <p>Conformité RGPD - Vos données sont traitées conformément à notre politique de confidentialité</p>
      </div>
    </div>
  );
};

export default ScanPage;
