
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mic, MicOff, Play, Square } from 'lucide-react';
import { AudioEmotionScannerProps } from '@/types/emotion';

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
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
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer pour l'enregistrement
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError("Impossible d'accéder au microphone. Vérifiez vos permissions.");
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

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError("Veuillez enregistrer un message vocal.");
      return;
    }

    if (recordingTime < 3) {
      setError("L'enregistrement doit durer au moins 3 secondes.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Génération de résultat simulé basé sur la durée
      const emotionScore = Math.min(Math.max(Math.floor(Math.random() * 100), 20), 95);
      const primaryEmotion = emotionScore > 70 ? "Confiance" : 
                             emotionScore > 50 ? "Sérénité" : 
                             emotionScore > 30 ? "Préoccupation" : "Fatigue";

      const result = {
        score: emotionScore,
        primaryEmotion,
        audio: URL.createObjectURL(audioBlob),
        emotions: {
          joie: Math.random(),
          tristesse: Math.random(),
          colère: Math.random(),
          peur: Math.random(),
          surprise: Math.random(),
        }
      };

      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Enregistrez un message vocal de 10 à 60 secondes décrivant comment vous vous sentez.
        </p>

        <div className="flex flex-col items-center space-y-4">
          {!isRecording && !audioBlob && (
            <Button 
              onClick={startRecording}
              disabled={isProcessing}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600"
            >
              <Mic className="h-8 w-8 text-white" />
            </Button>
          )}

          {isRecording && (
            <div className="flex flex-col items-center space-y-2">
              <Button 
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 animate-pulse"
              >
                <Square className="h-8 w-8 text-white" />
              </Button>
              <div className="text-lg font-mono text-red-600">
                {formatTime(recordingTime)}
              </div>
              <p className="text-sm text-muted-foreground">
                Cliquez pour arrêter l'enregistrement
              </p>
            </div>
          )}

          {audioBlob && !isRecording && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={playRecording}
                  variant="outline"
                  className="w-16 h-16 rounded-full"
                >
                  <Play className="h-6 w-6" />
                </Button>
                <div>
                  <p className="font-medium">Enregistrement terminé</p>
                  <p className="text-sm text-muted-foreground">
                    Durée: {formatTime(recordingTime)}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={startRecording}
                variant="outline"
                size="sm"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Enregistrer à nouveau
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Parlez clairement et naturellement</p>
          <p>• Décrivez vos émotions et votre état d'esprit</p>
          <p>• L'analyse vocale détecte les nuances émotionnelles</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing || isRecording}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!audioBlob || isProcessing || isRecording}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser l\'enregistrement'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
