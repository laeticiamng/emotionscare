
import React, { useState } from 'react';
import EmotionScanner from './EmotionScanner';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeEmotion, saveEmotion } from '@/lib/scanService';
import { useToast } from '@/components/ui/use-toast';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { Badge } from '@/types/gamification';

interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onScanSaved,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!text && !emojis && !audioUrl) {
      toast({
        title: "Données insuffisantes",
        description: "Veuillez fournir du texte, des emojis ou un enregistrement audio pour l'analyse.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer vos émotions.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeEmotion({
        user_id: user.id,
        text,
        emojis,
        audio_url: audioUrl || undefined,
        is_confidential: false,
        share_with_coach: true
      });
      
      if (result) {
        // Sauvegarder l'émotion
        await saveEmotion({
          user_id: user.id,
          date: new Date().toISOString(),
          emotion: result.emotion,
          score: result.score,
          text: text || result.text || undefined,
          emojis: emojis || result.emojis || undefined,
          audio_url: audioUrl || undefined,
          ai_feedback: result.feedback || result.ai_feedback
        });
        
        toast({
          title: "Analyse complétée",
          description: `Votre émotion dominante : ${result.emotion}`,
        });
        
        // Process emotion for gamification badges
        const earnedBadge = await processEmotionForBadges(
          user.id, 
          result.emotion,
          result.confidence || 0.5
        );
        
        // Show badge earned notification if applicable
        if (earnedBadge) {
          setTimeout(() => {
            toast({
              title: "🎉 Badge débloqué !",
              description: `Vous avez gagné le badge "${earnedBadge.name}"`,
            });
          }, 1000);
        }
        
        onScanSaved();
      }
      
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Scanner mon émotion</h2>
      
      <EmotionScanner
        text={text}
        emojis={emojis}
        audioUrl={audioUrl}
        onTextChange={setText}
        onEmojiChange={setEmojis}
        onAudioChange={setAudioUrl}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default EmotionScanForm;
