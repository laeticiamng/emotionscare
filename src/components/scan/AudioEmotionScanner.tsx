
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mic, Square, Play, Pause } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setRecordingTime(0);
      
      // Start timer
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      
      audio.play();
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError("Veuillez enregistrer un message audio.");
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
      const emotionScore = Math.min(Math.floor(50 + (recordingTime * 2) + Math.random() * 30), 100);
      const primaryEmotion = emotionScore > 75 ? "Enthousiasme" : 
                             emotionScore > 60 ? "Calme" : 
                             emotionScore > 45 ? "Réflexion" : "Inquiétude";
      
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
    <div className="space-y-6">
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
        
        {/* Recording Controls */}
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="text-2xl font-mono">
            {formatTime(recordingTime)}
          </div>
          
          {!isRecording && !audioBlob && (
            <Button 
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600"
              disabled={isProcessing}
            >
              <Mic className="h-8 w-8" />
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 animate-pulse"
            >
              <Square className="h-8 w-8" />
            </Button>
          )}
          
          {audioBlob && !isRecording && (
            <div className="space-y-3">
              <div className="flex justify-center space-x-3">
                {!isPlaying ? (
                  <Button 
                    onClick={playRecording}
                    variant="outline"
                    className="rounded-full"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    onClick={pauseRecording}
                    variant="outline"
                    className="rounded-full"
                  >
                    <Pause className="h-5 w-5" />
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setAudioBlob(null);
                    setRecordingTime(0);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Recommencer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Durée: {formatTime(recordingTime)} - Cliquez sur lecture pour écouter
              </p>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Parlez clairement et naturellement</p>
          <p>• Décrivez vos émotions et ressentis</p>
          <p>• L'analyse se base sur votre ton et votre débit</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!audioBlob || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mon message'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
