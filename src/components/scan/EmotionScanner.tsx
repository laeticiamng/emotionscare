
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';
import { MessageSquare, Smile, Mic, Webcam } from 'lucide-react';

interface EmotionScannerProps {
  text: string;
  emojis: string;
  audioUrl: string | null;
  onTextChange: (text: string) => void;
  onEmojiChange: (emojis: string) => void;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  text,
  emojis,
  audioUrl,
  onTextChange,
  onEmojiChange,
  onAudioChange,
  onAnalyze,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  
  const handleFacialEmotionDetected = (emotion: any) => {
    if (emotion.dominantEmotion) {
      // Map the emotion to relevant emoji
      const emotionToEmoji: Record<string, string> = {
        'happy': '😊',
        'sad': '😔',
        'angry': '😠',
        'fearful': '😨',
        'surprised': '😲',
        'disgusted': '🤢',
        'neutral': '😐',
        'calm': '😌',
        'anxious': '😰',
        'stressed': '😩',
        'tired': '😴',
        'bored': '🥱'
      };
      
      const emoji = emotionToEmoji[emotion.dominantEmotion] || '😐';
      
      // Add the emoji to our emojis
      if (!emojis.includes(emoji)) {
        onEmojiChange(emojis + emoji);
      }
      
      // Add a simple text description if text field is empty
      if (!text) {
        const emotionTexts: Record<string, string> = {
          'happy': "Je me sens heureux aujourd'hui.",
          'sad': "Je ressens de la tristesse.",
          'angry': "Je suis en colère.",
          'fearful': "J'ai peur en ce moment.",
          'surprised': "Je suis surpris.",
          'disgusted': "Je suis dégoûté.",
          'neutral': "Je me sens neutre.",
          'calm': "Je me sens calme et serein.",
          'anxious': "Je ressens de l'anxiété.",
          'stressed': "Je me sens stressé.",
          'tired': "Je me sens fatigué.",
          'bored': "Je m'ennuie."
        };
        
        onTextChange(emotionTexts[emotion.dominantEmotion] || "Je ressens des émotions que j'ai du mal à décrire.");
      }
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="text" className="flex flex-col py-2 px-1 h-auto items-center">
          <MessageSquare className="h-4 w-4 mb-1" />
          <span className="text-xs">Texte</span>
        </TabsTrigger>
        <TabsTrigger value="emoji" className="flex flex-col py-2 px-1 h-auto items-center">
          <Smile className="h-4 w-4 mb-1" />
          <span className="text-xs">Emoji</span>
        </TabsTrigger>
        <TabsTrigger value="audio" className="flex flex-col py-2 px-1 h-auto items-center">
          <Mic className="h-4 w-4 mb-1" />
          <span className="text-xs">Audio</span>
        </TabsTrigger>
        <TabsTrigger value="facial" className="flex flex-col py-2 px-1 h-auto items-center">
          <Webcam className="h-4 w-4 mb-1" />
          <span className="text-xs">Facial</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="text">
        <TextEmotionScanner 
          text={text}
          onChange={onTextChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </TabsContent>
      
      <TabsContent value="emoji">
        <EmojiEmotionScanner 
          emojis={emojis}
          onChange={onEmojiChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </TabsContent>
      
      <TabsContent value="audio">
        <AudioEmotionScanner 
          audioUrl={audioUrl}
          setAudioUrl={onAudioChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </TabsContent>
      
      <TabsContent value="facial">
        <FacialEmotionScanner 
          onEmotionDetected={handleFacialEmotionDetected}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmotionScanner;
