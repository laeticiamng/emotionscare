// @ts-nocheck

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface TextToVoiceOptions {
  defaultVoice?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

export function useTextToVoice(options: TextToVoiceOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Convert base64 to audio and play it
  const playAudio = (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        
        // Create audio from base64
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Set up event handlers
        audio.onplay = () => {
          setIsSpeaking(true);
          if (options.onSpeakStart) options.onSpeakStart();
        };
        
        audio.onended = () => {
          setIsSpeaking(false);
          if (options.onSpeakEnd) options.onSpeakEnd();
          URL.revokeObjectURL(audioUrl); // Clean up
          resolve();
        };
        
        audio.onerror = (e) => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback error'));
        };
        
        // Store current audio for potential control
        setCurrentAudio(audio);
        
        // Play the audio
        audio.play().catch(err => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  };
  
  // Main speak function
  const speak = async (text: string, voice?: string) => {
    if (!text || text.trim() === '') {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { 
          text: text.trim(),
          voice: voice || options.defaultVoice || 'alloy'
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.audioContent) {
        await playAudio(data.audioContent);
      } else {
        throw new Error('No audio content returned');
      }
    } catch (err) {
      // Speech generation error
      setError(err instanceof Error ? err.message : 'Error generating speech');
      toast({
        title: "Erreur de synthèse vocale",
        description: "Impossible de générer l'audio. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop speaking
  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsSpeaking(false);
      if (options.onSpeakEnd) options.onSpeakEnd();
    }
  };
  
  return {
    speak,
    stop,
    isLoading,
    isSpeaking,
    error
  };
}
