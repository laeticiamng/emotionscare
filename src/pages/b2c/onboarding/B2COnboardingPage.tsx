
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, User, Target, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingData {
  fullName: string;
  age: string;
  goals: string[];
  experience: string;
  notifications: boolean;
}

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: user?.name || '',
    age: '',
    goals: [],
    experience: '',
    notifications: true
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
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
      if (!user) throw new Error('Utilisateur non connecté');

      // Sauvegarder les données d'onboarding dans le profil
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.fullName,
          preferences: {
            age: data.age,
            goals: data.goals,
            experience: data.experience,
            notifications_enabled: data.notifications,
            onboarding_completed: true,
            theme: 'system',
            language: 'fr',
            email_notifications: true
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profil configuré avec succès !');
      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error('Erreur lors de la configuration du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const availableGoals = [
    'Réduire le stress',
    'Améliorer l\'humeur',
    'Gérer l\'anxiété',
    'Développer la confiance',
    'Mieux dormir',
    'Équilibre vie pro/perso'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Faisons connaissance</h2>
              <p className="text-muted-foreground">Parlez-nous un peu de vous</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={data.fullName}
                  onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Votre nom complet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge (optionnel)</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Votre âge"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Vos objectifs</h2>
              <p className="text-muted-foreground">Quels sont vos objectifs de bien-être ?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {availableGoals.map((goal) => (
                <Button
                  key={goal}
                  variant={data.goals.includes(goal) ? "default" : "outline"}
                  onClick={() => handleGoalToggle(goal)}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    {data.goals.includes(goal) && <CheckCircle className="h-5 w-5" />}
                    <span>{goal}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Votre expérience</h2>
              <p className="text-muted-foreground">Avez-vous déjà utilisé des outils de bien-être ?</p>
            </div>
            <RadioGroup
              value={data.experience}
              onValueChange={(value) => setData(prev => ({ ...prev, experience: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Débutant</p>
                    <p className="text-sm text-muted-foreground">Première fois que j'utilise ce type d'outil</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Intermédiaire</p>
                    <p className="text-sm text-muted-foreground">J'ai déjà essayé quelques applications</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="experienced" id="experienced" />
                <Label htmlFor="experienced" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Expérimenté</p>
                    <p className="text-sm text-muted-foreground">J'utilise régulièrement des outils de bien-être</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Presque terminé !</h2>
              <p className="text-muted-foreground">Configurons vos préférences finales</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Recevoir des rappels de bien-être</p>
                  </div>
                  <Button
                    variant={data.notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setData(prev => ({ ...prev, notifications: !prev.notifications }))}
                  >
                    {data.notifications ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Récapitulatif</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nom: {data.fullName}</li>
                  {data.age && <li>• Âge: {data.age} ans</li>}
                  <li>• Objectifs: {data.goals.length} sélectionnés</li>
                  <li>• Expérience: {data.experience || 'Non spécifiée'}</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.fullName.trim().length > 0;
      case 2:
        return data.goals.length > 0;
      case 3:
        return data.experience.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle>Configuration du profil</CardTitle>
              <span className="text-sm text-muted-foreground">
                {currentStep}/{totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            
            {currentStep === totalSteps ? (
              <Button 
                onClick={handleComplete} 
                disabled={!canProceed() || isLoading}
              >
                {isLoading ? 'Configuration...' : 'Terminer'}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
              >
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
