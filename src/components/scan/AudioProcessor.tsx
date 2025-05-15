
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Microphone, MicrophoneOff, Waveform, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface AudioProcessorProps {
  onResult: (result: EmotionResult) => void;
  headerText?: string;
  subHeaderText?: string;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  headerText = "Comment vous sentez-vous aujourd'hui?",
  subHeaderText = "Parlez naturellement pendant quelques secondes pour une analyse émotionnelle"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // In a real implementation, this would start actual audio recording
    toast({
      title: "Enregistrement démarré",
      description: "Parlez pendant quelques secondes pour l'analyse",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // In a real implementation, this would stop recording and process audio
    // Here we simulate processing with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock result
      const mockResult: EmotionResult = {
        id: Math.random().toString(36).substring(2, 11),
        emotion: getRandomEmotion(),
        score: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
        confidence: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
        text: "Audio analysis",
        date: new Date().toISOString(),
        emojis: ['😊', '😌', '🙂'],
        recommendations: [
          "Prenez un moment pour vous détendre",
          "Essayez d'écouter de la musique apaisante"
        ]
      };
      
      onResult(mockResult);
    }, 2000);
  };

  const getRandomEmotion = () => {
    const emotions = ['joy', 'calm', 'anxiety', 'focus', 'neutral'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{headerText}</h2>
          <p className="text-muted-foreground">
            {subHeaderText}
          </p>
        </div>
        
        <div className="flex justify-center">
          {isRecording ? (
            <motion.div 
              className="h-20 w-full max-w-xs flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Waveform className="h-12 w-12 text-primary animate-pulse" />
              <p className="absolute bottom-0 text-sm text-muted-foreground">
                {formatTime(recordingTime)}
              </p>
            </motion.div>
          ) : isProcessing ? (
            <div className="h-20 w-full max-w-xs flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="mt-2 text-sm text-muted-foreground">
                Analyse en cours...
              </p>
            </div>
          ) : (
            <div className="h-20 w-full max-w-xs flex items-center justify-center">
              <Microphone className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          {isRecording ? (
            <Button 
              variant="destructive" 
              size="lg"
              className="rounded-full px-6"
              onClick={stopRecording}
              disabled={isProcessing}
            >
              <MicrophoneOff className="mr-2 h-4 w-4" />
              Arrêter l'enregistrement
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              className="rounded-full px-6"
              onClick={startRecording}
              disabled={isProcessing}
            >
              <Microphone className="mr-2 h-4 w-4" />
              Commencer à parler
            </Button>
          )}
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Votre voix est analysée uniquement pour détecter vos émotions et n'est pas stockée.
          Pour de meilleurs résultats, parlez pendant au moins 10-15 secondes.
        </p>
      </CardContent>
    </Card>
  );
};

export default AudioProcessor;
