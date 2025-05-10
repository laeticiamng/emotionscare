
import React, { useState } from 'react';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { analyzeEmotion } from '@/lib/scanService';

interface EmotionScannerProps {
  userId: string;
  onScanComplete?: (emotion: EmotionResult) => void;
  onShowResult?: () => void;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  userId,
  onScanComplete,
  onShowResult
}) => {
  const [activeTab, setActiveTab] = useState<string>('text');

  const handleTextScan = async (text: string) => {
    try {
      const result = await analyzeEmotion({
        user_id: userId, // Utiliser user_id au lieu de userId
        text
      });
      
      if (onScanComplete) {
        onScanComplete(result);
      }
      
      if (onShowResult) {
        onShowResult();
      }
      
      return result;
    } catch (error) {
      console.error('Error analyzing text emotion:', error);
      throw error;
    }
  };

  const handleEmojiScan = async (emojis: string) => {
    try {
      const result = await analyzeEmotion({
        user_id: userId, // Utiliser user_id au lieu de userId
        emojis
      });
      
      if (onScanComplete) {
        onScanComplete(result);
      }
      
      if (onShowResult) {
        onShowResult();
      }
      
      return result;
    } catch (error) {
      console.error('Error analyzing emoji emotion:', error);
      throw error;
    }
  };

  const handleAudioScan = async (audioUrl: string) => {
    try {
      const result = await analyzeEmotion({
        user_id: userId, // Utiliser user_id au lieu de userId
        audio_url: audioUrl
      });
      
      if (onScanComplete) {
        onScanComplete(result);
      }
      
      if (onShowResult) {
        onShowResult();
      }
      
      return result;
    } catch (error) {
      console.error('Error analyzing audio emotion:', error);
      throw error;
    }
  };
  
  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="emoji">Émoji</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <TextEmotionScanner onScan={handleTextScan} />
        </TabsContent>
        
        <TabsContent value="emoji">
          <EmojiEmotionScanner onScan={handleEmojiScan} />
        </TabsContent>
        
        <TabsContent value="audio">
          <AudioEmotionScanner onScan={handleAudioScan} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmotionScanner;
