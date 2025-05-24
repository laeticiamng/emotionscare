
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Mic, MicOff, Loader2, Heart, Music } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ScanPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [recordingError, setRecordingError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const analyzeText = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: { text: textInput, type: 'text' }
      });

      if (error) throw error;

      setAnalysisResult(data);
      toast.success('Analyse émotionnelle terminée !');
    } catch (error) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse émotionnelle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    setRecordingError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Enregistrement en cours...');
    } catch (error) {
      console.error('Erreur microphone:', error);
      setRecordingError('Impossible d\'accéder au microphone. Vérifiez vos permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('emotion-analysis', {
          body: { audio: base64Audio, type: 'audio' }
        });

        if (error) throw error;

        setAnalysisResult(data);
        toast.success('Analyse vocale terminée !');
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Erreur analyse audio:', error);
      toast.error('Erreur lors de l\'analyse vocale');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Scanner d'Émotions</h1>
            <p className="text-muted-foreground">
              Analysez vos émotions grâce à l'intelligence artificielle
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyse par texte */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyse Textuelle
              </CardTitle>
              <CardDescription>
                Décrivez vos émotions ou votre état d'esprit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Comment vous sentez-vous ? Décrivez votre humeur, vos pensées..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={analyzeText} 
                disabled={isAnalyzing || !textInput.trim()}
                className="w-full"
              >
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyser mes émotions
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyse vocale */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Analyse Vocale
              </CardTitle>
              <CardDescription>
                Parlez pendant quelques secondes pour analyser votre voix
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recordingError && (
                <Alert>
                  <AlertDescription>{recordingError}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-center">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isAnalyzing}
                  size="lg"
                  className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                  {isAnalyzing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="mr-2 h-5 w-5" />
                  ) : (
                    <Mic className="mr-2 h-5 w-5" />
                  )}
                  {isAnalyzing ? 'Analyse en cours...' : 
                   isRecording ? 'Arrêter l\'enregistrement' : 
                   'Commencer l\'enregistrement'}
                </Button>
              </div>
              
              {isRecording && (
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="inline-block w-4 h-4 bg-red-500 rounded-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enregistrement en cours...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Résultats de l'analyse */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Résultats de l'Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Émotions Détectées</h3>
                  <div className="space-y-2">
                    {analysisResult.emotions?.map((emotion: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="capitalize">{emotion.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${emotion.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(emotion.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recommandations</h3>
                  <div className="space-y-2">
                    {analysisResult.recommendations?.map((rec: string, index: number) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              {analysisResult.summary && (
                <div>
                  <h3 className="font-medium mb-2">Résumé</h3>
                  <p className="text-muted-foreground">{analysisResult.summary}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Musique adaptée
                </Button>
                <Button variant="outline">
                  Parler au coach
                </Button>
                <Button variant="outline">
                  Noter dans le journal
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;
