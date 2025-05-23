
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mic, Square, Play, Pause } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

interface AudioEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Enregistrement démarré');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Enregistrement terminé');
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) {
      toast.error('Aucun enregistrement disponible');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('voice-analysis', {
            body: { audio: base64Audio }
          });

          if (error) throw error;

          const result: EmotionResult = {
            id: crypto.randomUUID(),
            user_id: '',
            text: data.transcription || '',
            audio_url: audioUrl || '',
            score: data.analysis?.score || 50,
            date: new Date().toISOString(),
            ai_feedback: data.analysis?.feedback || 'Analyse vocale complétée'
          };

          onScanComplete(result);
          toast.success('Analyse vocale terminée !');
        } catch (error) {
          console.error('Error analyzing audio:', error);
          toast.error('Erreur lors de l\'analyse vocale');
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Erreur lors du traitement de l\'audio');
      setIsProcessing(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold mb-2">Enregistrement vocal</h3>
        <p className="text-sm text-muted-foreground">
          Parlez de votre état émotionnel pendant 10-30 secondes
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!isRecording && !audioBlob && (
          <Button 
            onClick={startRecording}
            size="lg"
            className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600"
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && (
          <div className="text-center">
            <Button 
              onClick={stopRecording}
              size="lg"
              className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 animate-pulse"
            >
              <Square className="h-8 w-8" />
            </Button>
            <p className="text-sm text-red-600 mt-2 font-medium">
              Enregistrement en cours...
            </p>
          </div>
        )}

        {audioBlob && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={playAudio}
                variant="outline"
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button 
                onClick={resetRecording}
                variant="outline"
                size="sm"
              >
                Nouvel enregistrement
              </Button>
            </div>
            
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              />
            )}
          </div>
        )}
      </div>

      {/* Analysis Button */}
      {audioBlob && (
        <div className="flex space-x-2">
          <Button 
            onClick={analyzeAudio}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mic className="h-4 w-4 mr-2" />
            )}
            Analyser l'enregistrement
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
        </div>
      )}

      {!audioBlob && !isRecording && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioEmotionScanner;
