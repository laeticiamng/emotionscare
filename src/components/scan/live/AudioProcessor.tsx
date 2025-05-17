
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: string) => void;
  autoStop?: boolean;
  duration?: number;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onError,
  autoStop = true,
  duration = 5000,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isRecording && autoStop) {
      timeoutId = setTimeout(() => {
        stopRecording();
      }, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [isRecording, autoStop, duration]);

  const startRecording = async () => {
    setIsProcessing?.(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const fullBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(fullBlob);
        setIsRecording(false);
        setIsProcessing?.(false);
        await processAudio(fullBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err: any) {
      setError(`Erreur lors du démarrage de l'enregistrement audio: ${err.message}`);
      onError?.(`Erreur lors du démarrage de l'enregistrement audio: ${err.message}`);
      setIsProcessing?.(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing?.(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing?.(true);
    // Simulate audio processing with a mock result
    const mockResult = {
      emotion: 'Happy',
      intensity: Math.random(),
      score: Math.random() * 100,
      feedback: 'Voix joyeuse détectée',
    };
    
    // Update to use the correct properties
    if (onResult && mockResult) {
      onResult({
        id: 'mock-id-' + Date.now(),
        emotion: mockResult.emotion,
        score: mockResult.score,
        confidence: 0.85,
        text: "Sample text",
        emojis: ["😊"],
        recommendations: [
          "Take a moment to appreciate your positive mood",
          "Share your happiness with someone"
        ],
        intensity: mockResult.intensity,
        feedback: mockResult.feedback,
        timestamp: new Date().toISOString(),
        source: 'voice'
      });
    }

    setIsProcessing?.(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        variant="outline"
        onClick={toggleRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="mr-2 h-4 w-4" />
            Arrêter l'enregistrement
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Démarrer l'enregistrement
          </>
        )}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AudioProcessor;
