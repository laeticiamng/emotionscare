
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import TeamTabContent from '@/components/scan/TeamTabContent';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import ProtectedLayout from '@/components/ProtectedLayout';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState<boolean>(false);
  const { toast } = useToast();
  
  console.log("ScanPage - Rendering with user:", user ? { id: user.id, role: user.role } : "No user");

  // Handle callback when a scan is saved
  const handleScanSaved = useCallback(() => {
    toast({
      title: "Scan émotionnel sauvegardé",
      description: "Votre scan émotionnel a été enregistré avec succès"
    });
    setShowScanForm(false);
    setActiveTab('history');
  }, [toast]);

  // Function to refresh data after a new scan is saved
  const handleResultSaved = useCallback(async () => {
    console.log("Scan result saved, refreshing data...");
    // This would typically refresh history data
    return Promise.resolve();
  }, []);

  return (
    <ProtectedLayout>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
        <ScanPageHeader 
          activeTab={activeTab} 
          onStartScan={() => {
            setShowScanForm(true);
            setActiveTab('scan');
          }}
        />
        
        <Tabs 
          defaultValue="scan"
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="scan">Scan Émotionnel</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="team">Équipe</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="scan">
            <ScanTabContent 
              showScanForm={showScanForm}
              userId={user?.id || ''}
              handleScanSaved={handleScanSaved}
              setShowScanForm={setShowScanForm}
              onResultSaved={handleResultSaved}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="p-6 shadow-md rounded-3xl">
              <HistoryTabContent 
                userId={user?.id || ''}
              />
            </Card>
          </TabsContent>
          
          {user?.role === 'admin' && (
            <TabsContent value="team">
              <Card className="p-6 shadow-md rounded-3xl">
                <TeamTabContent />
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};

export default ScanPage;
