
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Shell from '@/Shell';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import { EmotionResult } from '@/types';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';

interface ScanPageHeaderProps {
  showScanForm: boolean;
  activeTab: string;
  setShowScanForm: (show: boolean) => void;
}

const ScanPage: React.FC = () => {
  const [showScanForm, setShowScanForm] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);

  // Mock data for demonstration purposes
  const mockEmotionHistory: EmotionResult[] = [
    {
      id: '1',
      date: '2025-05-13T10:45:00Z',
      emotion: 'joy',
      score: 0.85,
      text: 'I feel great today!'
    },
    {
      id: '2',
      date: '2025-05-12T15:30:00Z',
      emotion: 'calm',
      score: 0.65,
      text: 'Pretty relaxed afternoon'
    },
  ];

  return (
    <Shell>
      <div className="container py-6">
        <ScanPageHeader 
          showScanForm={showScanForm} 
          activeTab={activeTab}
          setShowScanForm={setShowScanForm}
        />
        
        <Tabs
          defaultValue="scan"
          className="mt-6"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scanner</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="mt-6">
            {showScanForm ? (
              <EmotionScanForm onComplete={(result) => {
                setShowScanForm(false);
                setEmotionHistory(prev => [result, ...prev]);
              }} />
            ) : (
              <UnifiedEmotionCheckin />
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryTabContent emotionHistory={mockEmotionHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default ScanPage;
