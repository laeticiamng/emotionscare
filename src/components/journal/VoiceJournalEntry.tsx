/**
 * Voice Journal Entry - Entrée journal avec transcription vocale et prompts IA
 * Permet de dicter ses pensées et reçoit des suggestions de réflexion
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'gratitude' | 'emotion' | 'growth' | 'mindfulness';
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

const CATEGORY_COLORS = {
  gratitude: 'bg-amber-500/10 text-amber-600 border-amber-200',
  emotion: 'bg-rose-500/10 text-rose-600 border-rose-200',
  growth: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  mindfulness: 'bg-sky-500/10 text-sky-600 border-sky-200'
};

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Générer un prompt initial
    generateNewPrompt();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const generateNewPrompt = () => {
    const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio analyzer for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      
      // Animate audio level
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
        
        // Simuler la transcription
        setIsTranscribing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Texte simulé basé sur la durée d'enregistrement
        const sampleTexts = [
          "Je me sens plutôt bien aujourd'hui. J'ai eu une bonne conversation avec un ami et ça m'a remonté le moral.",
          "Cette journée a été difficile. J'ai eu beaucoup de stress au travail mais j'essaie de rester positif.",
          "Je suis reconnaissant pour les petites choses. Le soleil ce matin, un bon café, un moment de calme.",
          "J'ai réfléchi à mes objectifs et je me rends compte que j'ai fait du progrès cette semaine."
        ];
        
        const newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTranscription(prev => prev ? `${prev}\n\n${newText}` : newText);
        setIsTranscribing(false);
        
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
    
    // Simuler la génération IA
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

  return (
    <div className="space-y-6">
      {/* Prompt de réflexion */}
      {currentPrompt && (
        <Card className={`border ${CATEGORY_COLORS[currentPrompt.category]}`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" />
                <div>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {currentPrompt.category === 'gratitude' && 'Gratitude'}
                    {currentPrompt.category === 'emotion' && 'Émotion'}
                    {currentPrompt.category === 'growth' && 'Croissance'}
                    {currentPrompt.category === 'mindfulness' && 'Pleine conscience'}
                  </Badge>
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

      {/* Zone d'enregistrement vocal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Dictée vocale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isRecording ? 'destructive' : 'default'}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className="h-16 w-16 rounded-full"
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            {isRecording && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full bg-destructive animate-pulse"
                  />
                  <span className="font-mono text-lg">{formatDuration(recordingDuration)}</span>
                </div>
                
                {/* Visualisation audio */}
                <div className="flex items-end gap-0.5 h-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: Math.max(4, audioLevel * 32 * (0.5 + Math.random() * 0.5))
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

      {/* Zone de texte */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Votre réflexion</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {transcription.length} caractères
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Écrivez ou dictez vos pensées..."
            className="min-h-[200px] resize-none"
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
            
            <Button disabled={!transcription.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestion IA */}
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
                  <div>
                    <h4 className="font-semibold mb-2">Réflexion de l'IA</h4>
                    <p className="text-muted-foreground">{aiSuggestion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceJournalEntry;
