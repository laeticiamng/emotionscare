
import React, { useState, useEffect } from 'react';
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

// Define the props interfaces for our components
interface ScanPageHeaderProps {
  showScanForm: boolean;
  activeTab: string;
  setShowScanForm: (show: boolean) => void;
}

interface ScanTabContentProps {
  userId: string;
  showScanForm: boolean;
  setShowScanForm: (show: boolean) => void;
  handleScanSaved: () => void;
  onResultSaved: () => Promise<void>;
}

interface HistoryTabContentProps {
  emotions: any[];
}

interface TeamTabContentProps {
  filteredUsers: any[];
  selectedFilter: string;
  filterUsers: (filter: string) => void;
  periodFilter: '7' | '30' | '90';
  setPeriodFilter: (period: '7' | '30' | '90') => void;
}

const ScanPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    activeTab,
    setActiveTab,
    showScanForm,
    setShowScanForm,
    emotions,
    loading,
    filteredUsers,
    selectedFilter,
    filterUsers,
    periodFilter,
    setPeriodFilter,
    handleScanSaved,
    refreshEmotionHistory
  } = useScanPageState(user?.id);
  
  const [backgroundAnimation, setBackgroundAnimation] = useState(0);

  // Change background animation based on active tab
  useEffect(() => {
    if (activeTab === 'scan') {
      setBackgroundAnimation(1);
    } else if (activeTab === 'history') {
      setBackgroundAnimation(2);
    } else {
      setBackgroundAnimation(3);
    }
  }, [activeTab]);

  const handleResultSaved = async () => {
    await refreshEmotionHistory();
    toast({
      title: "Scan enregistré",
      description: "Votre analyse émotionnelle a été sauvegardée avec succès.",
    });
  };

  // Get background style based on active tab
  const getBackgroundStyle = () => {
    switch (activeTab) {
      case 'scan':
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30";
      case 'history':
        return "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30";
      case 'team':
        return "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-800/30";
      default:
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30";
    }
  };

  return (
    <div className={`min-h-[80vh] pb-12 relative ${getBackgroundStyle()}`}>
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: backgroundAnimation === 1 
              ? ['0% 0%', '100% 100%'] 
              : backgroundAnimation === 2 
                ? ['100% 0%', '0% 100%'] 
                : ['0% 100%', '100% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `radial-gradient(circle at ${backgroundAnimation * 30}% ${100 - backgroundAnimation * 30}%, 
              rgba(99,102,241,0.15) 0%, 
              rgba(168,85,247,0.05) 25%, 
              rgba(236,72,153,0.05) 50%, 
              rgba(239,68,68,0) 100%)`,
            backgroundSize: '200% 200%',
          }}
        />
      </div>
      
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
