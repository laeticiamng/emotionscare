
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';

export interface AudioProcessorProps {
  onResult: (result: EmotionResult) => void;
  onStatusChange?: (isRecording: boolean) => void;
  showControls?: boolean;
  autoStart?: boolean;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onStatusChange,
  showControls = true,
  autoStart = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (autoStart) {
      handleStartRecording();
    }
    
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [autoStart]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      setAudioContext(context);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        
        // In a real app, you'd send this blob to your server or API
        // Here we'll simulate an analysis result after a delay
        setTimeout(() => {
          const simulatedResult = analyzeAudio();
          onResult(simulatedResult);
          
          if (onStatusChange) {
            onStatusChange(false);
          }
          setIsRecording(false);
        }, 1500);
      };

      recorder.start();
      setIsRecording(true);
      
      if (onStatusChange) {
        onStatusChange(true);
      }

      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  // Simulate audio analysis - in a real app this would be done by an API
  const analyzeAudio = (): EmotionResult => {
    const emotions = ['calm', 'happy', 'focus', 'anxiety', 'energetic'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.round(Math.random() * 50 + 50); // Random confidence between 50-100
    
    const recommendations: EmotionRecommendation[] = [
      {
        type: 'exercise',
        title: 'Exercice de respiration',
        description: 'Respirez profondément',
        content: 'Inspiration 4 secondes, rétention 7 secondes, expiration 8 secondes',
        category: 'wellness'
      },
      {
        type: 'music',
        title: 'Playlist recommandée',
        description: 'Musique pour améliorer votre humeur',
        content: 'Consultez notre sélection de musiques adaptées',
        category: 'entertainment'
      }
    ];
    
    return {
      id: `audio-${Date.now()}`,
      emotion: emotion,
      confidence: confidence / 100,
      intensity: Math.random(),
      recommendations,
      timestamp: new Date().toISOString(),
      text: "Analyse vocale complétée",
      source: 'live-voice',
      emotions: {} // Add empty emotions object to satisfy the type
    };
  };

  return (
    <div>
      {showControls && (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            variant={isRecording ? "destructive" : "default"}
            className="min-w-[120px]"
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Arrêter
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioProcessor;
