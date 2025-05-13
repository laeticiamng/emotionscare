
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceAssistantOptions {
  autoStart?: boolean;
  emotionalState?: string;
  onActionDetected?: (action: string, params: any) => void;
}

interface VoiceAction {
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  transcribedText: string;
  responseMessage: string;
}

export function useVoiceAssistant(options: VoiceAssistantOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [lastAction, setLastAction] = useState<VoiceAction | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { autoStart = false, emotionalState, onActionDetected } = options;

  // Démarrer automatiquement si demandé
  useEffect(() => {
    if (autoStart) {
      startListening();
    }
    
    return () => {
      stopListening();
    };
  }, [autoStart]);

  // Démarrer l'écoute vocale
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream, { 
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4' 
      });
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      });
      
      recorder.addEventListener('stop', () => {
        processAudioData();
      });
      
      recorder.start(1000);
      setIsListening(true);
      
      toast({
        title: "Assistant vocal activé",
        description: "Je vous écoute...",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      toast({
        title: "Erreur microphone",
        description: "L'accès au microphone a été refusé ou n'est pas disponible.",
        variant: "destructive",
      });
    }
  }, []);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsListening(false);
    }
  }, [mediaRecorder]);

  // Traiter les données audio
  const processAudioData = useCallback(async () => {
    if (audioChunks.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunks, { 
        type: audioChunks[0].type 
      });
      
      // Convertir en base64 pour l'envoi à l'API
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        try {
          const { data, error } = await supabase.functions.invoke('voice-assistant', {
            body: { 
              audioData: base64Audio,
              currentEmotionalState: emotionalState 
            }
          });
          
          if (error) throw error;
          
          if (data.success) {
            setTranscript(data.transcribedText);
            
            const actionData = {
              action: data.action,
              parameters: data.parameters,
              confidence: data.confidence,
              transcribedText: data.transcribedText,
              responseMessage: data.responseMessage
            };
            
            setLastAction(actionData);
            
            // Notification du résultat
            toast({
              title: "Commande détectée",
              description: data.responseMessage,
              variant: "default",
            });
            
            // Exécuter l'action détectée
            executeAction(data.action, data.parameters);
            
            // Callback externe si fourni
            if (onActionDetected) {
              onActionDetected(data.action, data.parameters);
            }
          } else {
            throw new Error(data.error || "Erreur de traitement");
          }
        } catch (error) {
          console.error('Erreur lors du traitement audio:', error);
          toast({
            title: "Échec de traitement",
            description: "Je n'ai pas pu comprendre votre commande.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Erreur lors du traitement audio:', error);
    } finally {
      setIsProcessing(false);
      setAudioChunks([]);
    }
  }, [audioChunks, emotionalState, onActionDetected]);

  // Exécuter l'action détectée
  const executeAction = useCallback((action: string, parameters: any) => {
    switch (action) {
      case 'open_journal':
        navigate('/journal');
        break;
      
      case 'start_meditation':
        navigate('/meditation');
        break;
      
      case 'play_music':
        navigate('/music');
        // TODO: Déclencher la lecture de musique avec les paramètres
        break;
      
      case 'scan_emotion':
        navigate('/scan');
        break;
      
      case 'coach_chat':
        navigate('/coach-chat');
        break;
      
      case 'show_dashboard':
        navigate('/dashboard');
        break;
      
      case 'search_content':
        // TODO: Implémenter la recherche avec les paramètres
        navigate('/search');
        break;
      
      case 'help':
        navigate('/help');
        break;
      
      case 'none':
      default:
        // Aucune action ou action non reconnue
        break;
    }
  }, [navigate]);

  return {
    isListening,
    isProcessing,
    transcript,
    lastAction,
    startListening,
    stopListening
  };
}
