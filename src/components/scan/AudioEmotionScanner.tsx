
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

const AudioEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioData(audioBlob);
        stopTimer();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
      
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const analyzeAudio = async () => {
    if (!audioData) return;

    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock emotion analysis based on voice
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'Sérénité', intensity: 78 },
          { name: 'Assurance', intensity: 72 },
          { name: 'Énergie', intensity: 65 }
        ],
        confidence: 83,
        timestamp: new Date(),
        recommendations: 'Votre ton de voix indique un état d\'esprit équilibré. Excellente base pour la journée !',
        analysisType: 'audio'
      };

      onScanComplete(mockResult);
      setIsProcessing(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setAudioData(null);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
          <Mic className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analyse vocale</h3>
        <p className="text-muted-foreground">
          Parlez pendant quelques secondes pour analyser votre état émotionnel
        </p>
      </div>

      <div className="text-center space-y-4">
        {/* Recording Controls */}
        <div className="flex justify-center">
          {!isRecording && !audioData ? (
            <Button
              onClick={startRecording}
              size="lg"
              className="rounded-full w-20 h-20"
              disabled={isProcessing}
            >
              <Mic className="h-8 w-8" />
            </Button>
          ) : isRecording ? (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="rounded-full w-20 h-20"
            >
              <Square className="h-8 w-8" />
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button
                onClick={resetRecording}
                variant="outline"
                className="rounded-full w-16 h-16"
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {/* Timer */}
        {(isRecording || audioData) && (
          <div className="text-2xl font-mono">
            {formatTime(recordingTime)}
          </div>
        )}

        {/* Status */}
        <div className="text-sm text-muted-foreground">
          {isRecording && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Enregistrement en cours...</span>
            </div>
          )}
          {audioData && !isRecording && (
            <span>Enregistrement terminé • Prêt pour l'analyse</span>
          )}
          {!isRecording && !audioData && (
            <span>Cliquez sur le microphone pour commencer</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            disabled={isProcessing || isRecording}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button 
            onClick={analyzeAudio}
            disabled={!audioData || isProcessing || isRecording}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Analyser l'audio
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Conseils pour une meilleure analyse :</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Parlez dans un environnement calme</li>
          <li>• Exprimez-vous naturellement</li>
          <li>• Enregistrez au moins 10 secondes</li>
          <li>• Décrivez comment vous vous sentez</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
