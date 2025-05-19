import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';

interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: string) => void;
  autoStop?: boolean;
  duration?: number;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
  isRecording?: boolean;
  onProcessingChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onError,
  autoStop = true,
  duration = 5000,
  isProcessing: propIsProcessing,
  setIsProcessing,
  isRecording: propIsRecording,
  onProcessingChange
}) => {
  const [localIsRecording, setLocalIsRecording] = useState(propIsRecording || false);
  const [localIsProcessing, setLocalIsProcessing] = useState(propIsProcessing || false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use either prop or local state for recording status
  const isRecording = propIsRecording !== undefined ? propIsRecording : localIsRecording;
  // Use either prop or local state for processing status
  const isProcessing = propIsProcessing !== undefined ? propIsProcessing : localIsProcessing;

  const updateProcessingState = (state: boolean) => {
    if (setIsProcessing) {
      setIsProcessing(state);
    } else if (onProcessingChange) {
      onProcessingChange(state);
    } else {
      setLocalIsProcessing(state);
    }
  };

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
    updateProcessingState(true);
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
        setLocalIsRecording(false);
        updateProcessingState(false);
        await processAudio(fullBlob);
      };

      mediaRecorder.current.start();
      setLocalIsRecording(true);
      setError(null);
    } catch (err: any) {
      setError(`Erreur lors du démarrage de l'enregistrement audio: ${err.message}`);
      if (onError) onError(`Erreur lors du démarrage de l'enregistrement audio: ${err.message}`);
      updateProcessingState(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setLocalIsRecording(false);
      updateProcessingState(false);
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
    updateProcessingState(true);
    // Simulate audio processing with a mock result
    const mockResult = generateMockResult();
    
    // Update to use the correct properties
    if (onResult && mockResult) {
      const recommendations: EmotionRecommendation[] = [
        { title: "Appreciate your mood", content: "Take a moment to appreciate your positive mood", category: "general" },
        { title: "Share happiness", content: "Share your happiness with someone", category: "general" }
      ];
      
      onResult({
        id: 'mock-id-' + Date.now(),
        emotion: mockResult.emotion,
        score: mockResult.score,
        confidence: mockResult.confidence,
        text: "Sample text",
        emojis: ["😊"],
        recommendations: recommendations,
        intensity: mockResult.intensity,
        feedback: mockResult.feedback,
        timestamp: new Date(),
        source: 'voice'
      });
    }

    updateProcessingState(false);
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

const generateMockResult = (): EmotionResult => {
  // Create valid recommendations
  const recommendations: EmotionRecommendation[] = [
    { 
      type: "music",
      title: "Relax playlist", 
      description: "Soothing sounds to relax your mind",
      content: "Check out our curated playlist for relaxation", 
    },
    { 
      type: "exercise",
      title: "Quick breathing", 
      description: "Simple breathing exercise",
      content: "Try this 2-minute breathing exercise" 
    }
  ];
  
  return {
    id: `audio-analysis-${Date.now()}`,
    emotion: Math.random() > 0.5 ? 'calm' : 'happy',
    confidence: Math.random() * 0.3 + 0.7,
    intensity: Math.random() * 0.5 + 0.5,
    recommendations,
    text: "Sample audio for analysis",
    timestamp: new Date().toISOString()
  };
};

export default AudioProcessor;
