// @ts-nocheck

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useTextToVoice } from './useTextToVoice';

interface VoiceAssistantOptions {
  autoStart?: boolean;
  emotionalState?: string;
  onActionDetected?: (action: string, params: any) => void;
  responseVoice?: string;
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
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { speak, isSpeaking } = useTextToVoice({ 
    defaultVoice: options.responseVoice || 'nova' 
  });

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
      // Check if already listening
      if (isListening || isProcessing) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
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
      // Microphone access error
      toast({
        title: "Erreur microphone",
        description: "L'accès au microphone a été refusé ou n'est pas disponible.",
        variant: "destructive",
      });
    }
  }, [isListening, isProcessing]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (!isListening) return;
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsListening(false);
    
    toast({
      title: "Assistant vocal désactivé",
      description: "Mode d'écoute terminé",
    });
  }, [mediaRecorder, isListening]);

  // Traiter les données audio
  const processAudioData = async () => {
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
        const audioDataPart = base64Audio.split(',')[1];
        
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
            
            // Réponse vocale
            speak(data.responseMessage);
            
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
          // Audio processing error
          toast({
            title: "Échec de traitement",
            description: "Je n'ai pas pu comprendre votre commande.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          setAudioChunks([]);
        }
      };
    } catch (error) {
      // Audio processing error fallback
      setIsProcessing(false);
      setAudioChunks([]);
    }
  };

  // Exécuter l'action détectée
  const executeAction = useCallback((action: string, parameters: any) => {
    switch (action) {
      case 'open_journal':
        navigate('/journal');
        break;
      
      case 'start_meditation':
        navigate('/app/meditation');
        break;
      
      case 'play_music':
        navigate('/music');
        // Music started with params - silent
        return `🎵 Lecture de musique démarrée avec les paramètres: ${JSON.stringify(params)}`;
        break;
      
      case 'scan_emotion':
        navigate('/scan');
        break;
      
      case 'coach_chat':
        navigate('/app/coach');
        break;
      
      case 'show_dashboard':
        navigate('/app/consumer/home');
        break;
      
      case 'search_content':
        // Search with params - silent
        return `🔍 Recherche effectuée avec les paramètres: ${JSON.stringify(params)}`;
        navigate('/app/scan');
        break;
      
      case 'help':
        navigate('/aide');
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
    isSpeaking,
    startListening,
    stopListening
  };
}
