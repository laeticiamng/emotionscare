import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mic, MicOff, Play, Pause, Save, FileText, Volume2, Brain, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceEntry {
  id: string;
  title: string;
  audioBlob?: Blob;
  transcription: string;
  aiInsights: string;
  emotion: string;
  sentiment: number;
  keywords: string[];
  created_at: string;
  duration: number;
}

const B2CVoiceJournalPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [entries, setEntries] = useState<VoiceEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<VoiceEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_journal_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setEntries(data);
    } catch (error) {
      console.error('Erreur chargement entrées:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setCurrentAudio(audioBlob);
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Enregistrement démarré 🎤",
        description: "Exprimez-vous librement, l'IA vous écoute...",
      });
    } catch (error) {
      console.error('Erreur enregistrement:', error);
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez autoriser l'accès au microphone.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const simulateTranscriptionAndAnalysis = async (audioBlob: Blob): Promise<{
    transcription: string;
    emotion: string;
    sentiment: number;
    keywords: string[];
    insights: string;
  }> => {
    // Simulation d'une transcription et analyse IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const sampleTranscriptions = [
      "Aujourd'hui j'ai eu une journée plutôt productive. J'ai réussi à terminer mes projets en cours et je me sens satisfait du travail accompli.",
      "Je ressens un peu de stress concernant mes prochains défis professionnels, mais je reste optimiste pour la suite.",
      "Cette semaine a été riche en émotions. J'ai ressenti de la gratitude pour les moments partagés avec mes proches.",
      "Je réfléchis beaucoup à mes objectifs personnels et je pense qu'il est temps de prendre de nouvelles décisions importantes."
    ];
    
    const emotions = ['peaceful', 'focused', 'optimistic', 'grateful', 'determined'];
    const transcription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const sentiment = Math.random() * 0.6 + 0.4; // Entre 0.4 et 1.0
    
    return {
      transcription,
      emotion,
      sentiment,
      keywords: ['productivité', 'projets', 'satisfaction', 'accomplissement'],
      insights: `Votre voix révèle un état ${emotion}. Vous semblez ${sentiment > 0.7 ? 'très positif' : 'globalement serein'} aujourd'hui. Vos mots montrent une belle introspection et une conscience de vos émotions.`
    };
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const analysis = await simulateTranscriptionAndAnalysis(audioBlob);
      setTranscription(analysis.transcription);
      
      // Créer une nouvelle entrée
      const newEntry: VoiceEntry = {
        id: Date.now().toString(),
        title: `Journal du ${new Date().toLocaleDateString()}`,
        transcription: analysis.transcription,
        aiInsights: analysis.insights,
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        created_at: new Date().toISOString(),
        duration: recordingTime
      };
      
      // Sauvegarder en base
      await supabase.from('voice_journal_entries').insert([{
        title: newEntry.title,
        transcription: newEntry.transcription,
        ai_insights: newEntry.aiInsights,
        emotion: newEntry.emotion,
        sentiment: newEntry.sentiment,
        keywords: newEntry.keywords,
        duration: newEntry.duration
      }]);
      
      setEntries(prev => [newEntry, ...prev]);
      setSelectedEntry(newEntry);
      
      toast({
        title: "Analyse terminée! ✨",
        description: "Votre journal vocal a été traité avec succès.",
      });
      
    } catch (error) {
      console.error('Erreur traitement audio:', error);
      toast({
        title: "Erreur de traitement",
        description: "Impossible de traiter l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async () => {
    if (currentAudio && audioRef.current) {
      const audioUrl = URL.createObjectURL(currentAudio);
      audioRef.current.src = audioUrl;
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Erreur lecture audio:', error);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      'peaceful': 'bg-blue-100 text-blue-700',
      'focused': 'bg-purple-100 text-purple-700',
      'optimistic': 'bg-green-100 text-green-700',
      'grateful': 'bg-yellow-100 text-yellow-700',
      'determined': 'bg-orange-100 text-orange-700'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Journal Vocal
              </h1>
              <p className="text-gray-600">Exprimez-vous, l'IA vous comprend</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-6 h-6 text-emerald-500" />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              IA Transcription
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recording Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Studio d'Enregistrement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visualiseur de son */}
                <div className="relative h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {isRecording && (
                    <div className="flex items-center space-x-1">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i}
                          className="bg-emerald-500 rounded-full animate-pulse"
                          style={{
                            width: '4px',
                            height: `${Math.random() * 60 + 20}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {!isRecording && !isProcessing && (
                    <div className="text-center text-gray-500">
                      <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Cliquez pour commencer l'enregistrement</p>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-emerald-600 font-medium">Analyse en cours...</p>
                    </div>
                  )}
                </div>

                {/* Contrôles d'enregistrement */}
                <div className="flex items-center justify-center gap-4">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Arrêter
                    </Button>
                  )}

                  {currentAudio && (
                    <Button 
                      onClick={isPlaying ? pauseAudio : playAudio}
                      size="lg"
                      variant="outline"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? 'Pause' : 'Écouter'}
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono text-emerald-600 font-bold">
                      {formatTime(recordingTime)}
                    </div>
                    <p className="text-sm text-gray-500">Temps d'enregistrement</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transcription et Analyse */}
            {selectedEntry && (
              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {selectedEntry.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getEmotionColor(selectedEntry.emotion)}>
                      {selectedEntry.emotion}
                    </Badge>
                    <Badge variant="outline">
                      {formatTime(selectedEntry.duration)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Transcription:</h4>
                    <Textarea 
                      value={selectedEntry.transcription}
                      readOnly
                      className="min-h-[100px] bg-gray-50"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Analyse IA:
                    </h4>
                    <p className="text-gray-700">{selectedEntry.aiInsights}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Mots-clés:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-teal-100 text-teal-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                      <Heart className="w-4 h-4 mr-2" />
                      Actions Bien-être
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Historique */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Mes Entrées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div 
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedEntry?.id === entry.id 
                          ? 'bg-emerald-100 border-2 border-emerald-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm truncate">{entry.title}</span>
                        <Badge size="sm" className={getEmotionColor(entry.emotion)}>
                          {entry.emotion}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{entry.transcription}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(entry.duration)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune entrée</p>
                    <p className="text-sm">Commencez votre premier enregistrement!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <h3 className="font-semibold mb-2">Journal Intelligent</h3>
                <p className="text-sm text-gray-600 mb-3">
                  L'IA analyse vos émotions et vous propose des recommandations personnalisées
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Voir les Tendances
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CVoiceJournalPage;