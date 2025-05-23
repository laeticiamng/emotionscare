
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Camera, FileText, Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmotionResult {
  score: number;
  primaryEmotion: string;
  secondaryEmotions: string[];
  stressLevel: 'low' | 'medium' | 'high';
  aiFeedback: string;
  recommendations: string[];
  timestamp: Date;
  method: 'text' | 'audio' | 'emoji' | 'facial';
}

const EmotionScanner: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeMethod, setActiveMethod] = useState<string>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const analyzeText = async () => {
    if (!textInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput, method: 'text' })
      });
      
      const result = await response.json();
      setResult(result);
      
      // Sauvegarder en base
      if (user) {
        await supabase.from('emotions').insert({
          user_id: user.id,
          text: textInput,
          score: result.score,
          ai_feedback: result.aiFeedback
        });
      }
      
      toast({
        title: "Analyse terminée",
        description: "Votre état émotionnel a été analysé",
        variant: "default"
      });
    } catch (error) {
      console.error('Text analysis error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le texte",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await analyzeAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant, nous analysons vos émotions",
        variant: "default"
      });
    } catch (error) {
      console.error('Audio recording error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('method', 'audio');
      
      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      setResult(result);
      
      if (user) {
        await supabase.from('emotions').insert({
          user_id: user.id,
          audio_url: result.audioUrl,
          score: result.score,
          ai_feedback: result.aiFeedback
        });
      }
      
      toast({
        title: "Analyse vocale terminée",
        description: "Votre état émotionnel vocal a été analysé",
        variant: "default"
      });
    } catch (error) {
      console.error('Audio analysis error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'audio",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startFacialAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Simuler l'analyse faciale (à implémenter avec une vraie API)
      setTimeout(() => {
        const mockResult: EmotionResult = {
          score: Math.floor(Math.random() * 100),
          primaryEmotion: ['joie', 'tristesse', 'colère', 'surprise'][Math.floor(Math.random() * 4)],
          secondaryEmotions: ['calme', 'anxiété'],
          stressLevel: 'medium',
          aiFeedback: "Analyse faciale terminée. Votre expression reflète un état émotionnel modéré.",
          recommendations: ["Prenez quelques respirations profondes", "Essayez une courte méditation"],
          timestamp: new Date(),
          method: 'facial'
        };
        
        setResult(mockResult);
        stream.getTracks().forEach(track => track.stop());
        setIsAnalyzing(false);
        
        toast({
          title: "Analyse faciale terminée",
          description: "Votre expression a été analysée",
          variant: "default"
        });
      }, 3000);
    } catch (error) {
      console.error('Facial analysis error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
      setIsAnalyzing(false);
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

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Scanner Émotionnel IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button
              variant={activeMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setActiveMethod('text')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Analyse textuelle</div>
                <div className="text-xs text-muted-foreground">Décrivez vos émotions</div>
              </div>
            </Button>
            
            <Button
              variant={activeMethod === 'audio' ? 'default' : 'outline'}
              onClick={() => setActiveMethod('audio')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Mic className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Analyse vocale</div>
                <div className="text-xs text-muted-foreground">Parlez naturellement</div>
              </div>
            </Button>
            
            <Button
              variant={activeMethod === 'facial' ? 'default' : 'outline'}
              onClick={() => setActiveMethod('facial')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Camera className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Analyse faciale</div>
                <div className="text-xs text-muted-foreground">Expression du visage</div>
              </div>
            </Button>
          </div>

          {/* Text Input */}
          {activeMethod === 'text' && (
            <div className="space-y-4">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Décrivez comment vous vous sentez en ce moment..."
                rows={4}
              />
              <Button 
                onClick={analyzeText} 
                disabled={!textInput.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser mes émotions'
                )}
              </Button>
            </div>
          )}

          {/* Audio Recording */}
          {activeMethod === 'audio' && (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Parlez naturellement pendant 10-30 secondes pour une analyse optimale
              </p>
              {!isRecording ? (
                <Button 
                  onClick={startAudioRecording}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <Button 
                  onClick={stopAudioRecording}
                  variant="destructive"
                  className="w-full"
                >
                  <MicOff className="mr-2 h-4 w-4" />
                  Arrêter l'enregistrement
                </Button>
              )}
            </div>
          )}

          {/* Facial Analysis */}
          {activeMethod === 'facial' && (
            <div className="space-y-4 text-center">
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto rounded-lg"
                style={{ display: isAnalyzing ? 'block' : 'none' }}
              />
              <p className="text-muted-foreground">
                Regardez la caméra avec une expression naturelle
              </p>
              <Button 
                onClick={startFacialAnalysis}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Analyser mon expression
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {result.score}/100
                </div>
                <div className="text-sm text-muted-foreground">Score de bien-être</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold mb-1 capitalize">
                  {result.primaryEmotion}
                </div>
                <div className="text-sm text-muted-foreground">Émotion principale</div>
              </div>
              
              <div className="text-center">
                <Badge className={getStressColor(result.stressLevel)}>
                  Stress {result.stressLevel === 'low' ? 'faible' : 
                         result.stressLevel === 'medium' ? 'modéré' : 'élevé'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Analyse IA :</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {result.aiFeedback}
                </p>
              </div>

              {result.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recommandations :</h4>
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

              {result.secondaryEmotions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Émotions secondaires :</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.secondaryEmotions.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="capitalize">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionScanner;
