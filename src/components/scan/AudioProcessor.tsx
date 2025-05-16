
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';

interface AudioProcessorProps {
  isRecording: boolean;
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  maxRecordingTime?: number; // in milliseconds
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  isRecording,
  onResult,
  onProcessingChange,
  maxRecordingTime = 30000 // 30 seconds default
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcript, setTranscript] = useState<string>('');
  const { toast } = useToast();
  
  // Initialize media recorder
  useEffect(() => {
    let recordingTimeout: NodeJS.Timeout;
    
    const setupRecorder = async () => {
      try {
        if (isRecording) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          
          recorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0) {
              setAudioChunks(prev => [...prev, event.data]);
            }
          });
          
          recorder.addEventListener('stop', () => {
            processAudio();
            
            // Close audio stream tracks
            stream.getTracks().forEach(track => track.stop());
          });
          
          setMediaRecorder(recorder);
          recorder.start();
          
          if (onProcessingChange) {
            onProcessingChange(false);
          }
          
          // Set timeout to automatically stop recording
          recordingTimeout = setTimeout(() => {
            if (recorder.state === 'recording') {
              recorder.stop();
              toast({
                title: "Enregistrement terminé",
                description: "La durée maximale d'enregistrement a été atteinte"
              });
            }
          }, maxRecordingTime);
        } else if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Erreur d'accès au microphone",
          description: "Veuillez autoriser l'accès au microphone",
          variant: "destructive"
        });
      }
    };
    
    setupRecorder();
    
    return () => {
      clearTimeout(recordingTimeout);
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [isRecording, maxRecordingTime, toast]);
  
  // Process recorded audio
  const processAudio = async () => {
    if (audioChunks.length === 0) return;
    
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    
    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      // Simulate processing with Whisper API
      // In a real implementation, send the audioBlob to a backend service
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription result
      const mockTranscript = "Je me sens plutôt bien aujourd'hui, même si j'ai eu une matinée un peu stressante.";
      setTranscript(mockTranscript);
      
      // Mock emotion analysis result
      const mockEmotionResult: EmotionResult = {
        id: uuid(),
        user_id: 'current-user',
        date: new Date().toISOString(),
        emotion: 'mixed',
        score: 65,
        confidence: 0.75,
        intensity: 0.65,
        text: mockTranscript,
        transcript: mockTranscript
      };
      
      if (onResult) {
        onResult(mockEmotionResult);
      }
      
      // Reset for next recording
      setAudioChunks([]);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement de l'audio",
        variant: "destructive"
      });
    } finally {
      if (onProcessingChange) {
        onProcessingChange(false);
      }
    }
  };
  
  return (
    <div className="space-y-2">
      {transcript && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Transcription:</p>
          <p className="italic">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioProcessor;
