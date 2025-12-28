// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { Mic, MicOff, Square, Play } from 'lucide-react';

const AudioEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Compteur de temps
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      // Microphone access error
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);

    // Simuler l'analyse audio
    setTimeout(() => {
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'Assurance', intensity: 72 },
          { name: 'Détermination', intensity: 65 },
          { name: 'Calme', intensity: 58 }
        ],
        confidence: 78,
        timestamp: new Date(),
        recommendations: 'Votre voix exprime de la confiance. Continuez à cultiver cette assurance !',
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

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
          <Mic className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analyse vocale</h3>
        <p className="text-muted-foreground">
          Parlez pendant 15-30 secondes pour analyser vos émotions
        </p>
      </div>

      <div className="space-y-4">
        {!audioBlob ? (
          <div className="text-center space-y-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="w-full"
                disabled={isProcessing}
              >
                <Mic className="mr-2 h-5 w-5" />
                Commencer l'enregistrement
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 p-6 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                  <div className="text-sm text-muted-foreground">Enregistrement...</div>
                </div>
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                  className="w-full"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Arrêter l'enregistrement
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
              <Play className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm">Enregistrement terminé ({formatTime(recordingTime)})</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  setAudioBlob(null);
                  setRecordingTime(0);
                }}
                variant="outline"
                disabled={isProcessing}
                className="flex-1"
              >
                Recommencer
              </Button>
              <Button
                onClick={analyzeAudio}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <Button 
          onClick={onCancel} 
          variant="ghost" 
          disabled={isProcessing || isRecording}
          className="w-full"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
