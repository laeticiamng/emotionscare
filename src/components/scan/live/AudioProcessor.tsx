
import React, { useState, useEffect, useRef } from 'react';
import { createProcessor } from "@/lib/audioVad";
import { analyzeAudioStream, saveRealtimeEmotionScan, EmotionResult } from "@/lib/scanService";
import { useToast } from "@/hooks/use-toast";
import type { Emotion } from '@/types';
import StatusIndicator from "./StatusIndicator";
import TranscriptDisplay from "./TranscriptDisplay";

interface AudioProcessorProps {
  isListening: boolean;
  userId: string;
  isConfidential: boolean;
  onProcessingChange: (isProcessing: boolean) => void;
  onProgressUpdate: (text: string) => void;
  onAnalysisComplete: (emotion: Emotion, result: EmotionResult) => void;
  onError: (message: string) => void;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<any>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { toast } = useToast();
  
  // Update the parent component with processing status
  useEffect(() => {
    onProcessingChange(isProcessing);
  }, [isProcessing, onProcessingChange]);
  
  // Update the parent component with progress text
  useEffect(() => {
    onProgressUpdate(progressText);
  }, [progressText, onProgressUpdate]);

  // Handle recording start/stop based on isListening prop
  useEffect(() => {
    if (isListening) {
      startRecording();
    } else {
      stopRecording();
    }
    
    return () => {
      // Cleanup on component unmount
      stopRecording();
    };
  }, [isListening]);
  
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      
      // Request microphone permissions
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      
      // Initialize processor
      processorRef.current = createProcessor(audioContextRef.current);
      source.connect(processorRef.current);
      
      setProgressText('Enregistrement en cours...');
      
      // Set timeout to automatically stop recording after 60 seconds
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 60000); // 60 seconds max
      
    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  };
  
  const stopRecording = async () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (!streamRef.current || recordedChunksRef.current.length === 0) {
      return;
    }
    
    try {
      // Stop all media tracks
      streamRef.current.getTracks().forEach(track => track.stop());
      
      // Disconnect processor if exists
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
      
      setIsProcessing(true);
      setProgressText('Analyse de votre émotion...');
      
      // Process recorded audio - Convert Blob to expected format
      const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
      // Pass audioBlob directly as analyzeAudioStream should handle Blob type
      const result = await analyzeAudioStream(audioBlob);
      
      // Check if we got a valid result
      if (!result || !result.emotion) {
        throw new Error('Résultat d\'analyse invalide');
      }
      
      // Create emotion object from result with required confidence value
      const emotion: Emotion = {
        id: Date.now().toString(),
        user_id: userId,
        emotion: result.emotion,
        confidence: result.confidence, // Ensure confidence is passed
        score: Math.round((result.confidence || 0.5) * 10),
        date: new Date().toISOString(), // Use date instead of timestamp
        source: 'audio',
        text: result.transcript,
        ai_feedback: result.transcript || '',
        is_confidential: isConfidential
      };
      
      // Save emotion scan if not confidential
      if (!isConfidential) {
        await saveRealtimeEmotionScan(emotion, userId);
      }
      
      setIsProcessing(false);
      onAnalysisComplete(emotion, result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setIsProcessing(false);
      onError('Erreur lors de l\'analyse audio. Veuillez réessayer.');
    } finally {
      // Reset state
      streamRef.current = null;
      recordedChunksRef.current = [];
    }
  };

  // No visual rendering for this component
  return null;
};

export default AudioProcessor;
