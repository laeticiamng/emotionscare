
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScanTabContent from '@/components/scan/ScanTabContent';
import HistoryTabContent from '@/components/scan/HistoryTabContent';

const ScanPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Scanner d'Émotions</h1>
      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scanner</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="scan">
          <ScanTabContent />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
