
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

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

  // Déterminer quel contenu est présent
  const contentStatus = {
    text: text.length > 0,
    emoji: emojis.length > 0,
    audio: !!audioUrl
  };

  // Récapitulatif du contenu
  const contentSummary = [
    contentStatus.text ? `Texte (${text.length} caractères)` : '',
    contentStatus.emoji ? `Emojis (${emojis.length})` : '',
    contentStatus.audio ? 'Audio' : ''
  ].filter(Boolean).join(', ');

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="text" disabled={isAnalyzing} className="relative">
            Texte
            {contentStatus.text && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="emoji" disabled={isAnalyzing} className="relative">
            Emojis
            {contentStatus.emoji && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="audio" disabled={isAnalyzing} className="relative">
            Audio
            {contentStatus.audio && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <TextEmotionScanner
            text={text}
            onTextChange={onTextChange}
            disabled={isAnalyzing}
          />
        </TabsContent>
        
        <TabsContent value="emoji" className="mt-4">
          <EmojiEmotionScanner
            selectedEmojis={emojis}
            onEmojiSelect={(emoji) => onEmojiChange(emojis + emoji)}
            onClearEmojis={() => onEmojiChange('')}
            disabled={isAnalyzing}
          />
        </TabsContent>
        
        <TabsContent value="audio" className="mt-4">
          <AudioEmotionScanner
            audioUrl={audioUrl}
            onAudioChange={onAudioChange}
            disabled={isAnalyzing}
          />
        </TabsContent>
      </Tabs>
      
      {hasContent && (
        <div className="mt-4 bg-muted/30 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Données à analyser :</span> {contentSummary}
          </p>
        </div>
      )}
      
      <Button 
        onClick={onAnalyze}
        disabled={isAnalyzing || !hasContent}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyser mon état émotionnel
          </>
        )}
      </Button>
    </div>
  );
};

export default EmotionScanner;
