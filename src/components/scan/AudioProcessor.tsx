
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { EmotionResult, AudioProcessorProps } from '@/types/emotion';

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onError,
  autoStop = true,
  duration = 5000,
  isRecording,
  setIsProcessing
}) => {
  const [isActive, setIsActive] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isActive && autoStop) {
      timeoutId = setTimeout(() => {
        stopRecording();
      }, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [isActive, autoStop, duration]);

  // Respond to external recording state changes
  useEffect(() => {
    if (isRecording !== undefined) {
      if (isRecording && !isActive) {
        startRecording();
      } else if (!isRecording && isActive) {
        stopRecording();
      }
    }
  }, [isRecording]);

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
        setIsActive(false);
        setIsProcessing?.(false);
        await processAudio(fullBlob);
      };

      mediaRecorder.current.start();
      setIsActive(true);
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
      setIsActive(false);
      setIsProcessing?.(false);
    }
  };

  const toggleRecording = () => {
    if (isActive) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing?.(true);
    // Simulate audio processing with a mock result
    // In a real implementation, we would send the audio to a backend API
    
    // Create a complete EmotionResult object
    const mockResult: EmotionResult = {
      id: 'mock-id-' + Date.now(),
      emotion: 'happy',
      confidence: 0.85,
      intensity: 0.65,
      emojis: ["😊"],
      source: 'voice',
      timestamp: new Date().toISOString(),
      text: "Sample text",
      feedback: "Voix joyeuse détectée",
      score: Math.round(Math.random() * 100),
      recommendations: [
        { title: "Take a moment to appreciate your positive mood", description: "Positive reinforcement" },
        { title: "Share your happiness with someone", description: "Social connection" }
      ]
    };
    
    if (onResult) {
      onResult(mockResult);
    }

    setIsProcessing?.(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        variant="outline"
        onClick={toggleRecording}
        disabled={setIsProcessing !== undefined ? false : isProcessing}
      >
        {setIsProcessing !== undefined ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : isActive ? (
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
