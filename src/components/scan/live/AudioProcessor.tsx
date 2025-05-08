
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Emotion } from '@/types';

interface AudioProcessorProps {
  isListening: boolean;
  userId: string;
  isConfidential: boolean;
  onProcessingChange: (isProcessing: boolean) => void;
  onProgressUpdate: (status: string) => void;
  onAnalysisComplete: (emotion: Emotion, result: any) => void;
  onError: (message: string) => void;
}

// Simulé API pour tester l'interface
const simulateAnalysis = (audioBlob: Blob): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Valeurs aléatoires pour simulation
      const emotions = ['happy', 'calm', 'anxious', 'neutral', 'sad'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = 0.5 + (Math.random() * 0.45); // Entre 0.5 et 0.95
      
      resolve({
        emotion: randomEmotion,
        confidence: randomConfidence,
        transcript: "Voici une transcription simulée pour démontrer l'interface utilisateur."
      });
    }, 2000);
  });
};

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  isListening,
  userId,
  isConfidential,
  onProcessingChange,
  onProgressUpdate,
  onAnalysisComplete,
  onError
}) => {
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Initialiser l'enregistrement audio
  useEffect(() => {
    let volumeCheckInterval: NodeJS.Timeout;
    
    const startRecording = async () => {
      try {
        onProgressUpdate("Initialisation de l'enregistrement...");
        
        // Demander l'accès au micro
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Créer le MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        // Collecter les données audio
        setAudioChunks([]);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((chunks) => [...chunks, event.data]);
          }
        };
        
        // Démarrer l'enregistrement
        mediaRecorder.start(1000);
        onProgressUpdate("Enregistrement en cours...");
        
        // Vérifier le volume pour feedback visuel (simulation)
        let counter = 0;
        volumeCheckInterval = setInterval(() => {
          counter++;
          if (counter % 3 === 0) {
            onProgressUpdate("Audio capturé, continuez à parler...");
          }
        }, 2000);
        
      } catch (error) {
        console.error('Erreur accès micro:', error);
        onError("Impossible d'accéder au microphone. Vérifiez les permissions.");
      }
    };
    
    if (isListening) {
      startRecording();
    }
    
    // Nettoyage
    return () => {
      if (volumeCheckInterval) clearInterval(volumeCheckInterval);
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, onError, onProgressUpdate]);
  
  // Traiter l'audio quand l'enregistrement s'arrête
  useEffect(() => {
    const processAudio = async () => {
      if (!isListening && audioChunks.length > 0) {
        try {
          onProcessingChange(true);
          onProgressUpdate("Traitement de l'audio...");
          
          // Créer un blob audio à partir des chunks
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          // Analyse de l'audio (API simulée pour l'exemple)
          // Dans un cas réel, envoyez le blob à votre API
          const result = await simulateAnalysis(audioBlob);
          
          // Transformation en objet Emotion compatible
          const emotion: Emotion = {
            id: `scan-${Date.now()}`,
            user_id: userId,
            date: new Date(),
            score: Math.round(result.confidence * 100),
            emotion: result.emotion,
            text: result.transcript
          };
          
          // Informer le composant parent
          onAnalysisComplete(emotion, result);
          
        } catch (error) {
          console.error('Erreur analyse audio:', error);
          onError("Erreur lors de l'analyse audio. Veuillez réessayer.");
        } finally {
          onProcessingChange(false);
        }
      }
    };
    
    processAudio();
  }, [isListening, audioChunks, onProcessingChange, onProgressUpdate, onAnalysisComplete, onError, userId]);
  
  return null; // Composant sans rendu visuel
};

export default AudioProcessor;
