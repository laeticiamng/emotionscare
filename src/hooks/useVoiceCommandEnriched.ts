// @ts-nocheck

import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface VoiceCommand {
  id: string;
  phrase: string;
  timestamp: string;
  recognized: boolean;
  confidence?: number;
}

interface VoiceCommandStats {
  totalCommands: number;
  successRate: number;
  mostUsed: string[];
  averageConfidence: number;
  sessionDuration: number;
}

interface CustomCommand {
  id: string;
  phrase: string;
  action: string;
  createdAt: string;
  usageCount: number;
}

interface UseVoiceCommandEnrichedProps {
  commands?: Record<string, () => void>;
  autoStart?: boolean;
  language?: string;
  continuous?: boolean;
}

const STORAGE_KEY = 'emotionscare_voice_commands';
const CUSTOM_COMMANDS_KEY = 'emotionscare_custom_voice_commands';

const useVoiceCommandEnriched = ({
  commands = {},
  autoStart = false,
  language = 'fr-FR',
  continuous = false
}: UseVoiceCommandEnrichedProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [customCommands, setCustomCommands] = useState<CustomCommand[]>([]);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [stats, setStats] = useState<VoiceCommandStats | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Charger l'historique et les commandes personnalisées
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          setCommandHistory(JSON.parse(storedHistory));
        }

        const storedCustom = localStorage.getItem(CUSTOM_COMMANDS_KEY);
        if (storedCustom) {
          setCustomCommands(JSON.parse(storedCustom));
        }
      } catch (error) {
        logger.error('Erreur chargement historique vocal', error as Error, 'UI');
      }
    };

    loadFromStorage();
  }, []);

  // Calculer les statistiques
  const calculateStats = useCallback((): VoiceCommandStats => {
    const total = commandHistory.length;
    const recognized = commandHistory.filter(c => c.recognized).length;
    const successRate = total > 0 ? (recognized / total) * 100 : 0;

    const phraseCount = new Map<string, number>();
    commandHistory.forEach(c => {
      if (c.recognized) {
        phraseCount.set(c.phrase, (phraseCount.get(c.phrase) || 0) + 1);
      }
    });

    const mostUsed = Array.from(phraseCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([phrase]) => phrase);

    const avgConfidence = commandHistory
      .filter(c => c.confidence)
      .reduce((sum, c, _, arr) => sum + (c.confidence || 0) / arr.length, 0);

    const sessionDuration = sessionStart
      ? (Date.now() - sessionStart.getTime()) / 1000
      : 0;

    return {
      totalCommands: total,
      successRate: Math.round(successRate),
      mostUsed,
      averageConfidence: Math.round(avgConfidence * 100),
      sessionDuration: Math.round(sessionDuration)
    };
  }, [commandHistory, sessionStart]);

  useEffect(() => {
    setStats(calculateStats());
  }, [commandHistory, calculateStats]);

  // Sauvegarder l'historique
  const saveHistory = useCallback((history: VoiceCommand[]) => {
    try {
      // Garder les 500 dernières commandes
      const trimmed = history.slice(-500);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setCommandHistory(trimmed);
    } catch (error) {
      logger.error('Erreur sauvegarde historique vocal', error as Error, 'UI');
    }
  }, []);

  // Ajouter une commande personnalisée
  const addCustomCommand = useCallback((phrase: string, action: string) => {
    const newCommand: CustomCommand = {
      id: Date.now().toString(),
      phrase: phrase.toLowerCase(),
      action,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    const updated = [...customCommands, newCommand];
    setCustomCommands(updated);
    localStorage.setItem(CUSTOM_COMMANDS_KEY, JSON.stringify(updated));

    toast({
      title: 'Commande ajoutée',
      description: `"${phrase}" → ${action}`
    });

    return newCommand.id;
  }, [customCommands, toast]);

  // Supprimer une commande personnalisée
  const removeCustomCommand = useCallback((id: string) => {
    const updated = customCommands.filter(c => c.id !== id);
    setCustomCommands(updated);
    localStorage.setItem(CUSTOM_COMMANDS_KEY, JSON.stringify(updated));
  }, [customCommands]);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const hasSpeechRecognition = !!SpeechRecognition;
    setIsSupported(hasSpeechRecognition);

    if (!hasSpeechRecognition) {
      logger.info('Speech recognition not supported in this browser', {}, 'UI');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      processCommand(transcript, confidence);
    };

    recognition.onerror = (event: any) => {
      logger.error('Erreur reconnaissance vocale', { error: event.error }, 'UI');
      if (event.error !== 'no-speech') {
        toast({
          title: 'Erreur vocale',
          description: `Erreur: ${event.error}`,
          variant: 'destructive'
        });
      }
    };

    recognition.onend = () => {
      if (continuous && isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    if (autoStart) {
      startListening();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      setIsListening(true);
      setSessionStart(new Date());
      recognitionRef.current.start();
      
      toast({
        title: 'Commandes vocales activées',
        description: 'Je vous écoute...'
      });

      logger.info('Voice recognition started', {}, 'UI');
    } catch (error) {
      logger.error('Error starting voice recognition', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'activer la reconnaissance vocale',
        variant: 'destructive'
      });
      setIsListening(false);
    }
  }, [isSupported, toast]);

  const stopListening = useCallback(() => {
    if (!isListening || !recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
    
    toast({
      title: 'Commandes vocales désactivées',
      description: `Session: ${stats?.sessionDuration || 0}s, ${commandHistory.length} commandes`
    });

    logger.info('Voice recognition stopped', { stats }, 'UI');
  }, [isListening, toast, stats, commandHistory.length]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Traitement des commandes
  const processCommand = useCallback((command: string, confidence?: number) => {
    setTranscript(command);

    const newEntry: VoiceCommand = {
      id: Date.now().toString(),
      phrase: command,
      timestamp: new Date().toISOString(),
      recognized: false,
      confidence
    };

    // Vérifier les commandes personnalisées d'abord
    const matchedCustom = customCommands.find(c =>
      command.toLowerCase().includes(c.phrase)
    );

    if (matchedCustom) {
      newEntry.recognized = true;
      
      // Incrémenter le compteur d'utilisation
      const updatedCustom = customCommands.map(c =>
        c.id === matchedCustom.id ? { ...c, usageCount: c.usageCount + 1 } : c
      );
      setCustomCommands(updatedCustom);
      localStorage.setItem(CUSTOM_COMMANDS_KEY, JSON.stringify(updatedCustom));

      toast({
        title: 'Commande personnalisée reconnue',
        description: `"${command}" → ${matchedCustom.action}`
      });

      saveHistory([...commandHistory, newEntry]);
      return;
    }

    // Vérifier les commandes prédéfinies
    for (const [phrase, callback] of Object.entries(commands)) {
      if (command.toLowerCase().includes(phrase.toLowerCase())) {
        newEntry.recognized = true;
        
        toast({
          title: 'Commande reconnue',
          description: `"${command}"`
        });

        callback();
        break;
      }
    }

    if (!newEntry.recognized) {
      toast({
        title: 'Commande non reconnue',
        description: `Désolé, je n'ai pas compris "${command}"`
      });
    }

    saveHistory([...commandHistory, newEntry]);
  }, [commands, customCommands, commandHistory, saveHistory, toast]);

  // Exporter l'historique
  const exportHistory = useCallback((format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const headers = 'ID,Phrase,Timestamp,Recognized,Confidence\n';
      const rows = commandHistory.map(c =>
        `${c.id},"${c.phrase}",${c.timestamp},${c.recognized},${c.confidence || ''}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      history: commandHistory,
      customCommands,
      stats: calculateStats(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [commandHistory, customCommands, calculateStats]);

  // Télécharger l'historique
  const downloadHistory = useCallback((format: 'json' | 'csv' = 'json') => {
    const content = exportHistory(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-commands-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportHistory]);

  // Effacer l'historique
  const clearHistory = useCallback(() => {
    setCommandHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: 'Historique effacé',
      description: 'Toutes les commandes vocales ont été supprimées'
    });
  }, [toast]);

  // Obtenir les commandes favorites
  const getFavoriteCommands = useCallback(() => {
    const phraseCount = new Map<string, number>();
    commandHistory.filter(c => c.recognized).forEach(c => {
      phraseCount.set(c.phrase, (phraseCount.get(c.phrase) || 0) + 1);
    });

    return Array.from(phraseCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase, count]) => ({ phrase, count }));
  }, [commandHistory]);

  return {
    isListening,
    isSupported,
    transcript,
    commandHistory,
    customCommands,
    stats,
    startListening,
    stopListening,
    toggleListening,
    addCustomCommand,
    removeCustomCommand,
    exportHistory,
    downloadHistory,
    clearHistory,
    getFavoriteCommands,
    sessionDuration: stats?.sessionDuration || 0
  };
};

export default useVoiceCommandEnriched;
