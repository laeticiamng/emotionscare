import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onAnalysisComplete?: (analysis: any) => void;
  analysisType?: 'emotion' | 'stress' | 'mood' | 'full';
}

interface EmotionAnalysis {
  emotions: Record<string, number>;
  stress_level: number;
  tone: string;
  wellness_score: number;
  recommendations: string[];
  summary: string;
  transcription: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onAnalysisComplete,
  analysisType = 'full' 
}) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser l'analyse vocale",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        
        // Créer URL pour lecture
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Timer pour durée d'enregistrement
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Enregistrement démarré",
        description: "Parlez clairement, votre voix est en cours d'enregistrement...",
      });

    } catch (error) {
      console.error('Erreur accès microphone:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      toast({
        title: "Enregistrement terminé",
        description: `Durée: ${recordingDuration}s. Vous pouvez maintenant analyser votre voix.`,
      });
    }
  };

  const playRecording = () => {
    if (audioRef.current && recordedAudio) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setAnalysis(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const analyzeVoice = async () => {
    if (!recordedAudio || !user) {
      toast({
        title: "Aucun enregistrement",
        description: "Veuillez d'abord enregistrer votre voix",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulation de progression
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 800);

    try {
      // Conversion de l'audio en base64
      const reader = new FileReader();
      reader.readAsDataURL(recordedAudio);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        console.log('🎤 Envoi pour analyse vocale:', {
          size: recordedAudio.size,
          type: recordedAudio.type,
          analysisType
        });

        const { data, error } = await supabase.functions.invoke('voice-analysis', {
          body: {
            audioData: base64Audio,
            userId: user.id,
            analysisType
          }
        });

        clearInterval(progressInterval);

        if (error) {
          console.error('❌ Erreur analyse:', error);
          throw new Error(error.message || 'Erreur lors de l\'analyse vocale');
        }

        if (!data.success) {
          throw new Error(data.error || 'Échec de l\'analyse vocale');
        }

        console.log('✅ Analyse complétée:', data.analysis);
        
        const analysisResult: EmotionAnalysis = {
          emotions: data.analysis.emotions || {},
          stress_level: data.analysis.stress_level || 5,
          tone: data.analysis.tone || 'neutre',
          wellness_score: data.analysis.wellness_score || 50,
          recommendations: data.analysis.recommendations || [],
          summary: data.analysis.summary || 'Analyse terminée',
          transcription: data.analysis.transcription || ''
        };

        setAnalysis(analysisResult);
        setAnalysisProgress(100);

        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResult);
        }

        toast({
          title: "Analyse complétée !",
          description: `Score de bien-être: ${analysisResult.wellness_score}/100`,
        });
      };

    } catch (error) {
      console.error('❌ Erreur analyse vocale:', error);
      clearInterval(progressInterval);
      
      toast({
        title: "Erreur d'analyse",
        description: error.message || "Une erreur s'est produite lors de l'analyse",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      'joie': '😊',
      'tristesse': '😢',
      'colère': '😠',
      'peur': '😰',
      'surprise': '😲',
      'dégoût': '🤢',
      'neutre': '😐'
    };
    return emojiMap[emotion] || '😐';
  };

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Analyse Vocale Émotionnelle
            <Badge variant="secondary">{analysisType}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contrôles d'enregistrement */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isAnalyzing}
              >
                <Mic className="h-5 w-5 mr-2" />
                Démarrer l'enregistrement
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Arrêter
                </Button>
                <Badge className="bg-red-100 text-red-700 animate-pulse">
                  🔴 {formatDuration(recordingDuration)}
                </Badge>
              </div>
            )}
          </div>

          {/* Contrôles de lecture */}
          {recordedAudio && !isRecording && (
            <div className="flex items-center justify-center gap-2">
              <Button onClick={playRecording} variant="outline" size="sm">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Écouter'}
              </Button>
              <Button onClick={resetRecording} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
              <Button 
                onClick={analyzeVoice}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/90"
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
              </Button>
            </div>
          )}

          {/* Progression d'analyse */}
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Analyse émotionnelle en cours... {Math.round(analysisProgress)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats d'analyse */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résultats de l'Analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score global */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {analysis.wellness_score}/100
              </div>
              <p className="text-sm text-muted-foreground">Score de bien-être global</p>
            </div>

            {/* Transcription */}
            {analysis.transcription && (
              <div>
                <h4 className="font-medium mb-2">Transcription</h4>
                <p className="text-sm bg-gray-50 p-3 rounded italic">
                  "{analysis.transcription}"
                </p>
              </div>
            )}

            {/* Émotions détectées */}
            <div>
              <h4 className="font-medium mb-2">Émotions détectées</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analysis.emotions).map(([emotion, intensity]) => (
                  <div key={emotion} className="flex items-center gap-2">
                    <span>{getEmotionEmoji(emotion)}</span>
                    <span className="text-sm capitalize">{emotion}</span>
                    <div className="flex-1">
                      <Progress value={intensity * 100} className="h-2" />
                    </div>
                    <span className="text-xs">{Math.round(intensity * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicateurs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-lg font-semibold text-yellow-700">
                  {analysis.stress_level}/10
                </div>
                <p className="text-xs text-yellow-600">Niveau de stress</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-semibold text-blue-700 capitalize">
                  {analysis.tone}
                </div>
                <p className="text-xs text-blue-600">Ton général</p>
              </div>
            </div>

            {/* Recommandations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommandations</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Résumé */}
            {analysis.summary && (
              <div>
                <h4 className="font-medium mb-2">Analyse détaillée</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceRecorder;