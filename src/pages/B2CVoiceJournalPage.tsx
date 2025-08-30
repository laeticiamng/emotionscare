/**
 * B2CVoiceJournalPage - Journal vocal intelligent avec IA
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, MicOff, Play, Pause, Square, Save, 
  FileText, Calendar, Search, Filter,
  Brain, Heart, Sparkles, Download, Share2,
  Volume2, Trash2, Edit, Clock, User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceEntry {
  id: string;
  date: Date;
  title: string;
  transcript: string;
  audioUrl?: string;
  duration: number;
  emotions: string[];
  mood: 'positive' | 'neutral' | 'negative';
  aiInsights: string[];
  tags: string[];
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
}

export default function B2CVoiceJournalPage() {
  const [entries, setEntries] = useState<VoiceEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<VoiceEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  });
  
  const [newEntry, setNewEntry] = useState({
    title: '',
    transcript: '',
    tags: [] as string[]
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Vérifier les permissions audio
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  // Exemples d'entrées
  useEffect(() => {
    const sampleEntries: VoiceEntry[] = [
      {
        id: '1',
        date: new Date(Date.now() - 86400000),
        title: 'Réflexions du matin',
        transcript: 'Aujourd\'hui je me sens plus optimiste. Le projet au travail avance bien et j\'ai eu une conversation enrichissante avec mon équipe.',
        duration: 120,
        emotions: ['optimisme', 'satisfaction'],
        mood: 'positive',
        aiInsights: [
          'Vous exprimez un sentiment d\'accomplissement professionnel',
          'Les interactions sociales positives influencent votre humeur',
          'Votre confiance semble grandir'
        ],
        tags: ['travail', 'équipe', 'optimisme']
      },
      {
        id: '2',
        date: new Date(Date.now() - 172800000),
        title: 'Moment de stress',
        transcript: 'Cette semaine a été particulièrement difficile. Je ressens beaucoup de pression et j\'ai du mal à trouver l\'équilibre.',
        duration: 90,
        emotions: ['stress', 'fatigue'],
        mood: 'negative',
        aiInsights: [
          'Vous traversez une période de tension',
          'L\'équilibre travail-vie personnelle semble affecté',
          'Il pourrait être bénéfique de pratiquer des techniques de relaxation'
        ],
        tags: ['stress', 'équilibre', 'fatigue']
      }
    ];
    setEntries(sampleEntries);
  }, []);

  const startRecording = async () => {
    if (!hasPermission) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecording(prev => ({ ...prev, audioBlob }));
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));
      
      // Timer
      timerRef.current = setInterval(() => {
        setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(prev => ({ ...prev, isRecording: false }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.pause();
      setRecording(prev => ({ ...prev, isPaused: true }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recording.isPaused) {
      mediaRecorderRef.current.resume();
      setRecording(prev => ({ ...prev, isPaused: false }));
      timerRef.current = setInterval(() => {
        setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
  };

  const saveEntry = () => {
    if (!newEntry.title.trim() && !newEntry.transcript.trim()) return;
    
    const entry: VoiceEntry = {
      id: Date.now().toString(),
      date: new Date(),
      title: newEntry.title || 'Entrée sans titre',
      transcript: newEntry.transcript,
      audioUrl: recording.audioBlob ? URL.createObjectURL(recording.audioBlob) : undefined,
      duration: recording.duration,
      emotions: analyzeEmotions(newEntry.transcript),
      mood: analyzeMood(newEntry.transcript),
      aiInsights: generateInsights(newEntry.transcript),
      tags: newEntry.tags
    };
    
    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', transcript: '', tags: [] });
    setRecording({ isRecording: false, isPaused: false, duration: 0, audioBlob: undefined });
  };

  const analyzeEmotions = (text: string): string[] => {
    const emotions: string[] = [];
    
    if (text.toLowerCase().includes('heureux') || text.toLowerCase().includes('content')) emotions.push('joie');
    if (text.toLowerCase().includes('triste') || text.toLowerCase().includes('mélancolie')) emotions.push('tristesse');
    if (text.toLowerCase().includes('stress') || text.toLowerCase().includes('anxieux')) emotions.push('stress');
    if (text.toLowerCase().includes('optimiste') || text.toLowerCase().includes('espoir')) emotions.push('optimisme');
    if (text.toLowerCase().includes('fatigue') || text.toLowerCase().includes('épuisé')) emotions.push('fatigue');
    
    return emotions.length > 0 ? emotions : ['neutre'];
  };

  const analyzeMood = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['bien', 'content', 'heureux', 'optimiste', 'réussir', 'accomplir'];
    const negativeWords = ['mal', 'triste', 'stress', 'difficile', 'problème', 'fatigue'];
    
    const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateInsights = (text: string): string[] => {
    const insights: string[] = [];
    
    if (text.toLowerCase().includes('travail')) {
      insights.push('Votre vie professionnelle influence votre état émotionnel');
    }
    if (text.toLowerCase().includes('équipe') || text.toLowerCase().includes('collègue')) {
      insights.push('Les relations sociales au travail sont importantes pour vous');
    }
    if (text.toLowerCase().includes('stress')) {
      insights.push('Il pourrait être bénéfique d\'explorer des techniques de gestion du stress');
    }
    if (text.toLowerCase().includes('équilibre')) {
      insights.push('L\'équilibre vie privée/professionnelle semble être une préoccupation');
    }
    
    return insights.length > 0 ? insights : ['Continuez à exprimer vos pensées, cela aide à la réflexion'];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Journal Vocal Intelligent
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exprimez vos pensées à voix haute et découvrez des insights grâce à l'IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enregistrement */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Nouvel Enregistrement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Input
                    placeholder="Titre de votre entrée..."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  />
                  
                  {/* Contrôles d'enregistrement */}
                  <div className="flex items-center justify-center gap-4 p-8 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-lg">
                    {hasPermission ? (
                      <>
                        {!recording.isRecording ? (
                          <Button
                            onClick={startRecording}
                            size="lg"
                            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                          >
                            <Mic className="h-6 w-6" />
                          </Button>
                        ) : (
                          <div className="flex items-center gap-4">
                            {recording.isPaused ? (
                              <Button
                                onClick={resumeRecording}
                                size="lg"
                                className="h-16 w-16 rounded-full"
                              >
                                <Play className="h-6 w-6" />
                              </Button>
                            ) : (
                              <Button
                                onClick={pauseRecording}
                                size="lg"
                                variant="outline"
                                className="h-16 w-16 rounded-full"
                              >
                                <Pause className="h-6 w-6" />
                              </Button>
                            )}
                            
                            <Button
                              onClick={stopRecording}
                              size="lg"
                              variant="destructive"
                              className="h-16 w-16 rounded-full"
                            >
                              <Square className="h-6 w-6" />
                            </Button>
                          </div>
                        )}
                        
                        {(recording.isRecording || recording.duration > 0) && (
                          <div className="text-center">
                            <div className="text-2xl font-mono">
                              {formatDuration(recording.duration)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {recording.isPaused ? 'En pause' : 'Enregistrement...'}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center space-y-2">
                        <MicOff className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">Microphone non autorisé</p>
                        <p className="text-sm text-muted-foreground">Mode texte disponible</p>
                      </div>
                    )}
                  </div>
                  
                  <Textarea
                    placeholder="Ou écrivez directement vos pensées ici..."
                    value={newEntry.transcript}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, transcript: e.target.value }))}
                    rows={6}
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={saveEntry}
                      disabled={!newEntry.title.trim() && !newEntry.transcript.trim()}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entrée sélectionnée */}
            {selectedEntry && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {selectedEntry.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {selectedEntry.date.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(selectedEntry.duration)}
                      </span>
                      <Badge variant={
                        selectedEntry.mood === 'positive' ? 'default' :
                        selectedEntry.mood === 'negative' ? 'destructive' : 'secondary'
                      }>
                        {selectedEntry.mood}
                      </Badge>
                    </div>
                    
                    {selectedEntry.audioUrl && (
                      <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 h-2 bg-muted rounded">
                          <div className="h-full w-1/3 bg-primary rounded"></div>
                        </div>
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="prose prose-sm max-w-none">
                      <p>{selectedEntry.transcript}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {selectedEntry.emotions.map((emotion, index) => (
                        <Badge key={index} variant="outline">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                    
                    {selectedEntry.aiInsights.length > 0 && (
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Insights IA
                        </h4>
                        <ul className="space-y-1">
                          {selectedEntry.aiInsights.map((insight, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Sparkles className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Liste des entrées */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mes Entrées
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedEntry?.id === entry.id && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm line-clamp-1">
                                  {entry.title}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {formatDuration(entry.duration)}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {entry.transcript}
                              </p>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  {entry.date.toLocaleDateString()}
                                </span>
                                <div className="flex gap-1">
                                  {entry.emotions.slice(0, 2).map((emotion, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {emotion}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}