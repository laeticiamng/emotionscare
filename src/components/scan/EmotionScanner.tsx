
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MessageSquare, Smile } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import LiveVoiceScanner from './live/LiveVoiceScanner';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import EmotionScanResult from './EmotionScanResult';
import { motion } from 'framer-motion';

interface EmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  defaultTab?: 'voice' | 'text' | 'emoji';
  showResults?: boolean;
  showHistory?: boolean;
  className?: string;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onResult,
  defaultTab = 'voice',
  showResults = true,
  showHistory = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalysisComplete = (result: EmotionResult) => {
    setScanResult(result);
    
    if (onResult) {
      onResult(result);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isProcessing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          Scanner d'émotions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice" className="flex items-center gap-2" disabled={isProcessing}>
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voix</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2" disabled={isProcessing}>
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="emoji" className="flex items-center gap-2" disabled={isProcessing}>
              <Smile className="h-4 w-4" />
              <span className="hidden sm:inline">Emoji</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="voice" className="m-0">
              <LiveVoiceScanner 
                onScanComplete={handleAnalysisComplete}
                onResult={handleAnalysisComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </TabsContent>
            
            <TabsContent value="text" className="m-0">
              <TextEmotionScanner 
                onResult={handleAnalysisComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </TabsContent>
            
            <TabsContent value="emoji" className="m-0">
              <EmojiEmotionScanner 
                onResult={handleAnalysisComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </TabsContent>
          </div>
        </Tabs>

        {showResults && scanResult && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <EmotionScanResult result={scanResult} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
