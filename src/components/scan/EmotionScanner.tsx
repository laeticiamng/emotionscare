
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface EmotionScannerProps {
  text: string;
  emojis: string;
  audioUrl: string | null;
  onTextChange: (text: string) => void;
  onEmojiChange: (emojis: string) => void;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  className?: string;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  text,
  emojis,
  audioUrl,
  onTextChange,
  onEmojiChange,
  onAudioChange,
  onAnalyze,
  isAnalyzing = false,
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('text');
  const hasContent = !!text || !!emojis || !!audioUrl;

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="emoji">Emojis</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <TextEmotionScanner
            text={text}
            onTextChange={onTextChange}
          />
        </TabsContent>
        
        <TabsContent value="emoji" className="mt-4">
          <EmojiEmotionScanner
            selectedEmojis={emojis}
            onEmojiSelect={(emoji) => onEmojiChange(emojis + emoji)}
            onClearEmojis={() => onEmojiChange('')}
          />
        </TabsContent>
        
        <TabsContent value="audio" className="mt-4">
          <AudioEmotionScanner
            audioUrl={audioUrl}
            onAudioChange={onAudioChange}
          />
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={onAnalyze}
        disabled={isAnalyzing || !hasContent}
        className="w-full"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isAnalyzing ? "Analyse en cours..." : "Analyser mon état émotionnel"}
      </Button>
    </div>
  );
};

export default EmotionScanner;
