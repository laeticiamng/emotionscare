
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  analysis: string;
  recommendations: string[];
}

const ScanPage: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<EmotionResult[]>([]);
  const { user } = useAuth();

  const emotions = [
    '😊', '😢', '😡', '😰', '😴', '🤔', '😍', '🤗',
    '😌', '😓', '😤', '🥺', '😆', '😔', '🙄', '😎'
  ];

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const analyzeEmotion = async () => {
    if (!textInput.trim() && selectedEmojis.length === 0) {
      toast.error('Veuillez saisir du texte ou sélectionner des émojis');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: {
          text: textInput,
          emojis: selectedEmojis,
          userId: user?.id
        }
      });

      if (error) throw error;

      const emotionResult: EmotionResult = {
        emotion: data.emotion || 'Neutre',
        confidence: data.confidence || 0.8,
        intensity: data.intensity || 5,
        analysis: data.analysis || 'Analyse en cours...',
        recommendations: data.recommendations || []
      };

      setResult(emotionResult);
      setAnalysisHistory(prev => [emotionResult, ...prev.slice(0, 4)]);

      // Sauvegarder dans la base de données
      if (user) {
        await supabase.from('emotions').insert({
          user_id: user.id,
          text: textInput,
          emojis: selectedEmojis.join(''),
          score: emotionResult.intensity,
          ai_feedback: emotionResult.analysis,
          date: new Date().toISOString()
        });
      }

      toast.success('Analyse émotionnelle terminée !');
    } catch (error) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse émotionnelle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setTextInput('');
    setSelectedEmojis([]);
    setResult(null);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'Joyeux': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Triste': 'bg-blue-100 text-blue-800 border-blue-300',
      'Colère': 'bg-red-100 text-red-800 border-red-300',
      'Anxieux': 'bg-orange-100 text-orange-800 border-orange-300',
      'Calme': 'bg-green-100 text-green-800 border-green-300',
      'Neutre': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[emotion] || colors['Neutre'];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Scanner d'Émotions</h1>
          <p className="text-muted-foreground">Analysez votre état émotionnel avec l'IA</p>
        </div>
      </div>

      {/* Interface de scan */}
      <Card>
        <CardHeader>
          <CardTitle>Exprimez vos émotions</CardTitle>
          <CardDescription>
            Décrivez comment vous vous sentez ou sélectionnez des émojis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Comment vous sentez-vous ? Décrivez votre humeur...
            </label>
            <Textarea
              placeholder="Ex: Je me sens un peu stressé aujourd'hui à cause du travail, mais aussi excité par mes projets..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Sélectionnez des émojis qui correspondent à votre humeur
            </label>
            <div className="grid grid-cols-8 gap-2">
              {emotions.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                  className="text-2xl h-12 w-12 p-0"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            {selectedEmojis.length > 0 && (
              <div className="mt-2 flex gap-1">
                <span className="text-sm text-muted-foreground">Sélectionnés:</span>
                <span className="text-lg">{selectedEmojis.join(' ')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={analyzeEmotion} 
              disabled={isAnalyzing || (!textInput.trim() && selectedEmojis.length === 0)}
              className="flex-1"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser mes émotions'}
            </Button>
            
            <Button variant="outline" onClick={resetScan}>
              Nouveau scan
            </Button>
          </div>

          {/* Autres méthodes d'analyse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Mic className="h-4 w-4" />
              Analyse vocale
              <Badge variant="secondary" className="text-xs">Bientôt</Badge>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Camera className="h-4 w-4" />
              Analyse faciale
              <Badge variant="secondary" className="text-xs">Bientôt</Badge>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Upload className="h-4 w-4" />
              Import fichier
              <Badge variant="secondary" className="text-xs">Bientôt</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de l'analyse */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Résultats de l'analyse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getEmotionColor(result.emotion)}`}>
                  <span className="font-medium">{result.emotion}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Émotion principale</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(result.confidence * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Confiance</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {result.intensity}/10
                </div>
                <p className="text-sm text-muted-foreground">Intensité</p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Analyse détaillée</h4>
              <p className="text-sm text-muted-foreground">{result.analysis}</p>
            </div>

            {result.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommandations</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique des analyses */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
            <CardDescription>Vos dernières analyses émotionnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.map((analysis, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getEmotionColor(analysis.emotion)}`}>
                      {analysis.emotion}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Intensité: {analysis.intensity}/10
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(analysis.confidence * 100)}% de confiance
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanPage;
