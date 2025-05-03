
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmojiSelector from '@/components/scan/EmojiSelector';
import EmotionTextInput from '@/components/scan/EmotionTextInput';
import AudioRecorder from '@/components/scan/AudioRecorder';

interface EmotionInputFormProps {
  emojis: string;
  text: string;
  audioUrl: string | null;
  onEmojiClick: (emoji: string) => void;
  onEmojisChange: (emojis: string) => void; 
  onTextChange: (text: string) => void;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

const EmotionInputForm: React.FC<EmotionInputFormProps> = ({
  emojis,
  text,
  audioUrl,
  onEmojiClick,
  onEmojisChange,
  onTextChange,
  onAudioChange,
  onAnalyze,
  analyzing
}) => {
  const formIsEmpty = !emojis && !text && !audioUrl;
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
          <CardDescription>Utilisez des emojis pour exprimer votre humeur</CardDescription>
        </CardHeader>
        <CardContent>
          <EmojiSelector 
            emojis={emojis} 
            onEmojiClick={onEmojiClick} 
            onClear={() => onEmojisChange('')}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Décrivez votre état</CardTitle>
          <CardDescription>Partagez vos ressentis en quelques mots</CardDescription>
        </CardHeader>
        <CardContent>
          <EmotionTextInput 
            value={text} 
            onChange={onTextChange}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
          <CardDescription>Enregistrez un message vocal pour exprimer votre ressenti</CardDescription>
        </CardHeader>
        <CardContent>
          <AudioRecorder 
            audioUrl={audioUrl} 
            setAudioUrl={onAudioChange} 
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          onClick={onAnalyze}
          disabled={analyzing || formIsEmpty}
          className="w-full max-w-md gap-2"
          size="lg"
        >
          {analyzing ? "Analyse en cours..." : "Analyser mon état"}
        </Button>
      </div>
    </div>
  );
};

export default EmotionInputForm;
