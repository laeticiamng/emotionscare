
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAudioStream } from '@/lib/scanService';
import { EmotionResult } from '@/types';

interface AudioProcessorProps {
  userId: string;
  isConfidential: boolean;
  onProcessingChange: (processing: boolean) => void;
  onProgressUpdate: (progress: string) => void;
  onAnalysisComplete: (emotion: any, result: EmotionResult) => void;
  onError: (error: string) => void;
  isListening: boolean; // Added this property explicitly
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  isListening,
  userId,
  isConfidential,
  onProcessingChange,
  onProgressUpdate,
  onAnalysisComplete,
  onError
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Délai minimum d'enregistrement en millisecondes pour éviter des analyses trop courtes
  const MIN_RECORDING_DURATION = 3000;
  const recordingStartTimeRef = useRef<number | null>(null);

  // Setup media recorder
  useEffect(() => {
    if (isListening) {
      startRecording();
    } else if (mediaRecorder) {
      stopRecording();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening]);

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      recordingStartTimeRef.current = Date.now();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks(prevChunks => [...prevChunks, event.data]);
        }
      });
      
      recorder.addEventListener('stop', () => {
        const recordingDuration = recordingStartTimeRef.current ? Date.now() - recordingStartTimeRef.current : 0;
        
        if (recordingDuration < MIN_RECORDING_DURATION) {
          onError('Enregistrement trop court. Veuillez parler plus longtemps pour une analyse précise.');
          return;
        }
        
        processAudio(chunks);
      });
      
      recorder.start(1000); // Collect data every second
      onProgressUpdate('Enregistrement en cours...');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      onError('Impossible d\'accéder au microphone. Vérifiez les permissions de votre navigateur.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const processAudio = async (chunks: Blob[]) => {
    try {
      if (chunks.length === 0) {
        onError('Aucun audio enregistré.');
        return;
      }
      
      setIsProcessing(true);
      onProcessingChange(true);
      onProgressUpdate('Traitement de l\'audio...');
      
      const audioBlob = new Blob(chunks, { type: chunks[0].type });
      
      onProgressUpdate('Analyse émotionnelle en cours...');
      
      // Process audio with serverless function
      const result = await analyzeAudioStream(audioBlob);
      
      console.log('Audio analysis result:', result);
      
      // Create emotion object with expected properties
      const emotion = {
        id: result.id || crypto.randomUUID(),
        user_id: userId,
        date: new Date().toISOString(),
        emotion: result.emotion,
        confidence: result.confidence,
        score: result.score || 50,
        text: result.text || '',
        transcript: result.transcript || '',
        ai_feedback: result.feedback || '',
        recommendations: result.recommendations || [],
      };
      
      onAnalysisComplete(emotion, result);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      onError('Erreur lors du traitement audio. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  };

  return null; // This is a non-visual component
};

export default AudioProcessor;
