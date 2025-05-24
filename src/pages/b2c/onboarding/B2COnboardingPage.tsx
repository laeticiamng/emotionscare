
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Brain, Target, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  goals: string[];
  interests: string[];
  experience: string;
  personalNote: string;
}

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    interests: [],
    experience: '',
    personalNote: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    {
      title: 'Vos objectifs',
      icon: Target,
      description: 'Quels sont vos objectifs avec EmotionsCare ?'
    },
    {
      title: 'Vos centres d\'intérêt',
      icon: Heart,
      description: 'Qu\'est-ce qui vous passionne ?'
    },
    {
      title: 'Votre expérience',
      icon: Brain,
      description: 'Votre expérience avec le bien-être émotionnel'
    },
    {
      title: 'Note personnelle',
      icon: User,
      description: 'Partagez-nous en plus sur vous'
    }
  ];

  const goalOptions = [
    'Gérer le stress', 'Améliorer l\'humeur', 'Développer la mindfulness',
    'Mieux dormir', 'Augmenter la confiance', 'Équilibre vie-travail'
  ];

  const interestOptions = [
    'Méditation', 'Musique thérapeutique', 'Journal personnel',
    'Exercices de respiration', 'Coaching émotionnel', 'Analyse de soi'
  ];

  const toggleSelection = (field: 'goals' | 'interests', value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            preferences: {
              ...data,
              onboarding_completed: true,
              completed_at: new Date().toISOString()
            }
          })
          .eq('id', user.id);

        if (error) throw error;

        toast.success('Configuration terminée ! Bienvenue sur EmotionsCare');
        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <Button
                  key={goal}
                  variant={data.goals.includes(goal) ? "default" : "outline"}
                  onClick={() => toggleSelection('goals', goal)}
                  className="h-auto p-3 text-center"
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <Button
                  key={interest}
                  variant={data.interests.includes(interest) ? "default" : "outline"}
                  onClick={() => toggleSelection('interests', interest)}
                  className="h-auto p-3 text-center"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez votre expérience avec les pratiques de bien-être émotionnel..."
              value={data.experience}
              onChange={(e) => setData(prev => ({ ...prev, experience: e.target.value }))}
              rows={4}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Y a-t-il quelque chose de spécifique que vous aimeriez nous faire savoir ?"
              value={data.personalNote}
              onChange={(e) => setData(prev => ({ ...prev, personalNote: e.target.value }))}
              rows={4}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {React.createElement(steps[currentStep].icon, { 
                className: "h-12 w-12 text-primary" 
              })}
            </div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
            
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
