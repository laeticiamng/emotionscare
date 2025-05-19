
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextEmotionScanner from './TextEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import EmotionScanResult from './EmotionScanResult';
import { EmotionResult } from '@/types/emotion';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Smile, Mic, Camera, MessageSquare } from 'lucide-react';

interface EmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  defaultMethod?: 'text' | 'audio' | 'facial' | 'emoji';
  className?: string;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  defaultMethod = 'emoji',
  className,
}) => {
  const [scanMethod, setScanMethod] = useState<'text' | 'audio' | 'facial' | 'emoji'>(defaultMethod);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    setScanResult(result);
    if (onScanComplete) {
      onScanComplete(result);
    }
  };

  const resetScan = () => {
    setScanResult(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-primary" />
          Scanner vos émotions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Tabs value={scanMethod} onValueChange={(value) => setScanMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="emoji" disabled={isProcessing}>
                    <Smile className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Emoji</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" disabled={isProcessing}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Texte</span>
                  </TabsTrigger>
                  <TabsTrigger value="audio" disabled={isProcessing}>
                    <Mic className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Audio</span>
                  </TabsTrigger>
                  <TabsTrigger value="facial" disabled={isProcessing}>
                    <Camera className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Visage</span>
                  </TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="emoji">
                    <EmojiEmotionScanner 
                      onScanComplete={handleScanComplete}
                      onCancel={resetScan}
                      onResult={handleScanComplete}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      onProcessingChange={setIsProcessing}
                    />
                  </TabsContent>
                  <TabsContent value="text">
                    <TextEmotionScanner 
                      onScanComplete={handleScanComplete}
                      onCancel={resetScan}
                    />
                  </TabsContent>
                  <TabsContent value="audio">
                    <AudioEmotionScanner 
                      onScanComplete={handleScanComplete}
                      onCancel={resetScan}
                    />
                  </TabsContent>
                  <TabsContent value="facial">
                    <FacialEmotionScanner 
                      onScanComplete={handleScanComplete}
                      onCancel={resetScan}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmotionScanResult 
                result={scanResult}
                onContinue={resetScan}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
