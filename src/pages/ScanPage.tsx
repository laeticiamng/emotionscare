
import React from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import TeamTabContent from '@/components/scan/TeamTabContent';
import { useScanPageState } from '@/hooks/useScanPageState';
import { useScanBackground } from '@/hooks/useScanBackground';
import TabBackgroundAnimation from '@/components/scan/animation/TabBackgroundAnimation';

const ScanPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    activeTab,
    setActiveTab,
    showScanForm,
    setShowScanForm,
    emotions,
    filteredUsers,
    selectedFilter,
    filterUsers,
    periodFilter,
    setPeriodFilter,
    handleScanSaved,
    refreshEmotionHistory
  } = useScanPageState(user?.id);
  
  const { backgroundAnimation, getBackgroundStyle } = useScanBackground(activeTab);

  const handleResultSaved = async () => {
    await refreshEmotionHistory();
    toast({
      title: "Scan enregistré",
      description: "Votre analyse émotionnelle a été sauvegardée avec succès.",
    });
  };

  return (
    <div className={`min-h-[80vh] pb-12 relative ${getBackgroundStyle()}`}>
      {/* Animated background */}
      <TabBackgroundAnimation backgroundAnimation={backgroundAnimation} />
      
      <div className="container mx-auto py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScanPageHeader 
            showScanForm={showScanForm}
            activeTab={activeTab}
            setShowScanForm={setShowScanForm}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="scan" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Scanner
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Historique
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Vue Équipe
              </TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <TabsContent value="scan">
                <ScanTabContent 
                  userId={user?.id || ''}
                  showScanForm={showScanForm}
                  setShowScanForm={setShowScanForm}
                  handleScanSaved={handleScanSaved}
                  onResultSaved={handleResultSaved}
                />
              </TabsContent>

              <TabsContent value="history">
                <HistoryTabContent 
                  emotions={emotions}
                />
              </TabsContent>

              <TabsContent value="team">
                <TeamTabContent 
                  filteredUsers={filteredUsers}
                  selectedFilter={selectedFilter}
                  filterUsers={filterUsers}
                  periodFilter={periodFilter}
                  setPeriodFilter={setPeriodFilter}
                />
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default function WrappedScanPage() {
  return (
    <ProtectedLayoutWrapper>
      <ScanPage />
    </ProtectedLayoutWrapper>
  );
}
