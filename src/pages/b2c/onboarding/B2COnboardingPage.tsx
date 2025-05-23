
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Target, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    preferences: {
      reminderFrequency: 'daily',
      privacyLevel: 'normal',
    },
    personalInfo: {
      profession: '',
      interests: '',
      wellbeingGoals: '',
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const wellbeingGoals = [
    { id: 'stress', label: 'Réduire le stress', icon: '🧘' },
    { id: 'mood', label: 'Améliorer mon humeur', icon: '😊' },
    { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
    { id: 'energy', label: 'Avoir plus d\'énergie', icon: '⚡' },
    { id: 'focus', label: 'Améliorer ma concentration', icon: '🎯' },
    { id: 'relations', label: 'Améliorer mes relations', icon: '❤️' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (user) {
        await updateUser({
          ...user,
          onboarded: true,
          preferences: {
            ...user.preferences,
            ...formData.preferences,
            goals: formData.goals
          }
        });
      }

      toast({
        title: "Bienvenue sur EmotionsCare !",
        description: "Votre profil a été configuré avec succès.",
        variant: "success"
      });

      navigate('/b2c/dashboard');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur EmotionsCare</h2>
              <p className="text-muted-foreground">
                Nous allons personnaliser votre expérience en quelques étapes simples
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Quels sont vos objectifs ?</h2>
              <p className="text-muted-foreground">
                Sélectionnez les domaines que vous souhaitez améliorer
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {wellbeingGoals.map((goal) => (
                <Button
                  key={goal.id}
                  variant={formData.goals.includes(goal.id) ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-sm text-center">{goal.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Parlez-nous de vous</h2>
              <p className="text-muted-foreground">
                Ces informations nous aident à personnaliser votre expérience
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profession">Profession (optionnel)</Label>
                <Input
                  id="profession"
                  value={formData.personalInfo.profession}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, profession: e.target.value }
                  }))}
                  placeholder="Ex: Infirmière, Étudiant, Manager..."
                />
              </div>
              <div>
                <Label htmlFor="interests">Centres d'intérêt (optionnel)</Label>
                <Input
                  id="interests"
                  value={formData.personalInfo.interests}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, interests: e.target.value }
                  }))}
                  placeholder="Ex: Sport, Lecture, Musique..."
                />
              </div>
              <div>
                <Label htmlFor="wellbeingGoals">Objectifs de bien-être (optionnel)</Label>
                <Textarea
                  id="wellbeingGoals"
                  value={formData.personalInfo.wellbeingGoals}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, wellbeingGoals: e.target.value }
                  }))}
                  placeholder="Décrivez vos objectifs de bien-être..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h2 className="text-xl font-bold mb-2">Tout est prêt !</h2>
              <p className="text-muted-foreground">
                Votre profil est configuré. Vous pouvez maintenant explorer EmotionsCare.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Résumé de votre profil :</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {formData.goals.length} objectif(s) sélectionné(s)</li>
                {formData.personalInfo.profession && (
                  <li>• Profession : {formData.personalInfo.profession}</li>
                )}
                {formData.personalInfo.interests && (
                  <li>• Centres d'intérêt : {formData.personalInfo.interests}</li>
                )}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Finalisation de votre profil..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <CardDescription>
              Étape {currentStep} sur {totalSteps}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === 2 && formData.goals.length === 0}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
