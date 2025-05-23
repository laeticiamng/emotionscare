
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Mic, MicOff, Send, Brain, Heart, Smile, Frown, Meh, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmotionResult {
  score: number;
  primaryEmotion: string;
  secondaryEmotions: string[];
  stressLevel: 'low' | 'medium' | 'high';
  aiFeedback: string;
  recommendations: string[];
  immediateActions: string[];
}

const EmotionScanner: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [analysisMethod, setAnalysisMethod] = useState<'text' | 'audio'>('text');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        analyzeAudio();
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Enregistrement commencé');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Enregistrement terminé, analyse en cours...');
    }
  };

  const analyzeAudio = async () => {
    setIsAnalyzing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('method', 'audio');

      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: formData
      });

      if (error) throw error;
      
      handleAnalysisResult(data);
    } catch (error) {
      console.error('Audio analysis error:', error);
      toast.error('Erreur lors de l\'analyse audio');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: {
          text: textInput,
          method: 'text'
        }
      });

      if (error) throw error;
      
      handleAnalysisResult(data);
    } catch (error) {
      console.error('Text analysis error:', error);
      toast.error('Erreur lors de l\'analyse textuelle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysisResult = async (analysisData: any) => {
    try {
      // Sauvegarder le résultat dans la base de données
      if (user) {
        const { error } = await supabase
          .from('emotions')
          .insert({
            user_id: user.id,
            text: analysisMethod === 'text' ? textInput : analysisData.rawData?.text || '',
            score: analysisData.score,
            ai_feedback: analysisData.aiFeedback,
            emojis: analysisData.primaryEmotion
          });

        if (error) throw error;
      }

      setResult(analysisData);
      toast.success('Analyse terminée !');
      
      // Réinitialiser les inputs
      setTextInput('');
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionLower = emotion.toLowerCase();
    if (emotionLower.includes('joie') || emotionLower.includes('bonheur')) {
      return <Smile className="h-6 w-6 text-green-500" />;
    } else if (emotionLower.includes('tristesse') || emotionLower.includes('colère')) {
      return <Frown className="h-6 w-6 text-red-500" />;
    } else {
      return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStressLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Faible';
      case 'medium': return 'Modéré';
      case 'high': return 'Élevé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Scanner d'Émotions IA
          </CardTitle>
          <CardDescription>
            Analysez votre état émotionnel par texte ou par voix
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={analysisMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setAnalysisMethod('text')}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              Analyse Textuelle
            </Button>
            <Button
              variant={analysisMethod === 'audio' ? 'default' : 'outline'}
              onClick={() => setAnalysisMethod('audio')}
              className="flex-1"
            >
              <Mic className="mr-2 h-4 w-4" />
              Analyse Vocale
            </Button>
          </div>

          {/* Text Analysis */}
          {analysisMethod === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comment vous sentez-vous aujourd'hui ?
                </label>
                <Textarea
                  placeholder="Décrivez votre humeur, vos émotions, votre journée..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[120px]"
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={analyzeText}
                disabled={isAnalyzing || !textInput.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
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

          {/* Audio Analysis */}
          {analysisMethod === 'audio' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="mb-4">
                  {isRecording ? (
                    <div className="animate-pulse">
                      <Mic className="h-16 w-16 text-red-500 mx-auto" />
                    </div>
                  ) : (
                    <MicOff className="h-16 w-16 text-muted-foreground mx-auto" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRecording 
                    ? 'Enregistrement en cours... Parlez naturellement'
                    : 'Cliquez pour commencer l\'enregistrement vocal'
                  }
                </p>
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isAnalyzing}
                  variant={isRecording ? 'destructive' : 'default'}
                  className="w-full max-w-sm"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Arrêter l'enregistrement
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Commencer l'enregistrement
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Résultats de l'Analyse
            </CardTitle>
            <CardDescription>
              Votre profil émotionnel du moment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score global */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.score}/100</div>
              <p className="text-muted-foreground">Score de bien-être émotionnel</p>
              <Progress value={result.score} className="mt-4" />
            </div>

            {/* Émotions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getEmotionIcon(result.primaryEmotion)}
                  <h4 className="font-medium">Émotion Principale</h4>
                </div>
                <p className="text-lg font-semibold">{result.primaryEmotion}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Niveau de Stress</h4>
                <Badge className={getStressColor(result.stressLevel)}>
                  {getStressLabel(result.stressLevel)}
                </Badge>
              </div>
            </div>

            {/* Émotions secondaires */}
            {result.secondaryEmotions && result.secondaryEmotions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Émotions Secondaires</h4>
                <div className="flex flex-wrap gap-2">
                  {result.secondaryEmotions.map((emotion, index) => (
                    <Badge key={index} variant="outline">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback IA */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Analyse IA</h4>
              <p className="text-sm">{result.aiFeedback}</p>
            </div>

            {/* Recommandations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommandations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions immédiates */}
            {result.immediateActions && result.immediateActions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Actions Immédiates</h4>
                <div className="grid gap-2">
                  {result.immediateActions.map((action, index) => (
                    <Button key={index} variant="outline" size="sm" className="justify-start">
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionScanner;
