
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { useMusic } from '@/contexts/MusicContext';
import useMusicEmotionIntegration from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';
import { EmotionalJournalResponse } from '@/lib/ai/journal-service';

export interface OnboardingState {
  step: number;
  loading: boolean;
  emotion: string;
  intensity: number;
  userResponses: Record<string, any>;
  emotionAnalysis: any;
  
  nextStep: () => void;
  prevStep: () => void;
  handleResponse: (key: string, value: any) => void;
  completeOnboarding: () => Promise<void>;
  analyzeEmotion: (text: string) => Promise<void>;
}

export function useOnboardingState(): OnboardingState {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { activateMusicForEmotion } = useMusicEmotionIntegration();
  const { journal: { analyzeEmotionalJournal } } = useOpenAI();
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string>('neutral');
  const [intensity, setIntensity] = useState<number>(50);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [emotionAnalysis, setEmotionAnalysis] = useState<any>(null);
  
  // If user has completed onboarding, redirect to dashboard
  useEffect(() => {
    if (user?.onboarded) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Update music based on detected emotion
  useEffect(() => {
    if (emotion && emotion !== 'neutral') {
      activateMusicForEmotion({
        emotion,
        intensity: intensity / 100,
        confidence: 0.8
      });
    }
  }, [emotion, intensity, activateMusicForEmotion]);

  // Handle emotional analysis based on user responses
  const analyzeEmotion = async (text: string) => {
    setLoading(true);
    try {
      const result = await analyzeEmotionalJournal(text);
      if (result) {
        setEmotionAnalysis(result);
        setEmotion(result.emotion || 'neutral');
        setIntensity(Math.floor((result.intensity || 0.5) * 100));
        
        // Load emotionally appropriate music
        const playlist = await loadPlaylistForEmotion(result.emotion || 'neutral');
        if (playlist && playlist.tracks?.length > 0) {
          playTrack(playlist.tracks[0]);
        }
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Analyse émotionnelle",
        description: "Impossible d'analyser votre état émotionnel. Nous utilisons un profil par défaut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (key: string, value: any) => {
    const newResponses = { ...userResponses, [key]: value };
    setUserResponses(newResponses);
    
    // If the response is text-based, analyze it for emotional content
    if (typeof value === 'string' && value.length > 20) {
      analyzeEmotion(value);
    }
  };

  const nextStep = () => {
    if (step < 4) { // Adjusted for 5 total steps (0-4)
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      // Update user with onboarding data
      await updateUser({
        ...user,
        onboarded: true,
        preferences: {
          ...user.preferences,
          ...userResponses
        },
        emotional_profile: {
          primary_emotion: emotion,
          intensity: intensity / 100,
          analysis: emotionAnalysis
        }
      });
      
      toast({
        title: "Onboarding terminé !",
        description: "Bienvenue dans votre espace EmotionsCare personnalisé.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    emotion,
    intensity,
    userResponses,
    emotionAnalysis,
    nextStep,
    prevStep,
    handleResponse,
    completeOnboarding,
    analyzeEmotion,
  };
}
