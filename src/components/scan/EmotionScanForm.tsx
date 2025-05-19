
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types/emotion';

// Import necessary components and placeholders
const TextEmotionScanner = ({ onResult, onProcessingChange }: { 
  onResult: (result: EmotionResult) => void;
  onProcessingChange: (isProcessing: boolean) => void; 
}) => (
  <div>
    <p className="text-center mb-4">Saisissez un texte pour analyser votre émotion</p>
    <Button onClick={() => {
      onProcessingChange(true);
      setTimeout(() => {
        onResult({ 
          emotion: 'Joie', 
          confidence: 0.85,
          analysis: 'Texte positif et optimiste',
          suggestions: ['Cultivez cette énergie positive', 'Partagez votre joie']
        });
        onProcessingChange(false);
      }, 1500);
    }} className="w-full">
      Analyser le texte de démonstration
    </Button>
  </div>
);

// Similarly for other scanner components with proper props
const FacialEmotionScanner = ({ onResult, onProcessingChange }: { 
  onResult: (result: EmotionResult) => void;
  onProcessingChange: (isProcessing: boolean) => void; 
}) => (
  <div className="text-center">
    <p className="mb-4">Utilisez votre caméra pour analyser votre expression faciale</p>
    <Button onClick={() => {
      onProcessingChange(true);
      setTimeout(() => {
        onResult({ 
          emotion: 'Neutre', 
          confidence: 0.72,
          analysis: 'Expression faciale neutre détectée',
          suggestions: ['Essayez de sourire', 'Prenez une pause relaxante']
        });
        onProcessingChange(false);
      }, 1500);
    }} className="w-full">
      Simulation analyse faciale
    </Button>
  </div>
);

const VoiceEmotionScanner = ({ onResult, onProcessingChange }: { 
  onResult: (result: EmotionResult) => void;
  onProcessingChange: (isProcessing: boolean) => void; 
}) => (
  <div className="text-center">
    <p className="mb-4">Parlez pour analyser les émotions dans votre voix</p>
    <Button onClick={() => {
      onProcessingChange(true);
      setTimeout(() => {
        onResult({ 
          emotion: 'Calme', 
          confidence: 0.65,
          analysis: 'Voix posée et calme détectée',
          suggestions: ['Gardez cette sérénité', 'Pratiquez la pleine conscience']
        });
        onProcessingChange(false);
      }, 1500);
    }} className="w-full">
      Simulation analyse vocale
    </Button>
  </div>
);

interface EmotionScanFormProps {
  onResult: (result: EmotionResult) => void;
}

export const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onResult }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing);
  };

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <Tabs 
          defaultValue="text" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="facial">Visage</TabsTrigger>
            <TabsTrigger value="voice">Voix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-0 space-y-4">
            <TextEmotionScanner 
              onResult={onResult} 
              onProcessingChange={handleProcessingChange} 
            />
          </TabsContent>
          
          <TabsContent value="facial" className="mt-0 space-y-4">
            <FacialEmotionScanner 
              onResult={onResult} 
              onProcessingChange={handleProcessingChange} 
            />
          </TabsContent>
          
          <TabsContent value="voice" className="mt-0 space-y-4">
            <VoiceEmotionScanner 
              onResult={onResult} 
              onProcessingChange={handleProcessingChange} 
            />
          </TabsContent>
        </Tabs>
        
        {isProcessing && (
          <div className="flex justify-center mt-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}
      </motion.div>
    </Card>
  );
};

export default EmotionScanForm;
