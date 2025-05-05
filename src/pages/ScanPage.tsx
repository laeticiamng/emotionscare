
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { useScanPage } from '@/hooks/useScanPage';
import { PlusCircle, Filter } from 'lucide-react';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionScanLive from '@/components/scan/EmotionScanLive';
import EmotionHistory from '@/components/scan/EmotionHistory';
import TeamOverview from '@/components/scan/TeamOverview';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const { filteredUsers, selectedFilter, filterUsers } = useScanPage();
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);

  // Cast Role to ensure we can compare correctly
  const isAdmin = user?.role === 'Admin';

  const handleScanSaved = () => {
    setShowScanForm(false);
    // Refresh data or update UI as needed
  };

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Scan Émotionnel</h1>
          <p className="text-muted-foreground mb-4">
            Prenez un moment pour évaluer votre état émotionnel
          </p>
        </div>

        {!showScanForm && activeTab === 'scan' && (
          <Button onClick={() => setShowScanForm(true)} className="mb-4 sm:mb-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau scan émotionnel
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="scan">Mon Scan</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          {isAdmin && <TabsTrigger value="team">Équipe</TabsTrigger>}
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          {showScanForm ? (
            <Card className="p-6">
              <EmotionScanForm
                onScanSaved={handleScanSaved}
                onClose={() => setShowScanForm(false)}
              />
            </Card>
          ) : (
            <EmotionScanLive />
          )}
        </TabsContent>

        <TabsContent value="history">
          <EmotionHistory userId={user?.id} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="team">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Scans Émotionnels de l'Équipe</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Filtrer:</span>
                  <Button
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => filterUsers('all')}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={selectedFilter === 'risk' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => filterUsers('risk')}
                  >
                    À risque
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <TeamOverview users={filteredUsers} />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ScanPage;
