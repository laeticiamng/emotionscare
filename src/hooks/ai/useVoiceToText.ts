
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface VoiceToTextOptions {
  language?: string;
  onTranscriptionComplete?: (text: string) => void;
  maxRecordingTime?: number;
}

export function useVoiceToText(options: VoiceToTextOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Convert audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        try {
          setIsProcessing(true);
          
          // Create audio blob
          const audioBlob = new Blob(audioChunks, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          
          // Convert to base64
          const base64Audio = await blobToBase64(audioBlob);
          
          // Call the Supabase function
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });
          
          if (error) {
            throw new Error(error.message);
          }
          
          if (data && data.text) {
            setTranscript(data.text);
            
            if (options.onTranscriptionComplete) {
              options.onTranscriptionComplete(data.text);
            }
          } else {
            throw new Error('No transcription returned');
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          setError(error instanceof Error ? error.message : 'Error processing audio');
          toast({
            title: "Erreur de transcription",
            description: "Impossible de transcrire l'audio. Veuillez réessayer.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
          
          // Stop all tracks
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after max recording time if specified
      if (options.maxRecordingTime) {
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, options.maxRecordingTime);
      }
      
      // Return stop function
      return () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      setError(error instanceof Error ? error.message : 'Error starting recording');
      setIsRecording(false);
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible d'accéder au microphone. Vérifiez les permissions.",
        variant: "destructive"
      });
      return () => {};
    }
  }, [options.maxRecordingTime, options.onTranscriptionComplete]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    // The actual stopping logic is handled in the startRecording function
    // This function is provided for API completeness
  }, []);
  
  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording
  };
}
