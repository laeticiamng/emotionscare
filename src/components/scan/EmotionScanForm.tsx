
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EmojiSelector from './EmojiSelector';
import EmotionTextInput from './EmotionTextInput';
import AudioRecorder from './AudioRecorder';
import AnalysisDialog from './AnalysisDialog';

export interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose?: () => void;
  onSaveComplete?: () => void; // Added for ScanPage.tsx compatibility
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onScanSaved, 
  onClose, 
  onSaveComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('text');
  const [emojis, setEmojis] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [isConfidential, setIsConfidential] = useState<boolean>(false);
  const [shareWithCoach, setShareWithCoach] = useState<boolean>(true);
  const [charCount, setCharCount] = useState<number>(0);
  const MAX_CHARS = 500;

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
  };

  const handleTextChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async () => {
    if (!emojis && !text && !audioUrl) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez ajouter au moins un emoji, du texte ou un enregistrement audio.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalyzing(true);
      
      // Dans une implémentation réelle, nous enverrions ces données à l'API
      const result = await analyzeEmotion({
        user_id: user?.id || '',
        emojis,
        text,
        audio_url: audioUrl,
        is_confidential: isConfidential,
        share_with_coach: shareWithCoach
      });
      
      toast({
        title: "Analyse complétée",
        description: `Votre état émotionnel: ${result.emotion}`,
      });
      
      onScanSaved();
      if (onSaveComplete) onSaveComplete();
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre état émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nouveau scan émotionnel</h2>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 pt-4">
          <EmotionTextInput 
            value={text} 
            onChange={handleTextChange}
            maxChars={MAX_CHARS} 
          />
          <div className="text-right text-sm text-muted-foreground">
            {charCount}/{MAX_CHARS} caractères
          </div>
        </TabsContent>
        
        <TabsContent value="emoji" className="space-y-4 pt-4">
          <EmojiSelector 
            emojis={emojis} 
            onEmojiClick={handleEmojiClick} 
            onClear={() => setEmojis('')}
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
          onClick={handleSubmit} 
          disabled={analyzing} 
          className="bg-wellness-coral hover:bg-wellness-coral/90 text-white"
        >
          {analyzing ? "Analyse en cours..." : "Analyser mon état"}
        </Button>
      </div>

      <AnalysisDialog 
        open={analyzing} 
        onOpenChange={(open) => !open && setAnalyzing(false)} 
      />
    </div>
  );
};

export default EmotionScanForm;
