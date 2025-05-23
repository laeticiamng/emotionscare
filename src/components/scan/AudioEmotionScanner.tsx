
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mic, Square, Loader2 } from 'lucide-react';
import { AudioEmotionScannerProps } from '@/types/emotion';

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };
      
      // Démarrer l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      
      // Démarrer le timer
      let time = 0;
      timerRef.current = window.setInterval(() => {
        time += 1;
        setRecordingTime(time);
        
        // Limiter l'enregistrement à 60 secondes
        if (time >= 60) {
          stopRecording();
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier vos permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Arrêter le timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Arrêter toutes les pistes du stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioBlob) {
      setError("Veuillez enregistrer un message audio d'abord.");
      return;
    }
    
    if (recordingTime < 5) {
      setError("Veuillez enregistrer au moins 5 secondes d'audio.");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Simulation d'envoi à l'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Génération de résultat simulé
      const emotionScore = Math.floor(Math.random() * 100);
      const primaryEmotion = emotionScore > 70 ? "Joie" : 
                             emotionScore > 50 ? "Sérénité" : 
                             emotionScore > 30 ? "Inquiétude" : "Stress";
      
      // Résultat simulé
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-muted'}`}>
          {isRecording ? (
            <Square className="h-8 w-8" onClick={stopRecording} />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold">{formatTime(recordingTime)}</p>
          <p className="text-sm text-muted-foreground">
            {!isRecording && !audioBlob && "Cliquez sur Enregistrer pour commencer"}
            {isRecording && "Parlez de ce que vous ressentez..."}
            {!isRecording && audioBlob && "Enregistrement terminé"}
          </p>
        </div>
        
        {!isRecording && (
          <div className={`w-full ${audioBlob ? 'py-4' : ''}`}>
            {audioBlob && (
              <audio controls className="w-full my-4">
                <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                Votre navigateur ne prend pas en charge l'élément audio.
              </audio>
            )}
            
            {!audioBlob ? (
              <Button 
                type="button" 
                onClick={startRecording} 
                className="w-full"
                disabled={isProcessing}
              >
                Enregistrer
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={startRecording} 
                variant="outline" 
                className="w-full"
                disabled={isProcessing}
              >
                Recommencer
              </Button>
            )}
          </div>
        )}
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
          type="submit" 
          disabled={!audioBlob || recordingTime < 5 || isProcessing || isRecording}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émotions'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AudioEmotionScanner;
