
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mic, MicOff, Play } from 'lucide-react';
import { EmotionResult, VoiceAnalysisResult } from '@/types/emotion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const maxRecordingTime = 30; // Maximum recording time in seconds

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stopTimer();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
      toast.info('Enregistrement démarré');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Impossible d\'accéder au microphone. Vérifiez vos permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast.info('Enregistrement terminé');
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxRecordingTime - 1) {
          stopRecording();
          return maxRecordingTime;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) {
      toast.error('Veuillez d\'abord enregistrer un message vocal');
      return;
    }

    try {
      setIsProcessing(true);
      setTranscription('');

      // Convert blob to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          // Remove the data URL prefix
          const base64Audio = (reader.result as string)
            .replace('data:audio/webm;base64,', '');
          
          // Call the edge function
          const { data, error } = await supabase.functions.invoke('voice-analysis', {
            body: { audio: base64Audio }
          });
          
          if (error) throw error;
          
          const result: VoiceAnalysisResult = data;
          setTranscription(result.transcription);
          
          const emotionResult: EmotionResult = {
            id: crypto.randomUUID(),
            user_id: '',
            text: result.transcription,
            audio_url: URL.createObjectURL(audioBlob),
            score: result.analysis.score || 50,
            date: new Date().toISOString(),
            ai_feedback: result.analysis.feedback
          };
          
          onScanComplete(emotionResult);
          toast.success('Analyse vocale terminée !');
        } catch (error) {
          console.error('Error analyzing audio:', error);
          toast.error('Erreur lors de l\'analyse audio');
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Erreur lors du traitement audio');
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setTranscription('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-4">
          {isRecording ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2 animate-pulse">
                <Mic className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Enregistrement en cours...</p>
              <div className="mt-2 w-full">
                <Progress value={(recordingTime / maxRecordingTime) * 100} className="h-2" />
                <p className="text-sm mt-1">{recordingTime} / {maxRecordingTime} secondes</p>
              </div>
            </div>
          ) : audioBlob ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Enregistrement terminé</p>
              <p className="text-sm text-gray-500 mt-1">
                Durée: {recordingTime} secondes
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Mic className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-600">Prêt à enregistrer</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {!isRecording && !audioBlob && (
            <Button 
              onClick={startRecording}
              disabled={isProcessing}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              Démarrer l'enregistrement
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <MicOff className="h-4 w-4" />
              Arrêter l'enregistrement
            </Button>
          )}
          
          {audioBlob && !isRecording && (
            <>
              <Button 
                onClick={playAudio}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={isProcessing}
              >
                <Play className="h-4 w-4" />
                Écouter
              </Button>
              
              <Button 
                onClick={resetRecording}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={isProcessing}
              >
                <Mic className="h-4 w-4" />
                Nouvel enregistrement
              </Button>
            </>
          )}
        </div>
      </div>
      
      {transcription && (
        <Alert>
          <AlertDescription>
            <strong>Transcription :</strong> {transcription}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2">
        <Button 
          onClick={analyzeAudio}
          disabled={!audioBlob || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Analyser l'audio
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Annuler
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground mt-2">
        <p>💡 Parlez clairement de votre état émotionnel pour une meilleure analyse</p>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
