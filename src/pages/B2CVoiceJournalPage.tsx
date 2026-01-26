/**
 * B2CVoiceJournalPage - Journal vocal avec transcription et analyse
 * Module complet pour l'enregistrement, la transcription et la gestion des notes vocales
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, FileText, History, BarChart3, Search, 
  Tag, Calendar, Play, Pause, Trash2, Archive, 
  Sparkles, Clock, Volume2, X, Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { journalService, type JournalEntry } from '@/modules/journal/journalService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// ============= Types =============
interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

interface VoiceJournalStats {
  totalEntries: number;
  voiceEntries: number;
  textEntries: number;
  thisWeek: number;
  avgLength: number;
  topTags: { tag: string; count: number }[];
}

// ============= Constants =============
const MAX_RECORDING_DURATION = 300; // 5 minutes
const COMMON_TAGS = ['gratitude', 'réflexion', 'objectifs', 'émotions', 'travail', 'santé', 'relations', 'créativité'];

// ============= Sub-Components =============

const VoiceRecorder: React.FC<{
  state: RecordingState;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onDiscard: () => void;
  isProcessing: boolean;
}> = ({ state, onStart, onStop, onPause, onResume, onDiscard, isProcessing }) => {
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    if (state.isRecording && !state.isPaused) {
      const interval = setInterval(() => {
        setWaveform(prev => {
          const newVal = Math.random() * 100;
          const updated = [...prev, newVal].slice(-30);
          return updated;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [state.isRecording, state.isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (state.duration / MAX_RECORDING_DURATION) * 100;

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6 space-y-6">
        {/* Waveform Visualization */}
        <div className="h-24 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden px-4">
          {state.isRecording ? (
            <div className="flex items-end gap-1 h-full py-4">
              {waveform.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${state.isPaused ? 20 : height}%` }}
                  className={`w-1.5 rounded-full ${state.isPaused ? 'bg-muted-foreground' : 'bg-primary'}`}
                />
              ))}
            </div>
          ) : state.audioBlob ? (
            <div className="text-center">
              <Volume2 className="w-10 h-10 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Enregistrement prêt à sauvegarder</p>
            </div>
          ) : (
            <div className="text-center">
              <Mic className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Appuyez sur le micro pour commencer</p>
            </div>
          )}
        </div>

        {/* Timer & Progress */}
        {state.isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-mono text-lg font-bold text-primary">
                {formatTime(state.duration)}
              </span>
              <span className="text-muted-foreground">
                Max: {formatTime(MAX_RECORDING_DURATION)}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!state.isRecording ? (
            <>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="lg"
                  onClick={onStart}
                  disabled={isProcessing}
                  className="w-16 h-16 rounded-full"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className="w-7 h-7" />
                  )}
                </Button>
              </motion.div>
              {state.audioBlob && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDiscard}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={state.isPaused ? onResume : onPause}
                className="w-12 h-12 rounded-full"
              >
                {state.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={onStop}
                  className="w-16 h-16 rounded-full"
                >
                  <MicOff className="w-7 h-7" />
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Status Badge */}
        {state.isRecording && (
          <div className="flex justify-center">
            <Badge variant={state.isPaused ? 'secondary' : 'destructive'} className="animate-pulse">
              {state.isPaused ? '⏸️ En pause' : '🔴 Enregistrement en cours'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const JournalEntryCard: React.FC<{
  entry: JournalEntry;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onPlay?: (entry: JournalEntry) => void;
}> = ({ entry, onDelete, onArchive, onPlay }) => {
  const isVoice = entry.mode === 'voice';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 bg-card rounded-lg border border-border/50 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isVoice ? 'default' : 'secondary'} className="gap-1">
              {isVoice ? <Mic className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
              {isVoice ? 'Vocal' : 'Texte'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {entry.created_at && formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: fr })}
            </span>
          </div>
          
          <p className="text-sm text-foreground line-clamp-3 mb-2">
            {entry.text}
          </p>

          {entry.summary && (
            <p className="text-xs text-muted-foreground italic mb-2">
              Résumé: {entry.summary}
            </p>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {isVoice && onPlay && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPlay(entry)}
              className="h-8 w-8"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => entry.id && onArchive(entry.id)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Archive className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => entry.id && onDelete(entry.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCard: React.FC<{ stats: VoiceJournalStats; isLoading: boolean }> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const statItems = [
    { icon: FileText, label: 'Total', value: stats.totalEntries, color: 'text-blue-500' },
    { icon: Mic, label: 'Vocaux', value: stats.voiceEntries, color: 'text-green-500' },
    { icon: Calendar, label: 'Cette semaine', value: stats.thisWeek, color: 'text-purple-500' },
    { icon: Clock, label: 'Durée moy.', value: `${stats.avgLength}s`, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {stats.topTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map((item, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  #{item.tag}
                  <span className="text-xs opacity-70">({item.count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ============= Main Component =============
const B2CVoiceJournalPage: React.FC = () => {
  useAuth();
  const { toast } = useToast();
  
  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Journal state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'voice' | 'text'>('all');
  const [selectedTags, _setSelectedTags] = useState<string[]>([]);

  // Text entry state
  const [textEntry, setTextEntry] = useState('');
  const [textTags, setTextTags] = useState<string[]>([]);
  const [voiceTags, setVoiceTags] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState<VoiceJournalStats>({
    totalEntries: 0,
    voiceEntries: 0,
    textEntries: 0,
    thisWeek: 0,
    avgLength: 0,
    topTags: [],
  });

  // Load entries
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoadingEntries(true);
    try {
      const notes = await journalService.getAllNotes();
      setEntries(notes);
      computeStats(notes);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les entrées du journal',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const computeStats = (notes: JournalEntry[]) => {
    const voiceEntries = notes.filter(n => n.mode === 'voice').length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = notes.filter(n => n.created_at && new Date(n.created_at) > oneWeekAgo).length;

    const allTags = notes.flatMap(n => n.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));

    setStats({
      totalEntries: notes.length,
      voiceEntries,
      textEntries: notes.length - voiceEntries,
      thisWeek,
      avgLength: notes.length > 0 ? Math.round(notes.reduce((sum, n) => sum + (n.text?.length || 0), 0) / notes.length) : 0,
      topTags,
    });
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordingState(prev => ({ ...prev, audioBlob, isRecording: false, isPaused: false }));
      };

      mediaRecorder.start();
      setRecordingState({ isRecording: true, isPaused: false, duration: 0, audioBlob: null });

      timerRef.current = setInterval(() => {
        setRecordingState(prev => {
          if (prev.duration >= MAX_RECORDING_DURATION) {
            stopRecording();
            return prev;
          }
          return { ...prev, duration: prev.duration + 1 };
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      setRecordingState(prev => ({ ...prev, isPaused: false }));
    }
  };

  const discardRecording = () => {
    setRecordingState({ isRecording: false, isPaused: false, duration: 0, audioBlob: null });
    setVoiceTags([]);
  };

  // Save voice entry
  const saveVoiceEntry = async () => {
    if (!recordingState.audioBlob) return;

    setIsProcessing(true);
    try {
      // Process voice entry (transcription)
      const result = await journalService.processVoiceEntry(recordingState.audioBlob);
      
      // Save to database
      const entry = await journalService.createVoiceEntry(result.content, voiceTags);
      
      if (entry) {
        setEntries(prev => [entry, ...prev]);
        computeStats([entry, ...entries]);
        discardRecording();
        toast({
          title: 'Succès',
          description: 'Note vocale sauvegardée',
        });
      }
    } catch (error) {
      console.error('Error saving voice entry:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la note vocale',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Save text entry
  const saveTextEntry = async () => {
    if (!textEntry.trim()) return;

    setIsProcessing(true);
    try {
      const entry = await journalService.createTextEntry({
        text: textEntry.trim(),
        tags: textTags,
      });

      if (entry) {
        setEntries(prev => [entry, ...prev]);
        computeStats([entry, ...entries]);
        setTextEntry('');
        setTextTags([]);
        toast({
          title: 'Succès',
          description: 'Note sauvegardée',
        });
      }
    } catch (error) {
      console.error('Error saving text entry:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la note',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete and archive
  const handleDelete = async (id: string) => {
    const success = await journalService.deleteNote(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Note supprimée' });
    }
  };

  const handleArchive = async (id: string) => {
    const success = await journalService.archiveNote(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Note archivée' });
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    if (filterMode === 'voice' && entry.mode !== 'voice') return false;
    if (filterMode === 'text' && entry.mode !== 'text') return false;
    if (searchQuery && !entry.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => entry.tags?.includes(tag))) return false;
    return true;
  });

  const toggleTag = (tag: string, tagList: string[], setTagList: (tags: string[]) => void) => {
    if (tagList.includes(tag)) {
      setTagList(tagList.filter(t => t !== tag));
    } else {
      setTagList([...tagList, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Journal Vocal
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Capturez vos pensées par la voix ou par écrit. Vos notes sont automatiquement transcrites et analysées.
          </p>
        </motion.div>

        <Tabs defaultValue="record" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-lg mx-auto">
            <TabsTrigger value="record" className="gap-2">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Enregistrer</span>
            </TabsTrigger>
            <TabsTrigger value="write" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Écrire</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Record Tab */}
          <TabsContent value="record" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <VoiceRecorder
                  state={recordingState}
                  onStart={startRecording}
                  onStop={stopRecording}
                  onPause={pauseRecording}
                  onResume={resumeRecording}
                  onDiscard={discardRecording}
                  isProcessing={isProcessing}
                />

                {recordingState.audioBlob && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags (optionnel)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {COMMON_TAGS.map(tag => (
                          <Button
                            key={tag}
                            variant={voiceTags.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleTag(tag, voiceTags, setVoiceTags)}
                          >
                            #{tag}
                          </Button>
                        ))}
                      </div>
                      <Button onClick={saveVoiceEntry} className="w-full gap-2" disabled={isProcessing}>
                        <Sparkles className="w-4 h-4" />
                        {isProcessing ? 'Traitement en cours...' : 'Transcrire et sauvegarder'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Recent entries preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Entrées récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {entries.slice(0, 5).map(entry => (
                        <JournalEntryCard
                          key={entry.id}
                          entry={entry}
                          onDelete={handleDelete}
                          onArchive={handleArchive}
                        />
                      ))}
                      {entries.length === 0 && !isLoadingEntries && (
                        <p className="text-center text-muted-foreground py-8">
                          Aucune entrée pour le moment
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Write Tab */}
          <TabsContent value="write" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Nouvelle note écrite
                </CardTitle>
                <CardDescription>
                  Écrivez vos pensées, réflexions ou objectifs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Que souhaitez-vous noter aujourd'hui ?"
                  value={textEntry}
                  onChange={(e) => setTextEntry(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tags suggérés</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map(tag => (
                      <Button
                        key={tag}
                        variant={textTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTag(tag, textTags, setTextTags)}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={saveTextEntry}
                  disabled={!textEntry.trim() || isProcessing}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Sauvegarder la note
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Toutes vos notes
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                    <Select value={filterMode} onValueChange={(v) => setFilterMode(v as 'all' | 'voice' | 'text')}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tout</SelectItem>
                        <SelectItem value="voice">Vocal</SelectItem>
                        <SelectItem value="text">Texte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredEntries.map(entry => (
                        <JournalEntryCard
                          key={entry.id}
                          entry={entry}
                          onDelete={handleDelete}
                          onArchive={handleArchive}
                        />
                      ))}
                    </AnimatePresence>
                    {filteredEntries.length === 0 && (
                      <p className="text-center text-muted-foreground py-12">
                        {entries.length === 0 ? 'Aucune note enregistrée' : 'Aucun résultat'}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <StatsCard stats={stats} isLoading={isLoadingEntries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CVoiceJournalPage;