
import { useState, useEffect, useRef, useCallback } from 'react';
import { initVad } from '@/lib/audioVad';
import { analyzeAudioStream, saveRealtimeEmotionScan, type EmotionResult } from '@/lib/scanService';
import type { Emotion } from '@/types';

interface AudioProcessorProps {
  isListening: boolean;
  userId?: string;
  onProcessingChange: (isProcessing: boolean) => void;
  onProgressUpdate: (text: string) => void;
  onAnalysisComplete: (emotion: Emotion, result: EmotionResult) => void;
  onError: (message: string) => void;
  isConfidential?: boolean;
}

const AudioProcessor = ({ 
  isListening, 
  userId, 
  onProcessingChange, 
  onProgressUpdate, 
  onAnalysisComplete, 
  onError,
  isConfidential = false
}: AudioProcessorProps) => {
  const vadRef = useRef<any>(null);

  // Cleanup function for VAD
  const stopVad = useCallback(() => {
    if (vadRef.current) {
      vadRef.current.stop();
      vadRef.current = null;
    }
  }, []);

  // Initialize or stop VAD when listening state changes
  useEffect(() => {
    if (isListening) {
      const startVad = async () => {
        try {
          // Handle speech start
          const onSpeechStart = () => {
            console.log('🗣️ Speech detected');
            onProgressUpdate('Listening...');
          };
          
          // Handle speech end
          const onSpeechEnd = async (audioChunks: Array<Uint8Array>) => {
            console.log('🤫 Speech ended, analyzing...');
            onProcessingChange(true);
            
            try {
              // Process audio with emotion analysis
              const result = await analyzeAudioStream(audioChunks, (progress) => {
                onProgressUpdate(progress);
              });
              
              // Save result to database if user is logged in and not confidential
              if (userId && !isConfidential) {
                const savedEmotion = await saveRealtimeEmotionScan(result, userId);
                console.log('Saved emotion analysis:', savedEmotion);
                
                // Notify parent component
                onAnalysisComplete(savedEmotion, result);
              } else if (userId) {
                // Create a temporary emotion object without saving to DB
                const tempEmotion: Emotion = {
                  id: 'temp-' + Date.now().toString(),
                  user_id: userId,
                  date: new Date().toISOString(),
                  emotion: result.emotion,
                  intensity: Math.round(result.confidence * 10),
                  score: Math.round(result.confidence * 100),
                  text: result.transcript || '',
                  ai_feedback: `Mode confidentiel: Analyse non sauvegardée`
                };
                
                onAnalysisComplete(tempEmotion, result);
                console.log('Confidential mode - no data saved');
              }
            } catch (error) {
              console.error('Error analyzing audio:', error);
              onError("L'analyse émotionnelle a échoué. Veuillez réessayer.");
            } finally {
              onProcessingChange(false);
              onProgressUpdate('');
            }
          };
          
          // Initialize Voice Activity Detection
          const vad = await initVad(onSpeechStart, onSpeechEnd);
          vadRef.current = vad;
          
        } catch (error) {
          console.error('Error starting microphone:', error);
          onError("Impossible d'accéder au microphone. Vérifiez les permissions.");
          onProcessingChange(false);
        }
      };
      
      startVad();
    } else {
      // Stop VAD when listening is turned off
      stopVad();
    }
    
    // Clean up on component unmount
    return () => {
      stopVad();
    };
  }, [isListening, userId, onProgressUpdate, onProcessingChange, onAnalysisComplete, onError, stopVad, isConfidential]);

  return null; // This is a non-visual component
};

export default AudioProcessor;
