
import React, { useState, useEffect, useRef } from 'react';
import { createProcessor } from '@/lib/audioVad';
import { useToast } from '@/hooks/use-toast';
import { analyzeAudioStream, EmotionResult } from '@/lib/scanService';
import StatusIndicator from './live/StatusIndicator';
import TranscriptDisplay from './live/TranscriptDisplay';
import type { Emotion } from '@/types';

interface AudioProcessorProps {
  isListening: boolean;
  userId: string;
  isConfidential?: boolean;
  onProcessingChange: React.Dispatch<React.SetStateAction<boolean>>;
  onProgressUpdate: React.Dispatch<React.SetStateAction<string>>;
  onAnalysisComplete: (emotion: Emotion, result: EmotionResult) => void;
  onError: (message: string) => void;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  isListening,
  userId,
  isConfidential = true,
  onProcessingChange,
  onProgressUpdate,
  onAnalysisComplete,
  onError
}) => {
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeRef = useRef<number>(0);
  const recordingIntervalRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (isListening) {
      startRecording();
    } else {
      stopRecording();
    }
    
    return () => {
      stopRecording();
    };
  }, [isListening]);
  
  const startRecording = async () => {
    try {
      onProcessingChange(true);
      setIsRecording(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Set up audio context and processor
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = createProcessor(audioContextRef.current);
      
      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      // Collect audio data for processing
      audioChunksRef.current = [];
      recordingTimeRef.current = 0;
      
      // Start timer to show recording duration
      recordingIntervalRef.current = window.setInterval(() => {
        recordingTimeRef.current += 1;
        onProgressUpdate(`Enregistrement: ${recordingTimeRef.current}s`);
        
        // Auto-stop after 30 seconds to prevent large uploads
        if (recordingTimeRef.current >= 30) {
          stopRecording();
        }
      }, 1000);
      
      onProcessingChange(false);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      onError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      onProcessingChange(false);
      setIsRecording(false);
    }
  };
  
  const stopRecording = async () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    onProcessingChange(true);
    onProgressUpdate('Traitement en cours...');
    
    // Clean up audio
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Process the recorded audio (mock for now)
    try {
      // Create fake audio blob for testing
      const audioBlob = new Blob([], { type: 'audio/wav' });
      
      // Analyze the audio
      const result = await analyzeAudioStream(audioBlob);
      
      // Create emotion object
      const emotion: Emotion = {
        id: `emotion-${Date.now()}`, // Generate a temporary ID
        user_id: userId,
        date: new Date().toISOString(),
        emotion: result.emotion,
        confidence: result.confidence,
        text: result.transcript,
        audio_url: isConfidential ? undefined : 'mock-url-to-audio-file',
        source: 'audio', // Optional property
      };
      
      onAnalysisComplete(emotion, result);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      onError("Une erreur est survenue lors de l'analyse de l'audio.");
      onProcessingChange(false);
    }
  };
  
  return null; // This component doesn't render anything visual
};

export default AudioProcessor;
