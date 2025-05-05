
import React, { useState, useEffect } from 'react';
import { Emotion } from '@/types';
import type { EmotionResult } from './live/EmotionResult'; // Fixed import

export interface AudioProcessorProps {
  isListening: boolean;
  userId: string;
  isConfidential?: boolean; // This property was already defined correctly
  onProcessingChange: React.Dispatch<React.SetStateAction<boolean>>;
  onProgressUpdate: React.Dispatch<React.SetStateAction<string>>;
  onAnalysisComplete: (emotion: Emotion, result: EmotionResult) => void;
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
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (isListening) {
      startRecording();
    } else if (mediaRecorder) {
      stopRecording();
    }
    // Cleanup function
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [isListening]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (e) => {
        setAudioChunks(currentChunks => [...currentChunks, e.data]);
      };
      
      recorder.onstop = processAudio;
      recorder.start();
      onProgressUpdate("Écoute en cours...");
      
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      onError("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      onProgressUpdate("Traitement de l'audio...");
    }
  };

  const processAudio = async () => {
    if (audioChunks.length === 0) {
      onError("Aucun audio enregistré");
      return;
    }
    
    try {
      onProcessingChange(true);
      
      // Créer un blob audio à partir des chunks
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      
      // Convertir en base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Simuler un appel API - dans une vraie application, ceci serait un appel API
        onProgressUpdate("Analyse de votre état émotionnel...");
        
        setTimeout(() => {
          // Simulation de traitement - remplacer par un vrai appel API
          const mockEmotion: Emotion = {
            id: crypto.randomUUID(),
            user_id: userId,
            date: new Date().toISOString(),
            emotion: "Calme",
            score: 7.5,
            intensity: 6,
            text: "Analyse audio automatique",
            ai_feedback: "Vous semblez calme et posé. Votre rythme vocal est régulier."
          };
          
          const mockResult: EmotionResult = {
            emotionName: "Calme",
            confidence: 0.85,
            emotions: {
              calm: 0.85,
              stress: 0.1,
              happy: 0.05
            }
          };
          
          onAnalysisComplete(mockEmotion, mockResult);
          onProcessingChange(false);
        }, 2000);
      };
      
    } catch (error) {
      console.error("Erreur de traitement audio:", error);
      onError("Une erreur s'est produite lors du traitement de l'audio");
      onProcessingChange(false);
    } finally {
      // Arrêter toutes les pistes du stream
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return null; // Ce composant ne rend rien visuellement
};

export default AudioProcessor;
