import React, { useState, useRef } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Type, 
  Smile,
  Heart,
  Brain,
  Zap,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmotionResult {
  score: number;
  primaryEmotion: string;
  emotions: Record<string, number>;
  text?: string;
  audio?: string;
  aiFeedback: string;
}

interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({ onScanComplete, onClose }) => {
  const [mode, setMode] = useState<'text' | 'voice' | 'emoji'>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const emojiOptions = [
    '😊', '😔', '😤', '😰', '😍', '🤔', '😴', '😎', 
    '🥳', '😢', '😡', '😌', '🤗', '😱', '🙄', '😇'
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudioEmotion(audioBlob);
      };
    }
  };

  const processTextEmotion = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir du texte');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call Hume AI for emotion analysis
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { text: textInput, type: 'text' }
      });

      if (error) throw error;

      const result: EmotionResult = {
        score: data.averageScore || 75,
        primaryEmotion: data.topEmotion || 'neutral',
        emotions: data.emotions || { neutral: 0.7, joy: 0.2, sadness: 0.1 },
        text: textInput,
        aiFeedback: data.feedback || 'Analyse émotionnelle complétée avec succès.'
      };

      onScanComplete(result);
      toast.success('Analyse émotionnelle terminée !');
      
    } catch (error) {
      logger.error('Error analyzing text emotion', error as Error, 'EMOTION');
      toast.error('Erreur lors de l\'analyse émotionnelle');
    } finally {
      setIsProcessing(false);
    }
  };

  const processAudioEmotion = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      const base64Audio = btoa(binaryString);

      // First transcribe with OpenAI Whisper
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-analysis', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) throw transcriptionError;

      // Then analyze emotions with Hume AI
      const { data: emotionData, error: emotionError } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          audio: base64Audio,
          text: transcriptionData.text,
          type: 'audio' 
        }
      });

      if (emotionError) throw emotionError;

      const result: EmotionResult = {
        score: emotionData.averageScore || 70,
        primaryEmotion: emotionData.topEmotion || 'neutral',
        emotions: emotionData.emotions || { neutral: 0.6, joy: 0.3, sadness: 0.1 },
        text: transcriptionData.text,
        audio: base64Audio,
        aiFeedback: emotionData.feedback || 'Analyse vocale complétée avec succès.'
      };

      onScanComplete(result);
      toast.success('Analyse vocale terminée !');
      
    } catch (error) {
      logger.error('Error analyzing audio emotion', error as Error, 'EMOTION');
      toast.error('Erreur lors de l\'analyse vocale');
    } finally {
      setIsProcessing(false);
    }
  };

  const processEmojiEmotion = async () => {
    if (selectedEmojis.length === 0) {
      toast.error('Veuillez sélectionner au moins un emoji');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate emoji-based emotion analysis
      const emojiText = selectedEmojis.join(' ');
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          text: `User selected emojis: ${emojiText}`,
          emojis: selectedEmojis,
          type: 'emoji' 
        }
      });

      if (error) throw error;

      const result: EmotionResult = {
        score: data.averageScore || 80,
        primaryEmotion: data.topEmotion || 'joy',
        emotions: data.emotions || { joy: 0.6, excitement: 0.3, contentment: 0.1 },
        text: `Émojis sélectionnés: ${emojiText}`,
        aiFeedback: data.feedback || 'Analyse basée sur vos émojis complétée.'
      };

      onScanComplete(result);
      toast.success('Analyse des émojis terminée !');
      
    } catch (error) {
      logger.error('Error analyzing emoji emotion', error as Error, 'EMOTION');
      toast.error('Erreur lors de l\'analyse des émojis');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleEmojiSelection = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Analyse Émotionnelle
              </span>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </CardTitle>
            <CardDescription>
              Choisissez votre méthode d'analyse préférée
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div className="flex space-x-2">
              <Button
                variant={mode === 'text' ? 'default' : 'outline'}
                onClick={() => setMode('text')}
                className="flex-1"
              >
                <Type className="mr-2 h-4 w-4" />
                Texte
              </Button>
              <Button
                variant={mode === 'voice' ? 'default' : 'outline'}
                onClick={() => setMode('voice')}
                className="flex-1"
              >
                <Mic className="mr-2 h-4 w-4" />
                Voix
              </Button>
              <Button
                variant={mode === 'emoji' ? 'default' : 'outline'}
                onClick={() => setMode('emoji')}
                className="flex-1"
              >
                <Smile className="mr-2 h-4 w-4" />
                Émojis
              </Button>
            </div>

            {/* Text Mode */}
            {mode === 'text' && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Comment vous sentez-vous ? Décrivez vos émotions, votre journée, vos pensées..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-32"
                />
                <Button 
                  onClick={processTextEmotion}
                  disabled={isProcessing || !textInput.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyser le texte
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Voice Mode */}
            {mode === 'voice' && (
              <div className="space-y-4 text-center">
                <div className="flex flex-col items-center space-y-4">
                  {isRecording ? (
                    <>
                      <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Square className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-medium">Enregistrement en cours...</div>
                        <div className="text-sm text-muted-foreground">{formatTime(recordingTime)}</div>
                      </div>
                      <Button onClick={stopRecording} variant="destructive">
                        <Square className="mr-2 h-4 w-4" />
                        Arrêter l'enregistrement
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-medium">Prêt à enregistrer</div>
                        <div className="text-sm text-muted-foreground">Parlez de vos émotions</div>
                      </div>
                      <Button 
                        onClick={startRecording}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        <Mic className="mr-2 h-4 w-4" />
                        Commencer l'enregistrement
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Emoji Mode */}
            {mode === 'emoji' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">Comment vous sentez-vous ?</div>
                  <div className="text-sm text-muted-foreground">Sélectionnez les émojis qui correspondent à votre état</div>
                </div>
                
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant={selectedEmojis.includes(emoji) ? 'default' : 'outline'}
                      onClick={() => toggleEmojiSelection(emoji)}
                      className="text-2xl h-12 w-12 p-0"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
                
                {selectedEmojis.length > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Sélectionnés:</div>
                    <div className="text-2xl">{selectedEmojis.join(' ')}</div>
                  </div>
                )}
                
                <Button 
                  onClick={processEmojiEmotion}
                  disabled={isProcessing || selectedEmojis.length === 0}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Analyser les émojis
                    </>
                  )}
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="text-center space-y-2">
                <Progress value={33} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Analyse de vos émotions avec l'IA...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmotionScanner;
