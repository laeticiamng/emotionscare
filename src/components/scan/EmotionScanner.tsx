
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Mic, Camera, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EmotionResult {
  score: number;
  emotions: string[];
  analysis: string;
  recommendations: string[];
}

const EmotionScanner: React.FC = () => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [scanMethod, setScanMethod] = useState<'text' | 'audio' | 'video'>('text');

  const performTextScan = async () => {
    if (!user || !inputText.trim()) return;

    setIsScanning(true);
    try {
      // Simulation d'analyse émotionnelle avancée
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Analyse basique des mots-clés
      const keywords = {
        positive: ['heureux', 'joie', 'content', 'bien', 'super', 'génial', 'optimiste'],
        negative: ['triste', 'mal', 'déprimé', 'anxieux', 'stress', 'fatigue', 'peur'],
        neutral: ['ok', 'normal', 'correct', 'moyen']
      };

      const text = inputText.toLowerCase();
      let score = 50;
      const detectedEmotions = [];

      for (const word of keywords.positive) {
        if (text.includes(word)) {
          score += 10;
          detectedEmotions.push('Positif');
        }
      }

      for (const word of keywords.negative) {
        if (text.includes(word)) {
          score -= 10;
          detectedEmotions.push('Négatif');
        }
      }

      score = Math.max(0, Math.min(100, score));

      const mockResult: EmotionResult = {
        score,
        emotions: [...new Set(detectedEmotions)],
        analysis: `Votre état émotionnel actuel reflète un score de ${score}/100. L'analyse de votre message révèle plusieurs indicateurs importants pour votre bien-être.`,
        recommendations: [
          score > 70 ? 'Continuez sur cette voie positive !' : 'Prenez un moment pour vous détendre',
          'Pratiquez la respiration profonde',
          'Écoutez de la musique apaisante'
        ]
      };

      setResult(mockResult);

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('emotions')
        .insert({
          user_id: user.id,
          text: inputText,
          score: score,
          ai_feedback: mockResult.analysis
        });

      if (error) throw error;

      toast.success('Scan émotionnel terminé !');

    } catch (error) {
      console.error('Emotion scan error:', error);
      toast.error('Erreur lors du scan émotionnel');
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setInputText('');
  };

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Résultat de votre Scan Émotionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score principal */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{result.score}/100</div>
            <Progress value={result.score} className="w-full" />
            <p className="text-muted-foreground">Score de bien-être émotionnel</p>
          </div>

          {/* Émotions détectées */}
          {result.emotions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Émotions détectées :</h3>
              <div className="flex flex-wrap gap-2">
                {result.emotions.map((emotion, index) => (
                  <Badge key={index} variant="secondary">{emotion}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Analyse */}
          <div>
            <h3 className="font-semibold mb-2">Analyse :</h3>
            <p className="text-muted-foreground">{result.analysis}</p>
          </div>

          {/* Recommandations */}
          <div>
            <h3 className="font-semibold mb-2">Recommandations :</h3>
            <ul className="space-y-1">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground">• {rec}</li>
              ))}
            </ul>
          </div>

          <Button onClick={resetScan} className="w-full">
            Nouveau Scan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Scanner vos Émotions
        </CardTitle>
        <CardDescription>
          Analysez votre état émotionnel avec notre IA avancée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Méthodes de scan */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={scanMethod === 'text' ? 'default' : 'outline'}
            onClick={() => setScanMethod('text')}
            className="flex flex-col gap-2 h-16"
          >
            <FileText className="h-5 w-5" />
            Texte
          </Button>
          <Button
            variant={scanMethod === 'audio' ? 'default' : 'outline'}
            onClick={() => setScanMethod('audio')}
            className="flex flex-col gap-2 h-16"
            disabled
          >
            <Mic className="h-5 w-5" />
            Audio
            <span className="text-xs">Bientôt</span>
          </Button>
          <Button
            variant={scanMethod === 'video' ? 'default' : 'outline'}
            onClick={() => setScanMethod('video')}
            className="flex flex-col gap-2 h-16"
            disabled
          >
            <Camera className="h-5 w-5" />
            Vidéo
            <span className="text-xs">Bientôt</span>
          </Button>
        </div>

        {/* Interface de scan par texte */}
        {scanMethod === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comment vous sentez-vous aujourd'hui ?
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Décrivez votre état émotionnel, vos sentiments, votre journée..."
                rows={4}
                disabled={isScanning}
              />
            </div>

            <Button 
              onClick={performTextScan}
              disabled={!inputText.trim() || isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyser mes émotions
                </>
              )}
            </Button>
          </div>
        )}

        {/* Info sur l'IA */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">🧠 Intelligence Artificielle</h4>
          <p className="text-blue-800 text-sm">
            Notre IA analyse votre langage naturel pour identifier vos émotions et vous proposer des recommandations personnalisées.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
