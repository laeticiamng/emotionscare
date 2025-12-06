// @ts-nocheck

import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiSelector from '../EmojiSelector';
import EmotionTextInput from '../EmotionTextInput';
import AudioRecorder from '../AudioRecorder';

interface StandardModeFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  text: string;
  charCount: number;
  maxChars: number;
  emojis: string;
  audioUrl: string | null;
  onTextChange: (text: string) => void;
  onEmojiClick: (emoji: string) => void;
  onClearEmojis: () => void;
  setAudioUrl: (url: string | null) => void;
  isConfidential: boolean;
  setIsConfidential: (isConfidential: boolean) => void;
  shareWithCoach: boolean;
  setShareWithCoach: (shareWithCoach: boolean) => void;
  onSubmit: () => void;
  analyzing: boolean;
  onClose?: () => void;
}

const StandardModeForm: React.FC<StandardModeFormProps> = ({
  activeTab,
  setActiveTab,
  text,
  charCount,
  maxChars,
  emojis,
  audioUrl,
  onTextChange,
  onEmojiClick,
  onClearEmojis,
  setAudioUrl,
  isConfidential,
  setIsConfidential,
  shareWithCoach,
  setShareWithCoach,
  onSubmit,
  analyzing,
  onClose
}) => {
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 pt-4">
          <EmotionTextInput 
            value={text} 
            onChange={onTextChange}
            maxChars={maxChars} 
          />
          <div className="text-right text-sm text-muted-foreground">
            {charCount}/{maxChars} caractères
          </div>
        </TabsContent>
        
        <TabsContent value="emoji" className="space-y-4 pt-4">
          <EmojiSelector 
            emojis={emojis} 
            onEmojiClick={onEmojiClick} 
            onClear={onClearEmojis}
          />
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-4 pt-4">
          <AudioRecorder 
            audioUrl={audioUrl} 
            setAudioUrl={setAudioUrl} 
          />
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confidential"
              checked={isConfidential}
              onChange={() => setIsConfidential(!isConfidential)}
              className="rounded border-gray-300"
            />
            <label htmlFor="confidential" className="text-sm">Confidentiel</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="shareWithCoach"
              checked={shareWithCoach}
              onChange={() => setShareWithCoach(!shareWithCoach)}
              className="rounded border-gray-300"
            />
            <label htmlFor="shareWithCoach" className="text-sm">Partager avec Coach</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        )}
        <Button 
          onClick={onSubmit} 
          disabled={analyzing} 
          className="bg-wellness-coral hover:bg-wellness-coral/90 text-white"
        >
          {analyzing ? "Analyse en cours..." : "Analyser mon état"}
        </Button>
      </div>
    </>
  );
};

export default StandardModeForm;
