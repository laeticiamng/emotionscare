
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuid } from 'uuid';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ onScanComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Fonction pour gérer les erreurs d'accès au micro
  const handleMicrophoneError = (error: any) => {
    console.error('Microphone access error:', error);
    toast({
      title: "Erreur d'accès au micro",
      description: "Veuillez autoriser l'accès au microphone pour utiliser cette fonctionnalité.",
      variant: "destructive"
    });
  };

  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      recorder.ondataavailable = (event) => {
        setAudioBlob(event.data);
        setAudioUrl(URL.createObjectURL(event.data));
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
    } catch (error) {
      handleMicrophoneError(error);
      setIsRecording(false);
    }
  };

  // Fonction pour arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Fonction pour analyser l'enregistrement
  const analyzeRecording = async () => {
    if (!audioBlob) return;
    
    try {
      // Simuler l'analyse de l'émotion à partir de la voix
      // Dans une implémentation réelle, ceci enverrait l'audio à une API
      
      // Création d'un résultat fictif pour la démonstration
      const result: EmotionResult = {
        id: uuid(),
        date: new Date().toISOString(),
        emotion: 'calm',
        confidence: 0.75,
        transcript: "J'ai l'impression d'être plutôt détendu aujourd'hui.",
        audio_url: audioUrl || undefined
      };
      
      // Appeler le callback si fourni
      if (onScanComplete) {
        onScanComplete(result);
      }
      
      toast({
        title: "Analyse vocale terminée",
        description: `Émotion détectée : ${result.emotion}`,
      });
    } catch (error) {
      console.error('Error analyzing voice recording:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre enregistrement vocal.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {isRecording ? (
          <Button
            variant="destructive"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={startRecording}
            disabled={isRecording}
          >
            <Mic className="mr-2 h-4 w-4" />
            Démarrer l'enregistrement
          </Button>
        )}
      </div>
      
      {audioUrl && (
        <div className="flex justify-center">
          <audio controls src={audioUrl} />
        </div>
      )}
      
      {audioBlob && (
        <div className="flex justify-center">
          <Button onClick={analyzeRecording}>
            Analyser l'enregistrement
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceEmotionScanner;
