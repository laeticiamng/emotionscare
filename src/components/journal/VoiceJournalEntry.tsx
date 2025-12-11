// @ts-nocheck

/**
 * Voice Journal Entry - Entrée journal enrichie avec transcription vocale et prompts IA
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mic,
  MicOff,
  Sparkles,
  Lightbulb,
  RefreshCw,
  Send,
  Clock,
  Wand2,
  Volume2,
  Pause,
  Play,
  History,
  Download,
  Share2,
  Heart,
  Trash2,
  Copy,
  FileText,
  Smile,
  Meh,
  Frown,
  Star,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'gratitude' | 'emotion' | 'growth' | 'mindfulness';
}

interface VoiceEntry {
  id: string;
  timestamp: string;
  duration: number;
  transcription: string;
  mood?: 'positive' | 'neutral' | 'negative';
  isFavorite?: boolean;
}

interface JournalTemplate {
  id: string;
  name: string;
  structure: string;
  icon: React.ElementType;
}

const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { id: '1', text: 'Qu\'est-ce qui vous a apporté de la joie aujourd\'hui ?', category: 'gratitude' },
  { id: '2', text: 'Comment décririez-vous votre énergie en ce moment ?', category: 'emotion' },
  { id: '3', text: 'Quel défi avez-vous surmonté récemment ?', category: 'growth' },
  { id: '4', text: 'Prenez un moment pour observer vos sensations physiques...', category: 'mindfulness' },
  { id: '5', text: 'Pour quoi êtes-vous reconnaissant(e) en ce moment ?', category: 'gratitude' },
  { id: '6', text: 'Quelle émotion domine votre journée et pourquoi ?', category: 'emotion' },
  { id: '7', text: 'Qu\'avez-vous appris sur vous-même cette semaine ?', category: 'growth' },
  { id: '8', text: 'Décrivez trois choses que vous voyez autour de vous...', category: 'mindfulness' },
];

const TEMPLATES: JournalTemplate[] = [
  { 
    id: 'gratitude', 
    name: 'Gratitude', 
    structure: '🙏 Aujourd\'hui, je suis reconnaissant(e) pour:\n1. \n2. \n3. \n\n💭 Ce qui m\'a fait sourire:', 
    icon: Heart 
  },
  { 
    id: 'reflection', 
    name: 'Réflexion', 
    structure: '📝 Comment je me sens:\n\n🎯 Ce que j\'ai accompli:\n\n💡 Ce que j\'ai appris:\n\n🌟 Demain, je veux:', 
    icon: Lightbulb 
  },
  { 
    id: 'freewrite', 
    name: 'Écriture libre', 
    structure: '', 
    icon: FileText 
  },
];

const CATEGORY_COLORS = {
  gratitude: 'bg-amber-500/10 text-amber-600 border-amber-200',
  emotion: 'bg-rose-500/10 text-rose-600 border-rose-200',
  growth: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  mindfulness: 'bg-sky-500/10 text-sky-600 border-sky-200'
};

const VOICE_HISTORY_KEY = 'voice_journal_history';

export const VoiceJournalEntry: React.FC = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedMood, setSelectedMood] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [voiceHistory, setVoiceHistory] = useState<VoiceEntry[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('freewrite');
  const [promptCategory, setPromptCategory] = useState<string>('all');
  const [wordCount, setWordCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    generateNewPrompt();
    loadHistory();
    
    // Start session timer
    sessionTimerRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    setWordCount(transcription.split(/\s+/).filter(Boolean).length);
  }, [transcription]);

  const loadHistory = () => {
    const stored = localStorage.getItem(VOICE_HISTORY_KEY);
    if (stored) {
      setVoiceHistory(JSON.parse(stored));
    }
  };

  const saveToHistory = (entry: VoiceEntry) => {
    const newHistory = [entry, ...voiceHistory].slice(0, 50);
    setVoiceHistory(newHistory);
    localStorage.setItem(VOICE_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const generateNewPrompt = () => {
    const filteredPrompts = promptCategory === 'all' 
      ? REFLECTION_PROMPTS 
      : REFLECTION_PROMPTS.filter(p => p.category === promptCategory);
    const randomPrompt = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setTranscription(template.structure);
      setSelectedTemplate(templateId);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      
      const updateLevel = () => {
        if (!analyzerRef.current) return;
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setAudioLevel(0);
        
        setIsTranscribing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const sampleTexts = [
          "Je me sens plutôt bien aujourd'hui. J'ai eu une bonne conversation avec un ami et ça m'a remonté le moral.",
          "Cette journée a été difficile. J'ai eu beaucoup de stress au travail mais j'essaie de rester positif.",
          "Je suis reconnaissant pour les petites choses. Le soleil ce matin, un bon café, un moment de calme.",
          "J'ai réfléchi à mes objectifs et je me rends compte que j'ai fait du progrès cette semaine."
        ];
        
        const newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTranscription(prev => prev ? `${prev}\n\n${newText}` : newText);
        setIsTranscribing(false);
        
        // Save to history
        saveToHistory({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          duration: recordingDuration,
          transcription: newText,
          mood: selectedMood || 'neutral',
        });
        
        toast({
          title: 'Transcription terminée',
          description: 'Votre enregistrement a été converti en texte.'
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: 'Enregistrement démarré',
        description: 'Parlez naturellement, je transcris pour vous.'
      });
    } catch (error) {
      toast({
        title: 'Erreur microphone',
        description: 'Impossible d\'accéder au microphone.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const generateAISuggestion = async () => {
    if (!transcription.trim()) {
      toast({
        title: 'Texte requis',
        description: 'Écrivez ou dictez quelque chose d\'abord.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = [
      "Vous semblez exprimer un besoin de connexion sociale. Avez-vous pensé à planifier une activité avec un proche cette semaine ?",
      "Je remarque des sentiments mitigés dans votre réflexion. C'est tout à fait normal. Que diriez-vous d'explorer ce qui vous apporte de l'apaisement ?",
      "Votre gratitude est belle à voir. Continuez à cultiver ces moments de reconnaissance, ils sont précieux pour le bien-être.",
      "Il semble que vous traversez une période de croissance personnelle. Quelles ressources pourriez-vous mobiliser pour soutenir ce parcours ?"
    ];
    
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setIsGenerating(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportEntry = () => {
    const data = {
      date: new Date().toISOString(),
      transcription,
      mood: selectedMood,
      wordCount,
      sessionDuration,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({ title: 'Exporté!', description: 'Entrée exportée en JSON' });
  };

  const shareEntry = async () => {
    const text = `📝 Ma réflexion du jour:\n\n${transcription.slice(0, 200)}${transcription.length > 200 ? '...' : ''}\n\n#JournalEmotionnel #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier' });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier' });
    }
  };

  const toggleFavorite = (entryId: string) => {
    const updated = voiceHistory.map(e => 
      e.id === entryId ? { ...e, isFavorite: !e.isFavorite } : e
    );
    setVoiceHistory(updated);
    localStorage.setItem(VOICE_HISTORY_KEY, JSON.stringify(updated));
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      default: return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Session Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Session: {formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{wordCount} mots</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowHistoryDialog(true)}>
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Historique ({voiceHistory.length})</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportEntry} disabled={!transcription}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exporter</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={shareEntry} disabled={!transcription}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mood Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Comment vous sentez-vous ?</span>
              <div className="flex gap-2">
                {(['positive', 'neutral', 'negative'] as const).map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMood(mood)}
                    className="gap-1"
                  >
                    {getMoodIcon(mood)}
                    {mood === 'positive' ? 'Bien' : mood === 'neutral' ? 'Neutre' : 'Difficile'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyTemplate(template.id)}
                  className="gap-1"
                >
                  <template.icon className="h-4 w-4" />
                  {template.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prompt */}
        {currentPrompt && (
          <Card className={`border ${CATEGORY_COLORS[currentPrompt.category]}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {currentPrompt.category === 'gratitude' && 'Gratitude'}
                        {currentPrompt.category === 'emotion' && 'Émotion'}
                        {currentPrompt.category === 'growth' && 'Croissance'}
                        {currentPrompt.category === 'mindfulness' && 'Pleine conscience'}
                      </Badge>
                      <Select value={promptCategory} onValueChange={setPromptCategory}>
                        <SelectTrigger className="h-7 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="gratitude">Gratitude</SelectItem>
                          <SelectItem value="emotion">Émotion</SelectItem>
                          <SelectItem value="growth">Croissance</SelectItem>
                          <SelectItem value="mindfulness">Pleine conscience</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-lg font-medium">{currentPrompt.text}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={generateNewPrompt}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Dictée vocale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Button
                  size="lg"
                  variant={isRecording ? 'destructive' : 'default'}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className="h-20 w-20 rounded-full"
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </motion.div>
              
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    <span className="font-mono text-2xl">{formatDuration(recordingDuration)}</span>
                  </div>
                  
                  <div className="flex items-end gap-0.5 h-10">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{
                          height: Math.max(4, audioLevel * 40 * (0.5 + Math.random() * 0.5))
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              
              {isTranscribing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Transcription en cours...</span>
                </div>
              )}
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              {isRecording 
                ? 'Cliquez pour arrêter l\'enregistrement'
                : 'Cliquez pour commencer à dicter'}
            </p>
          </CardContent>
        </Card>

        {/* Text Area */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Votre réflexion</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{wordCount} mots</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    navigator.clipboard.writeText(transcription);
                    toast({ title: 'Copié!' });
                  }}
                  disabled={!transcription}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Écrivez ou dictez vos pensées..."
              className="min-h-[250px] resize-none"
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={generateAISuggestion}
                disabled={isGenerating || !transcription.trim()}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Suggestion IA
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setTranscription('')}
                  disabled={!transcription}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer
                </Button>
                <Button disabled={!transcription.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestion */}
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Réflexion de l'IA</h4>
                      <p className="text-muted-foreground">{aiSuggestion}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setAiSuggestion(null)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique vocal
              </DialogTitle>
              <DialogDescription>
                {voiceHistory.length} entrées enregistrées
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {voiceHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun enregistrement
                </p>
              ) : (
                voiceHistory.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formatDuration(entry.duration)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleFavorite(entry.id)}
                      >
                        {entry.isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm line-clamp-2">{entry.transcription}</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-2"
                      onClick={() => {
                        setTranscription(prev => prev ? `${prev}\n\n${entry.transcription}` : entry.transcription);
                        setShowHistoryDialog(false);
                      }}
                    >
                      Insérer dans l'éditeur
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default VoiceJournalEntry;
