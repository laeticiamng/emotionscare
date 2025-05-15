
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotion } from '@/lib/ai/journal-service';

interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onResult }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez écrire quelques phrases pour l'analyse émotionnelle.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Appel à l'API pour analyser le texte
      const response = await analyzeEmotionalJournal(text);
      
      // Création d'un résultat d'émotion à partir de la réponse de l'API
      const result: EmotionResult = {
        id: Math.random().toString(36).substring(2, 11),
        emotion: response.emotion || 'neutral',
        score: response.intensity || 0.5,
        confidence: response.confidence || 0.8,
        text: text,
        date: new Date().toISOString(),
        emojis: ['😊', '😌', '🙂'], // Emoji par défaut
        recommendations: [
          "Essayez d'écouter de la musique apaisante",
          "Prenez un moment pour vous aujourd'hui"
        ]
      };
      
      onResult(result);
      
      toast({
        title: "Analyse terminée",
        description: `Émotion détectée : ${result.emotion} avec une intensité de ${Math.round(result.score * 100)}%`,
      });
      
      setText('');
      
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre texte. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Décrivez comment vous vous sentez aujourd'hui, ou partagez quelque chose qui s'est produit récemment..."
              className="min-h-[150px] resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="min-w-[200px]"
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser mon état émotionnel'
              )}
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Écrivez quelques phrases pour obtenir une analyse de votre état émotionnel et des suggestions personnalisées.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default TextEmotionScanner;

// Fonction pour analyser le journal émotionnel
async function analyzeEmotionalJournal(text: string): Promise<{
  emotion?: string;
  intensity?: number;
  confidence?: number;
}> {
  // Dans une implémentation réelle, ceci appelerait l'API
  // Pour l'instant, simulons une réponse
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logique simplifiée de détection basée sur des mots-clés
      const text_lower = text.toLowerCase();
      let emotion = 'neutral';
      let intensity = 0.5;
      
      if (text_lower.includes('joie') || 
          text_lower.includes('heureux') || 
          text_lower.includes('content') || 
          text_lower.includes('bien')) {
        emotion = 'joy';
        intensity = 0.8;
      } else if (text_lower.includes('triste') || 
                 text_lower.includes('peine') || 
                 text_lower.includes('mal')) {
        emotion = 'sadness';
        intensity = 0.7;
      } else if (text_lower.includes('stress') || 
                 text_lower.includes('anxie') || 
                 text_lower.includes('inquiet')) {
        emotion = 'anxiety';
        intensity = 0.75;
      } else if (text_lower.includes('calme') || 
                 text_lower.includes('apais') || 
                 text_lower.includes('serein')) {
        emotion = 'calm';
        intensity = 0.9;
      } else if (text_lower.includes('colère') || 
                 text_lower.includes('énerv') || 
                 text_lower.includes('agac')) {
        emotion = 'anger';
        intensity = 0.6;
      }
      
      resolve({
        emotion,
        intensity,
        confidence: 0.8
      });
    }, 1500);
  });
}
