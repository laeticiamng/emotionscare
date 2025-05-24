
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Mic, 
  Camera, 
  FileText, 
  MicIcon,
  Play,
  Square,
  Upload,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/utils/analytics';

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  recommendations: string[];
  analysis_type: 'text' | 'voice' | 'video';
}

const B2CScanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'video'>('text');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<EmotionResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeText = async () => {
    if (!textInput.trim() || !user) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    analytics.emotionalScanStarted(user.id, {
      type: 'text',
      inputLength: textInput.length
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const response = await fetch('/api/emotions/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textInput,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse');
      }

      const data = await response.json();
      
      const mockResult: EmotionResult = {
        emotion: data.emotion || 'Neutre',
        confidence: data.confidence || Math.random() * 40 + 60,
        intensity: data.intensity || Math.random() * 80 + 20,
        recommendations: data.recommendations || [
          "Prenez quelques minutes pour respirer profondément",
          "Essayez une session de méditation guidée",
          "Écoutez de la musique apaisante"
        ],
        analysis_type: 'text'
      };

      setResults(mockResult);
      setAnalysisProgress(100);
      
      analytics.emotionalScanCompleted(user.id, {
        type: 'text',
        emotion: mockResult.emotion,
        confidence: mockResult.confidence,
        intensity: mockResult.intensity
      });

      toast({
        title: "Analyse terminée !",
        description: `Émotion détectée: ${mockResult.emotion} (${Math.round(mockResult.confidence)}% de confiance)`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le texte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const startVoiceRecording = async () => {
    if (!user) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        analyzeVoice();
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      analytics.voiceTranscriptRequested(user.id, {
        startTime: new Date().toISOString()
      });

      toast({
        title: "Enregistrement démarré",
        description: "Parlez naturellement de vos émotions...",
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeVoice = async () => {
    if (!user) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('userId', user.id);

      const response = await fetch('/api/emotions/analyze-voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse vocale');
      }

      const data = await response.json();
      
      const mockResult: EmotionResult = {
        emotion: data.emotion || 'Calme',
        confidence: data.confidence || Math.random() * 30 + 70,
        intensity: data.intensity || Math.random() * 60 + 40,
        recommendations: data.recommendations || [
          "Votre voix indique un bon équilibre émotionnel",
          "Continuez à vous exprimer librement",
          "Pratiquez des exercices de respiration pour maintenir cet état"
        ],
        analysis_type: 'voice'
      };

      setResults(mockResult);
      setAnalysisProgress(100);
      
      analytics.voiceTranscriptDone(user.id, {
        emotion: mockResult.emotion,
        confidence: mockResult.confidence,
        duration: audioChunksRef.current.length
      });

      toast({
        title: "Analyse vocale terminée !",
        description: `Émotion détectée: ${mockResult.emotion}`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'analyse vocale:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'Joie': 'text-yellow-600 bg-yellow-100',
      'Tristesse': 'text-blue-600 bg-blue-100',
      'Colère': 'text-red-600 bg-red-100',
      'Peur': 'text-purple-600 bg-purple-100',
      'Stress': 'text-orange-600 bg-orange-100',
      'Calme': 'text-green-600 bg-green-100',
      'Neutre': 'text-gray-600 bg-gray-100',
    };
    return colors[emotion] || 'text-gray-600 bg-gray-100';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      'Joie': '😊',
      'Tristesse': '😢',
      'Colère': '😠',
      'Peur': '😰',
      'Stress': '😤',
      'Calme': '😌',
      'Neutre': '😐',
    };
    return emojis[emotion] || '🤔';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Scanner d'émotions IA</h1>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Brain className="w-4 h-4 mr-1" />
          Analyse émotionnelle
        </Badge>
      </div>
      
      <p className="text-muted-foreground">
        Analysez vos émotions à travers le texte, la voix ou l'expression faciale pour obtenir des insights personnalisés.
      </p>

      {/* Analysis Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'text', label: 'Texte', icon: FileText },
          { id: 'voice', label: 'Voix', icon: Mic },
          { id: 'video', label: 'Vidéo', icon: Camera, disabled: true },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
            disabled={tab.disabled}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-background shadow-sm'
                : tab.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-background/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.disabled && <Badge variant="outline" className="text-xs">Bientôt</Badge>}
          </button>
        ))}
      </div>

      {/* Text Analysis */}
      {activeTab === 'text' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Analyse textuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Décrivez vos émotions ou votre état d'esprit
              </label>
              <Textarea
                placeholder="Ex: Je me sens un peu stressé aujourd'hui à cause du travail. J'ai du mal à me concentrer et je sens une tension dans mes épaules..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isAnalyzing}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Plus vous serez détaillé, plus l'analyse sera précise. ({textInput.length} caractères)
              </p>
            </div>

            <Button
              onClick={analyzeText}
              disabled={!textInput.trim() || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyser mes émotions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Voice Analysis */}
      {activeTab === 'voice' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="mr-2 h-5 w-5" />
              Analyse vocale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-red-100 border-4 border-red-500' : 'bg-muted'
              }`}>
                <MicIcon className={`w-12 h-12 ${
                  isRecording ? 'text-red-600' : 'text-muted-foreground'
                }`} />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">
                  {isRecording ? 'Enregistrement en cours...' : 'Prêt à enregistrer'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? 'Parlez naturellement de vos émotions. Cliquez sur stop quand vous avez terminé.'
                    : 'Cliquez sur le bouton pour commencer l\'enregistrement de votre voix.'
                  }
                </p>
              </div>

              {isRecording ? (
                <Button
                  onClick={stopVoiceRecording}
                  variant="destructive"
                  size="lg"
                  className="space-x-2"
                >
                  <Square className="w-4 h-4" />
                  <span>Arrêter l'enregistrement</span>
                </Button>
              ) : (
                <Button
                  onClick={startVoiceRecording}
                  disabled={isAnalyzing}
                  size="lg"
                  className="space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Commencer l'enregistrement</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {isAnalyzing && analysisProgress > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  Analyse émotionnelle en cours...
                </span>
                <span className="text-sm text-blue-600">
                  {Math.round(analysisProgress)}%
                </span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-blue-600">
                {analysisProgress < 30 && "Traitement du signal..."}
                {analysisProgress >= 30 && analysisProgress < 60 && "Extraction des caractéristiques émotionnelles..."}
                {analysisProgress >= 60 && analysisProgress < 90 && "Analyse IA en cours..."}
                {analysisProgress >= 90 && "Finalisation des résultats..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Résultats de l'analyse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emotion Detection */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Émotion principale détectée</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getEmotionEmoji(results.emotion)}</span>
                      <Badge className={getEmotionColor(results.emotion)}>
                        {results.emotion}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(results.confidence)}% de confiance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <h3 className="font-medium mb-2">Intensité émotionnelle</h3>
                  <div className="space-y-2">
                    <Progress value={results.intensity} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Faible</span>
                      <span>{Math.round(results.intensity)}%</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-medium mb-3">Recommandations personnalisées</h3>
                  <div className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-background rounded-lg border">
                        <span className="text-primary text-sm font-bold mt-0.5">
                          {index + 1}.
                        </span>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setResults(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Nouvelle analyse
                  </Button>
                  <Button className="flex-1">
                    Sauvegarder les résultats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default B2CScanPage;
