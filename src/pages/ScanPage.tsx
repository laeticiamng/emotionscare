
import React, { useState, useEffect } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import TeamTabContent from '@/components/scan/TeamTabContent';

const ScanPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90'>('30');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Function to handle scan saved
  const handleScanSaved = () => {
    setShowScanForm(false);
    toast({
      title: 'Scan enregistré',
      description: 'Votre scan émotionnel a été enregistré avec succès.',
    });
  };

  // Function to handle result saved
  const handleResultSaved = async () => {
    // Reload emotions after new scan
    try {
      // Here would be API call to fetch updated emotions
      setIsLoading(true);
      // Mock data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des émotions');
      setIsLoading(false);
    }
  };

  // Function to filter users
  const filterUsers = (filter: string) => {
    setSelectedFilter(filter);
    // Mock implementation
    setFilteredUsers([]);
  };

  return (
    <div className="container mx-auto py-8">
      <ScanPageHeader 
        showScanForm={showScanForm}
        activeTab={activeTab}
        setShowScanForm={setShowScanForm}
      />

      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="scan">Scanner</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="team">Vue Équipe</TabsTrigger>
        </TabsList>

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
      </Tabs>
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
