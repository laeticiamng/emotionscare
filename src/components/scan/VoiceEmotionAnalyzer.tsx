
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/types';
import { MicIcon, StopCircleIcon } from 'lucide-react';

interface VoiceEmotionAnalyzerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({
  onResult,
  autoStart = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-start recording if configured
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.addEventListener('dataavailable', e => {
        setAudioChunks(chunks => [...chunks, e.data]);
      });
      
      recorder.addEventListener('stop', () => {
        analyzeAudio();
      });
      
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const analyzeAudio = async () => {
    if (audioChunks.length === 0) return;
    
    setIsAnalyzing(true);
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    
    try {
      // In a real app, you'd send this to an API
      // For demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock transcript (would come from speech-to-text in reality)
      const mockTranscript = "Voici un exemple de transcription qui serait générée à partir de l'audio enregistré.";
      setTranscript(mockTranscript);
      
      const result: EmotionResult = {
        id: `voice-${Date.now()}`,
        emotion: getRandomEmotion(),
        score: Math.floor(Math.random() * 40) + 60,
        confidence: (Math.random() * 0.3) + 0.6,
        text: mockTranscript,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString()
      };
      
      onResult(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Helper to get a random emotion for the demo
  const getRandomEmotion = () => {
    const emotions = ['joy', 'calm', 'anxious', 'focused', 'tired', 'excited'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="rounded-full h-16 w-16 flex items-center justify-center"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
        >
          {isRecording ? (
            <StopCircleIcon className="h-8 w-8" />
          ) : (
            <MicIcon className="h-8 w-8" />
          )}
        </Button>
      </div>
      
      <div className="text-center text-sm">
        {isRecording ? (
          <p className="text-primary animate-pulse">Enregistrement en cours...</p>
        ) : isAnalyzing ? (
          <p className="text-muted-foreground">Analyse en cours...</p>
        ) : transcript ? (
          <p>{transcript}</p>
        ) : (
          <p className="text-muted-foreground">Cliquez pour commencer l'enregistrement</p>
        )}
      </div>
    </div>
  );
};

export default VoiceEmotionAnalyzer;
