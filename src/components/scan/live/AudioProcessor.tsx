
import React, { useEffect } from 'react';
import { EmotionResult } from '@/types/emotion';

interface AudioProcessorProps {
  isListening: boolean;
  userId: string;
  isConfidential?: boolean;
  onProcessingChange: (processing: boolean) => void;
  onProgressUpdate: (message: string) => void;
  onAnalysisComplete: (emotion: any, result: EmotionResult) => void;
  onError: (message: string) => void;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  isListening,
  userId,
  isConfidential = false,
  onProcessingChange,
  onProgressUpdate,
  onAnalysisComplete,
  onError
}) => {
  useEffect(() => {
    if (!isListening) return;
    
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: BlobPart[] = [];
    let analyzing = false;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
          if (analyzing) return;
          
          analyzing = true;
          onProcessingChange(true);
          onProgressUpdate('Traitement de l\'audio...');
          
          // Simulate processing delay
          setTimeout(() => {
            onProgressUpdate('Analyse émotionnelle...');
            
            // Simulate emotion detection
            setTimeout(() => {
              processAudioData();
            }, 1500);
          }, 1000);
        });
        
        mediaRecorder.start();
        
        // Auto-stop after 10 seconds for demo purposes
        setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            stopAllTracks(stream);
          }
        }, 10000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        onError('Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.');
      }
    };
    
    const stopAllTracks = (stream: MediaStream) => {
      stream.getTracks().forEach(track => track.stop());
    };
    
    const processAudioData = () => {
      // Simulate processing audio data and getting transcript/emotion
      onProgressUpdate('Finalisation de l\'analyse...');
      
      setTimeout(() => {
        // Mock data for demo purposes
        const mockEmotions = [
          { name: 'calm', score: 0.75 },
          { name: 'joy', score: 0.65 },
          { name: 'satisfaction', score: 0.55 }
        ];
        
        const dominantEmotion = mockEmotions[0];
        
        // Create result object
        const result: EmotionResult = {
          id: `emotion-${Date.now()}`,
          user_id: userId,
          date: new Date().toISOString(),
          emotion: dominantEmotion.name,
          score: dominantEmotion.score,
          confidence: 0.8,
          transcript: "Je me sens plutôt bien aujourd'hui, calme et détendu après ma session de méditation.",
          dominantEmotion: {
            name: dominantEmotion.name,
            score: dominantEmotion.score
          }
        };
        
        // Pass emotion data to parent
        onAnalysisComplete(dominantEmotion, result);
        
        // Reset
        onProcessingChange(false);
        analyzing = false;
        audioChunks = [];
      }, 1000);
    };
    
    startRecording();
    
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [isListening, userId, isConfidential, onProcessingChange, onProgressUpdate, onAnalysisComplete, onError]);
  
  return null;
};

export default AudioProcessor;
