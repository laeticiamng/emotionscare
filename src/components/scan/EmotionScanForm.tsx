import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { EmotionResult } from '@/types/emotion';
import { Badge } from '@/types/gamification';
import { confetti } from '@/lib/confetti';

interface EmotionScanFormProps {
  userId: string;
  onClose?: () => void;
  onScanComplete?: (emotionResult: EmotionResult) => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ userId, onClose, onScanComplete }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<EmotionResult | null>(null);
  
  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate emotion analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock analysis result
    const mockEmotions = ['joy', 'sadness', 'anger', 'calm', 'anxiety'];
    const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
    const mockResult: EmotionResult = {
      emotion: randomEmotion,
      score: Math.random() * 0.5 + 0.5,
      confidence: Math.random() * 0.3 + 0.7,
      text: text,
      ai_feedback: "Votre état émotionnel semble être...",
    };
    
    setAnalysisResult(mockResult);
    
    try {
      // Process badges
      const badges = await processEmotionForBadges(userId, mockResult);
      
      // Display badges earned
      if (badges && badges.length > 0) {
        confetti();
        toast({
          title: "Badges débloqués!",
          description: `Vous avez gagné: ${badges.map(b => b.name).join(", ")}`,
          variant: "success",
        });
      }
      
      // Trigger callback
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
    } catch (error) {
      console.error('Error processing emotion scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le scan émotionnel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCorrection = () => {
    setAnalysisResult(null);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nouveau scan émotionnel</h2>
      
      {analysisResult ? (
        <div className="space-y-6 bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              Confiance: {Math.round(analysisResult.confidence * 100)}%
            </Badge>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Émotion détectée</p>
              <p className="text-2xl font-bold">{analysisResult.emotion}</p>
            </div>
            
            {analysisResult.text && (
              <div>
                <p className="text-muted-foreground text-sm">Texte analysé</p>
                <p className="italic">"{analysisResult.text}"</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline"
            className="gap-2"
            onClick={handleCorrection}
          >
            Ce n'est pas ce que je ressens
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea 
            placeholder="Décrivez ce que vous ressentez..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionScanForm;
