// @ts-nocheck
/**
 * JournalVoiceMode - Mode dictée vocale pour le journal
 * Permet de dicter ses entrées de journal par la voix
 */

import React, { useState, useRef, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, MicOff, Pause, Play, Save, Trash2, 
  Wand2, Languages, Volume2, Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type RecordingState = 'idle' | 'recording' | 'paused' | 'processing';

interface JournalVoiceModeProps {
  onSave?: (content: string) => void;
  initialContent?: string;
}

const JournalVoiceMode = memo(({ onSave, initialContent = '' }: JournalVoiceModeProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState(initialContent);
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 128000 });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = () => {
        // Les chunks audio sont traités ici
      };

      mediaRecorder.onstop = async () => {
        setState('processing');
        
        // Simulation de transcription (en production: API Whisper)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockTranscription = "Aujourd'hui, je me suis senti particulièrement serein. " +
          "J'ai pris le temps de méditer ce matin et cela a vraiment changé ma journée. " +
          "Je ressens une gratitude profonde pour les petites choses de la vie.";
        
        setTranscript(prev => prev ? `${prev}\n\n${mockTranscription}` : mockTranscription);
        setState('idle');
        
        toast({
          title: 'Transcription terminée',
          description: 'Votre enregistrement a été converti en texte'
        });
      };

      mediaRecorder.start();
      setState('recording');

      // Timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: 'Enregistrement démarré',
        description: 'Parlez naturellement...'
      });
    } catch (error) {
      toast({
        title: 'Erreur microphone',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [state]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.pause();
      setState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [state]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === 'paused') {
      mediaRecorderRef.current.resume();
      setState('recording');
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  }, [state]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (!transcript.trim()) {
      toast({
        title: 'Contenu vide',
        description: 'Veuillez enregistrer ou écrire quelque chose',
        variant: 'destructive'
      });
      return;
    }
    onSave?.(transcript);
    toast({
      title: 'Entrée sauvegardée',
      description: 'Votre journal a été mis à jour'
    });
  };

  const handleClear = () => {
    setTranscript('');
    setDuration(0);
  };

  const enhanceWithAI = async () => {
    setState('processing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const enhanced = transcript + 
      "\n\n💡 Insight IA: Votre entrée reflète un état de bien-être et de gratitude. " +
      "Continuez à cultiver ces moments de pleine conscience.";
    
    setTranscript(enhanced);
    setState('idle');
    
    toast({
      title: 'Enrichissement IA',
      description: 'Insights ajoutés à votre entrée'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Mode Dictée Vocale
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={language === 'fr' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setLanguage('fr')}
            >
              🇫🇷 FR
            </Badge>
            <Badge 
              variant={language === 'en' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setLanguage('en')}
            >
              🇬🇧 EN
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone de contrôle d'enregistrement */}
        <div className="flex items-center justify-center gap-4 p-6 rounded-lg bg-muted/50">
          {state === 'idle' && (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full"
              onClick={startRecording}
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}

          {state === 'recording' && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-12 rounded-full"
                onClick={pauseRecording}
              >
                <Pause className="h-5 w-5" />
              </Button>
              
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <MicOff className="h-6 w-6 text-white" onClick={stopRecording} />
                </motion.div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Clock className="h-3 w-3" />
                  {formatDuration(duration)}
                </div>
              </div>

              <Button
                size="lg"
                variant="destructive"
                className="h-12 w-12 rounded-full"
                onClick={stopRecording}
              >
                <MicOff className="h-5 w-5" />
              </Button>
            </>
          )}

          {state === 'paused' && (
            <>
              <Button
                size="lg"
                className="h-16 w-16 rounded-full bg-yellow-500 hover:bg-yellow-600"
                onClick={resumeRecording}
              >
                <Play className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-12 w-12 rounded-full"
                onClick={stopRecording}
              >
                <MicOff className="h-5 w-5" />
              </Button>
            </>
          )}

          {state === 'processing' && (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
              />
              <p className="mt-2 text-sm text-muted-foreground">Transcription en cours...</p>
            </div>
          )}
        </div>

        {/* Indicateur de statut */}
        {state !== 'idle' && state !== 'processing' && (
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: state === 'recording' ? [4, 16, 4] : 4,
                  transition: {
                    repeat: Infinity,
                    duration: 0.5,
                    delay: i * 0.1
                  }
                }}
                className="w-1 bg-primary rounded-full"
                style={{ height: 4 }}
              />
            ))}
          </div>
        )}

        {/* Zone de texte */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Transcription</label>
            <span className="text-xs text-muted-foreground">
              {transcript.length} caractères
            </span>
          </div>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Votre texte transcrit apparaîtra ici, ou vous pouvez écrire directement..."
            className="min-h-[200px] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={enhanceWithAI}
            disabled={!transcript.trim() || state === 'processing'}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Enrichir avec IA
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleClear}
            disabled={!transcript.trim()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Effacer
          </Button>

          <div className="flex-1" />

          <Button 
            onClick={handleSave}
            disabled={!transcript.trim() || state === 'processing'}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        {/* Conseils */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            💡 Astuce: Parlez clairement et faites des pauses naturelles entre les phrases 
            pour une meilleure transcription. Vous pouvez éditer le texte après.
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

JournalVoiceMode.displayName = 'JournalVoiceMode';

export default JournalVoiceMode;
