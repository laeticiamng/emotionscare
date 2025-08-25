import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, MicOff, Brain, FileText, BarChart3, Play, Pause, 
  Square, RefreshCw, TrendingUp, Activity, Heart, Zap,
  Users, Calendar, Clock, Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  description: string;
}

interface ScanSession {
  id: string;
  type: 'voice' | 'text';
  timestamp: Date;
  results: EmotionResult[];
  content: string;
  aiAnalysis: string;
}

export const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResults, setCurrentResults] = useState<EmotionResult[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanSession[]>([]);
  const [activeTab, setActiveTab] = useState('voice');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Simuler les résultats d'analyse émotionnelle
  const mockEmotionAnalysis = (input: string, type: 'voice' | 'text'): EmotionResult[] => {
    const emotions = [
      { emotion: 'Joie', confidence: Math.random() * 40 + 60, color: 'bg-yellow-500', description: 'Sentiment positif et énergique' },
      { emotion: 'Calme', confidence: Math.random() * 30 + 50, color: 'bg-blue-500', description: 'État de sérénité et relaxation' },
      { emotion: 'Anxiété', confidence: Math.random() * 25 + 10, color: 'bg-orange-500', description: 'Tension et préoccupation' },
      { emotion: 'Tristesse', confidence: Math.random() * 20 + 5, color: 'bg-gray-500', description: 'Mélancolie et abattement' },
      { emotion: 'Excitation', confidence: Math.random() * 35 + 25, color: 'bg-purple-500', description: 'Enthousiasme et dynamisme' }
    ];
    
    return emotions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  };

  // Démarrer l'enregistrement vocal
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Analyse du niveau audio en temps réel
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel((average / 255) * 100);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Enregistrement démarré",
        description: "Parlez naturellement pour analyser vos émotions",
      });
    } catch (error) {
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioLevel(0);
      analyzeVoice();
    }
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse
    setTimeout(() => {
      const results = mockEmotionAnalysis('voice input', 'voice');
      setCurrentResults(results);
      
      const newSession: ScanSession = {
        id: Date.now().toString(),
        type: 'voice',
        timestamp: new Date(),
        results,
        content: 'Enregistrement vocal analysé',
        aiAnalysis: generateAIAnalysis(results)
      };
      
      setScanHistory(prev => [newSession, ...prev.slice(0, 9)]);
      setIsAnalyzing(false);
      
      toast({
        title: "Analyse terminée",
        description: `Émotion principale: ${results[0]?.emotion}`,
      });
    }, 2000);
  };

  const analyzeText = async () => {
    if (!textInput.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const results = mockEmotionAnalysis(textInput, 'text');
      setCurrentResults(results);
      
      const newSession: ScanSession = {
        id: Date.now().toString(),
        type: 'text',
        timestamp: new Date(),
        results,
        content: textInput,
        aiAnalysis: generateAIAnalysis(results)
      };
      
      setScanHistory(prev => [newSession, ...prev.slice(0, 9)]);
      setIsAnalyzing(false);
      setTextInput('');
      
      toast({
        title: "Analyse terminée",
        description: `Émotion principale: ${results[0]?.emotion}`,
      });
    }, 1500);
  };

  const generateAIAnalysis = (results: EmotionResult[]): string => {
    const mainEmotion = results[0];
    const analysisTexts = {
      'Joie': 'Votre état émotionnel reflète une belle énergie positive. Cette joie peut être un excellent moteur pour vos projets.',
      'Calme': 'Vous êtes dans un état de sérénité qui favorise la réflexion et la prise de décision éclairée.',
      'Anxiété': 'Je perçois une certaine tension. Avez-vous considéré des techniques de respiration pour vous apaiser ?',
      'Tristesse': 'Il est important de reconnaître ces sentiments. Prenez le temps nécessaire pour vous ressourcer.',
      'Excitation': 'Cette énergie dynamique est formidable ! Canalisez-la vers vos objectifs les plus importants.'
    };
    
    return analysisTexts[mainEmotion?.emotion as keyof typeof analysisTexts] || 'Votre profil émotionnel est unique et mérite attention.';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Scanner Émotionnel</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analysez vos émotions en temps réel grâce à notre IA avancée. 
          Utilisez votre voix ou vos écrits pour mieux comprendre votre état émotionnel.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Analyse Vocale
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analyse Textuelle
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Analyse Vocale en Temps Réel
              </CardTitle>
              <CardDescription>
                Parlez pendant 10-30 secondes pour analyser vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className="relative"
                  animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: isRecording ? Infinity : 0, duration: 2 }}
                >
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="h-20 w-20 rounded-full"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                  >
                    {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  
                  {isRecording && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-red-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </motion.div>
                
                {isRecording && (
                  <div className="w-full max-w-xs space-y-2">
                    <div className="text-center text-sm text-muted-foreground">Niveau audio</div>
                    <Progress value={audioLevel} className="h-2" />
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isRecording ? "Enregistrement en cours..." : 
                     isAnalyzing ? "Analyse en cours..." : 
                     "Cliquez pour commencer l'enregistrement"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyse Textuelle
              </CardTitle>
              <CardDescription>
                Écrivez vos pensées pour analyser vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Décrivez comment vous vous sentez, vos pensées du moment, votre humeur..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {textInput.length}/500 caractères
                </span>
                <Button 
                  onClick={analyzeText} 
                  disabled={!textInput.trim() || isAnalyzing}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Analyser le Texte
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Historique des Analyses
              </CardTitle>
              <CardDescription>
                Vos 10 dernières analyses émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune analyse disponible</p>
                  <p className="text-sm">Effectuez votre première analyse vocale ou textuelle</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {session.type === 'voice' ? <Mic className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          <Badge variant={session.type === 'voice' ? 'default' : 'secondary'}>
                            {session.type === 'voice' ? 'Vocal' : 'Textuel'}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {session.timestamp.toLocaleDateString()} à {session.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {session.results.map((result, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${result.color}`} />
                            {result.emotion} ({Math.round(result.confidence)}%)
                          </Badge>
                        ))}
                      </div>
                      
                      {session.content && session.type === 'text' && (
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          "{session.content.substring(0, 100)}{session.content.length > 100 ? '...' : ''}"
                        </p>
                      )}
                      
                      <p className="text-sm font-medium text-primary">
                        {session.aiAnalysis}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Résultats de l'analyse actuelle */}
      {currentResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Résultats de l'Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {currentResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${result.color}`} />
                      <div>
                        <h4 className="font-medium">{result.emotion}</h4>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round(result.confidence)}%</div>
                      <Progress value={result.confidence} className="w-24 h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* IA Analysis */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Analyse IA Personnalisée
                </h4>
                <p className="text-sm">{generateAIAnalysis(currentResults)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;