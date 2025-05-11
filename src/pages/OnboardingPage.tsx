import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingContent from '@/components/onboarding/OnboardingContent';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences, ThemeName, FontSize, FontFamily } from '@/types/user';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  
  const handleResponse = (key: string, value: any) => {
    setUserResponses(prev => ({ ...prev, [key]: value }));
    
    if (key === 'emotion') {
      setEmotion(value);
    }
  };
  
  const nextStep = () => {
    setStep(s => s + 1);
  };
  
  const prevStep = () => {
    setStep(s => Math.max(0, s - 1));
  };
  
  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Save user preferences
      const preferences: UserPreferences = {
        theme: (userResponses.theme as ThemeName) || 'light',
        language: userResponses.language || 'fr',
        fontSize: (userResponses.fontSize as FontSize) || 'medium',
        fontFamily: (userResponses.fontFamily as FontFamily) || 'inter',
        notifications: !!userResponses.notifications,
        soundEnabled: !!userResponses.soundEnabled,
        privacyLevel: userResponses.privacyLevel || 'private',
        onboardingCompleted: true,
        dashboardLayout: userResponses.dashboardLayout || 'standard',
      };
      
      if (user?.id) {
        // Update the user with the new preferences
        await updateUser({
          ...user,
          onboarded: true,
          preferences
        });
      }
      
      toast({
        title: "Bienvenue!",
        description: "Votre expérience est maintenant personnalisée."
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Configuration de votre espace</h1>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              Ignorer
            </Button>
          </div>
          
          <div className="w-full bg-muted h-2 mt-6 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all"
              style={{ width: `${((step + 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <OnboardingContent
          step={step}
          loading={loading}
          emotion={emotion}
          userResponses={userResponses}
          nextStep={nextStep}
          prevStep={prevStep}
          handleResponse={handleResponse}
          completeOnboarding={completeOnboarding}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
