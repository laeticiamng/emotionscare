
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { useMusic } from '@/contexts/MusicContext';
import useMusicEmotionIntegration from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';

// Onboarding sections
import WelcomeSection from '@/components/onboarding/WelcomeSection';
import EmotionalAssessment from '@/components/onboarding/EmotionalAssessment';
import FeaturesTour from '@/components/onboarding/FeaturesTour';
import PersonalizationSection from '@/components/onboarding/PersonalizationSection';
import CompletionSection from '@/components/onboarding/CompletionSection';

const OnboardingExperiencePage: React.FC = () => {
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;
  
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
    if (step < totalSteps - 1) {
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

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <WelcomeSection 
            onContinue={nextStep} 
            videoRef={videoRef}
            onResponse={handleResponse}
          />
        );
      case 1:
        return (
          <EmotionalAssessment 
            onContinue={nextStep} 
            onBack={prevStep}
            onResponse={handleResponse}
            loading={loading}
          />
        );
      case 2:
        return (
          <FeaturesTour 
            onContinue={nextStep} 
            onBack={prevStep}
            emotion={emotion}
            onResponse={handleResponse}
          />
        );
      case 3:
        return (
          <PersonalizationSection 
            onContinue={nextStep} 
            onBack={prevStep}
            emotion={emotion}
            onResponse={handleResponse}
          />
        );
      case 4:
        return (
          <CompletionSection 
            onFinish={completeOnboarding} 
            onBack={prevStep}
            emotion={emotion}
            responses={userResponses}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="py-6 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">EmotionsCare</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Étape {step + 1} de {totalSteps}
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <Progress value={progress} className="mb-8" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="py-6 px-6 border-t">
        <div className="container max-w-5xl mx-auto flex justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 0 || loading}
          >
            Précédent
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={step === totalSteps - 1 || loading}
          >
            {loading ? "Chargement..." : "Continuer"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingExperiencePage;
