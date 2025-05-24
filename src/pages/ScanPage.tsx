
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, MicOff, FileText, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmotionResult {
  emotions: Array<{ name: string; intensity: number }>;
  sentiment: string;
  confidence: number;
  suggestions: string[];
}

const ScanPage: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const analyzeText = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion-text', {
        body: { text: textInput }
      });

      if (error) throw error;

      if (data.success) {
        setResult(data.analysis);
        toast.success('Analyse terminée !');
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (error: any) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      // Convert audio to text using Whisper (placeholder for now)
      const transcribedText = "Transcription audio en cours de développement...";
      setTextInput(transcribedText);
      
      // Analyze the transcribed text
      await analyzeText();
    } catch (error: any) {
      toast.error('Erreur lors du traitement audio');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const EmotionChart = ({ emotions }: { emotions: Array<{ name: string; intensity: number }> }) => (
    <div className="space-y-3">
      {emotions.map((emotion, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-sm font-medium w-20 capitalize">{emotion.name}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${emotion.intensity * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{Math.round(emotion.intensity * 100)}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Scanner d'émotions</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions à partir de texte, audio ou vidéo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Analyse émotionnelle
          </CardTitle>
          <CardDescription>
            Choisissez votre méthode d'analyse préférée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Texte
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Vidéo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Décrivez vos sentiments, votre journée ou ce que vous ressentez..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32"
              />
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
                  'Analyser le texte'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Enregistrez un message vocal pour analyser vos émotions
                </p>
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className="w-full"
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
                {textInput && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Transcription:</p>
                    <p className="text-sm">{textInput}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Analyse vidéo en cours de développement
                </p>
                <Button disabled className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Bientôt disponible
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Émotions détectées</h3>
              <EmotionChart emotions={result.emotions} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Sentiment général</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                  result.sentiment === 'positif' ? 'bg-green-100 text-green-800' :
                  result.sentiment === 'négatif' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {result.sentiment}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Niveau de confiance</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Suggestions pour votre bien-être</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanPage;
