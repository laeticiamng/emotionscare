import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import { EmotionResult } from '@/types/emotion';

interface ScanPageProps {
  
}

const ScanPage: React.FC<ScanPageProps> = () => {
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const { toast } = useToast();
  
  const handleScanComplete = (result: EmotionResult) => {
    setScanHistory(prevHistory => [result, ...prevHistory]);
    
    toast({
      title: "Analyse émotionnelle terminée",
      description: `Émotion principale détectée: ${result.dominantEmotion?.name || 'N/A'}`,
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <ScanPageHeader />
      
      <Tabs defaultvalue="scan" className="mt-4">
        <TabsList>
          <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="outline-none">
          <Card className="border-none shadow-none">
            <Card className="p-4">
              <UnifiedEmotionCheckin onScanComplete={handleScanComplete} />
            </Card>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="outline-none">
          <Card className="border-none shadow-none">
            <HistoryTabContent history={scanHistory} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
