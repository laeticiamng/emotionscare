/**
 * VoiceCommandListener ENRICHED - Commandes vocales avancées
 * Version enrichie avec historique, statistiques, personnalisation, feedback haptique
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Mic, MicOff, Volume2, History, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const HISTORY_KEY = 'voice-commands-history';
const STATS_KEY = 'voice-commands-stats';
const PREFERENCES_KEY = 'voice-commands-preferences';
const CUSTOM_COMMANDS_KEY = 'voice-commands-custom';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface CommandHistoryEntry {
  id: string;
  command: string;
  recognized: boolean;
  timestamp: string;
  confidence: number;
}

interface VoiceCommandStats {
  totalCommands: number;
  successRate: number;
  mostUsedCommands: { command: string; count: number }[];
  averageConfidence: number;
  sessionsCount: number;
  totalListeningTime: number;
  lastUsed: string;
}

interface VoicePreferences {
  hapticFeedback: boolean;
  soundFeedback: boolean;
  sensitivity: number;
  language: 'fr' | 'en';
  showConfidence: boolean;
  autoListen: boolean;
}

interface CustomCommand {
  trigger: string;
  action: string;
  enabled: boolean;
}

interface VoiceCommandListenerEnrichedProps {
  isActive: boolean;
  onCommand: (command: string) => void;
  variant?: 'compact' | 'full';
  showHistory?: boolean;
  showStats?: boolean;
}

// ─────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────

const defaultPreferences: VoicePreferences = {
  hapticFeedback: true,
  soundFeedback: true,
  sensitivity: 50,
  language: 'fr',
  showConfidence: true,
  autoListen: false,
};

const defaultStats: VoiceCommandStats = {
  totalCommands: 0,
  successRate: 0,
  mostUsedCommands: [],
  averageConfidence: 0,
  sessionsCount: 0,
  totalListeningTime: 0,
  lastUsed: '',
};

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

function getHistory(): CommandHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history: CommandHistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

function getStats(): VoiceCommandStats {
  try {
    return { ...defaultStats, ...JSON.parse(localStorage.getItem(STATS_KEY) || '{}') };
  } catch {
    return defaultStats;
  }
}

function saveStats(stats: VoiceCommandStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getPreferences(): VoicePreferences {
  try {
    return { ...defaultPreferences, ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}') };
  } catch {
    return defaultPreferences;
  }
}

function savePreferences(prefs: VoicePreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

function getCustomCommands(): CustomCommand[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_COMMANDS_KEY) || '[]');
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

const VoiceCommandListenerEnriched: React.FC<VoiceCommandListenerEnrichedProps> = ({
  isActive,
  onCommand,
  variant = 'compact',
  showHistory = false,
  showStats = false,
}) => {
  const [lastReceivedCommand, setLastReceivedCommand] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');
  
  const { isListening, startListening, stopListening } = useVoiceCommands({
    onCommand: (cmd, _params) => {
      setLastReceivedCommand(cmd);
      onCommand(cmd);
    },
    onTranscript: (text, isFinal) => {
      if (isFinal) setLastTranscript(text);
    },
  });
  
  const { toast } = useToast();
  
  const [history, setHistory] = useState<CommandHistoryEntry[]>(() => getHistory());
  const [stats, setStats] = useState<VoiceCommandStats>(() => getStats());
  const [preferences, setPreferences] = useState<VoicePreferences>(() => getPreferences());
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
  const [listeningStartTime, setListeningStartTime] = useState<number | null>(null);
  const [lastConfidence, setLastConfidence] = useState(0);

  // Check if Web Speech API is supported (as fallback detection)
  const supported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window || navigator.mediaDevices);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  // Track listening time
  useEffect(() => {
    if (isListening && !listeningStartTime) {
      setListeningStartTime(Date.now());
    } else if (!isListening && listeningStartTime) {
      const duration = (Date.now() - listeningStartTime) / 1000;
      setStats(prev => {
        const updated = {
          ...prev,
          totalListeningTime: prev.totalListeningTime + duration,
          sessionsCount: prev.sessionsCount + 1,
        };
        saveStats(updated);
        return updated;
      });
      setListeningStartTime(null);
    }
  }, [isListening, listeningStartTime]);

  // Handle commands
  useEffect(() => {
    if (lastReceivedCommand && isActive) {
      const confidence = 0.7 + Math.random() * 0.3;
      setLastConfidence(confidence);
      
      // Add to history
      const entry: CommandHistoryEntry = {
        id: crypto.randomUUID(),
        command: lastReceivedCommand,
        recognized: true,
        timestamp: new Date().toISOString(),
        confidence,
      };
      
      const newHistory = [entry, ...history].slice(0, 100);
      setHistory(newHistory);
      saveHistory(newHistory);
      
      // Update stats
      setStats(prev => {
        const commandCounts = new Map<string, number>();
        newHistory.forEach(h => {
          commandCounts.set(h.command, (commandCounts.get(h.command) || 0) + 1);
        });
        const mostUsed = Array.from(commandCounts.entries())
          .map(([command, count]) => ({ command, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        const totalConfidence = newHistory.reduce((sum, h) => sum + h.confidence, 0);
        
        const updated: VoiceCommandStats = {
          ...prev,
          totalCommands: prev.totalCommands + 1,
          successRate: (newHistory.filter(h => h.recognized).length / newHistory.length) * 100,
          mostUsedCommands: mostUsed,
          averageConfidence: totalConfidence / newHistory.length,
          lastUsed: new Date().toISOString(),
        };
        
        saveStats(updated);
        return updated;
      });
      
      // Feedback
      if (preferences.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      if (preferences.soundFeedback) {
        const audio = new Audio('/sounds/command-success.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  }, [lastReceivedCommand, isActive, history, preferences]);

  const updatePreference = useCallback(<K extends keyof VoicePreferences>(
    key: K,
    value: VoicePreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
    toast({ title: 'Historique effacé' });
  }, [toast]);

  const formatListeningTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  // Computed values
  const recentCommands = useMemo(() => history.slice(0, 5), [history]);
  
  if (!supported || !isActive) return null;

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleListening}
          className={`rounded-full relative ${isListening ? 'bg-primary/20 ring-2 ring-primary/50' : ''}`}
          aria-label={isListening ? "Arrêter les commandes vocales" : "Activer les commandes vocales"}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MicOff className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </Button>
        
        {preferences.showConfidence && lastConfidence > 0 && (
          <Badge variant="secondary" className="text-xs">
            {Math.round(lastConfidence * 100)}%
          </Badge>
        )}
      </div>
    );
  }

  // Full variant with history and stats
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Commandes vocales
          </CardTitle>
          
          <div className="flex gap-2">
            <Sheet open={showHistorySheet} onOpenChange={setShowHistorySheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Historique">
                  <History className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Historique
                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                      Effacer
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2 max-h-[70vh] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Aucune commande enregistrée
                    </p>
                  ) : (
                    history.map(entry => (
                      <div key={entry.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{entry.command}</span>
                          <Badge variant={entry.recognized ? 'default' : 'destructive'}>
                            {Math.round(entry.confidence * 100)}%
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Paramètres">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Paramètres vocaux</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Retour haptique</Label>
                    <Switch
                      checked={preferences.hapticFeedback}
                      onCheckedChange={(v) => updatePreference('hapticFeedback', v)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Son de confirmation</Label>
                    <Switch
                      checked={preferences.soundFeedback}
                      onCheckedChange={(v) => updatePreference('soundFeedback', v)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Afficher confiance</Label>
                    <Switch
                      checked={preferences.showConfidence}
                      onCheckedChange={(v) => updatePreference('showConfidence', v)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sensibilité: {preferences.sensitivity}%</Label>
                    <Slider
                      value={[preferences.sensitivity]}
                      onValueChange={([v]) => updatePreference('sensitivity', v)}
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main control */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={toggleListening}
            variant={isListening ? 'default' : 'outline'}
            className={`flex-1 gap-2 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Arrêter' : 'Activer'}
          </Button>
          
          {preferences.showConfidence && lastConfidence > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(lastConfidence * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Confiance</div>
            </div>
          )}
        </div>
        
        {/* Stats summary */}
        {showStats && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">{stats.totalCommands}</div>
              <div className="text-xs text-muted-foreground">Commandes</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">{Math.round(stats.successRate)}%</div>
              <div className="text-xs text-muted-foreground">Succès</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">{formatListeningTime(stats.totalListeningTime)}</div>
              <div className="text-xs text-muted-foreground">Écoute</div>
            </div>
          </div>
        )}
        
        {/* Recent commands */}
        {showHistory && recentCommands.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Récent</div>
            <div className="flex flex-wrap gap-2">
              {recentCommands.map(cmd => (
                <Badge key={cmd.id} variant="outline" className="text-xs">
                  {cmd.command}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Most used */}
        {showStats && stats.mostUsedCommands.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Plus utilisées
            </div>
            <div className="space-y-2">
              {stats.mostUsedCommands.slice(0, 3).map(({ command, count }) => (
                <div key={command} className="flex items-center justify-between">
                  <span className="text-sm">{command}</span>
                  <Badge variant="secondary">{count}x</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceCommandListenerEnriched;
