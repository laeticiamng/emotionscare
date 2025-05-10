
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, HistoryIcon, RefreshCw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useScanPage } from '@/hooks/useScanPage';
import EmotionScanner from '@/components/scan/EmotionScanner';
import ScanTabContent from '@/components/scan/ScanTabContent';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const scanHook = useScanPage();
  const [showScanForm, setShowScanForm] = useState<boolean>(false);
  const [scanText, setScanText] = useState<string>('');
  const [scanEmojis, setScanEmojis] = useState<string>('');
  const [scanAudio, setScanAudio] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleScanSaved = () => {
    setShowScanForm(false);
    scanHook.refreshEmotions();
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Ici, nous simulons une analyse pour la démonstration
    setTimeout(() => {
      setIsAnalyzing(false);
      handleScanSaved();
      setScanText('');
      setScanEmojis('');
      setScanAudio(null);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Scan émotionnel</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={scanHook.refreshEmotions}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md mx-auto">
          <TabsTrigger value="new">Nouveau scan</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {showScanForm ? (
            <Card className="shadow-md rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <EmotionScanner
                  text={scanText}
                  emojis={scanEmojis}
                  audioUrl={scanAudio}
                  onTextChange={setScanText}
                  onEmojiChange={setScanEmojis}
                  onAudioChange={setScanAudio}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6 text-2xl">Prêt pour un nouveau scan émotionnel?</div>
              <Button
                size="lg"
                onClick={() => setShowScanForm(true)}
                className="gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Commencer un scan
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ScanTabContent
            userId={user?.id || ''}
            showScanForm={showScanForm}
            setShowScanForm={setShowScanForm}
            handleScanSaved={handleScanSaved}
            onResultSaved={scanHook.refreshEmotions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
