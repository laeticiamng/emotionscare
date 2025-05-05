
import React, { useState } from 'react';
import { useScanPage } from '@/hooks/useScanPage';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionHistory from '@/components/scan/EmotionHistory';
import TeamOverview from '@/components/scan/TeamOverview';
import EmotionScanLive from '@/components/scan/EmotionScanLive';
import MusicRecommendation from '@/components/scan/MusicRecommendation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { Emotion } from '@/types';
import LoadingAnimation from '@/components/ui/loading-animation';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

const ScanPage = () => {
  const { users, loading, history, handleScanSaved } = useScanPage();
  const [activeTab, setActiveTab] = useState("personnel");
  const { user } = useAuth();
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  
  // Check if user has admin privileges
  const isAdmin = isAdminRole(user?.role);
  
  // Récupère la dernière émotion de l'historique au chargement
  React.useEffect(() => {
    if (history && history.length > 0) {
      setLatestEmotion(history[0]);
    }
  }, [history]);

  // Handler mis à jour pour capturer l'émotion la plus récente
  const handleEmotionSaved = (emotion: Emotion) => {
    setLatestEmotion(emotion);
    handleScanSaved(emotion);
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scan émotionnel</h1>
        <div className="flex justify-center my-12">
          <LoadingAnimation text="Chargement des données..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scan émotionnel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          {isAdmin && <TabsTrigger value="equipe">Équipe</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="personnel" className="mt-6">
          <EmotionScanForm onScanSaved={handleEmotionSaved} />
          <MusicRecommendation emotion={latestEmotion} />
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <EmotionScanLive onResultSaved={handleEmotionSaved} />
          <MusicRecommendation emotion={latestEmotion} />
        </TabsContent>
        
        <TabsContent value="historique" className="mt-6">
          <EmotionHistory history={history} />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="equipe" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <TeamOverview users={users} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ScanPage;
