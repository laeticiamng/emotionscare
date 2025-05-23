
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Heart, User, Target, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  age: string;
  occupation: string;
  goals: string[];
  stressLevel: string;
  preferredActivities: string[];
  notificationPreferences: {
    daily: boolean;
    weekly: boolean;
    insights: boolean;
  };
  personalNote: string;
}

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 4;
  
  const [data, setData] = useState<OnboardingData>({
    age: '',
    occupation: '',
    goals: [],
    stressLevel: '',
    preferredActivities: [],
    notificationPreferences: {
      daily: true,
      weekly: true,
      insights: true
    },
    personalNote: ''
  });

  const goalOptions = [
    'Réduire le stress',
    'Améliorer mon humeur',
    'Mieux gérer mes émotions',
    'Augmenter ma confiance en soi',
    'Améliorer mes relations',
    'Être plus productif',
    'Développer ma créativité',
    'Autre'
  ];

  const activityOptions = [
    'Méditation',
    'Respiration guidée',
    'Journaling',
    'Musique relaxante',
    'Exercices de visualisation',
    'Défis quotidiens',
    'Lectures inspirantes',
    'Communauté et partage'
  ];

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      // Mise à jour du profil utilisateur
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

      if (error) {
        throw error;
      }

      toast({
        title: "Profil configuré !",
        description: "Votre parcours personnalisé vous attend",
        variant: "default"
      });

      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences",
        variant: "destructive"
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
            <div className="text-center mb-8">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Parlons de vous</h2>
              <p className="text-muted-foreground">
                Ces informations nous aident à personnaliser votre expérience
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Votre âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="ex: 28"
                  min="13"
                  max="120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Votre profession/occupation</Label>
                <Input
                  id="occupation"
                  value={data.occupation}
                  onChange={(e) => setData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="ex: Développeur, Étudiant, Parent..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vos objectifs</h2>
              <p className="text-muted-foreground">
                Que souhaitez-vous améliorer dans votre vie ?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={data.goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label>Votre niveau de stress actuel</Label>
              <RadioGroup 
                value={data.stressLevel} 
                onValueChange={(value) => setData(prev => ({ ...prev, stressLevel: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="stress-low" />
                  <Label htmlFor="stress-low">Faible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="stress-medium" />
                  <Label htmlFor="stress-medium">Modéré</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="stress-high" />
                  <Label htmlFor="stress-high">Élevé</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vos préférences</h2>
              <p className="text-muted-foreground">
                Quelles activités vous intéressent le plus ?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activityOptions.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={data.preferredActivities.includes(activity)}
                    onCheckedChange={() => handleActivityToggle(activity)}
                  />
                  <Label htmlFor={activity} className="text-sm font-normal cursor-pointer">
                    {activity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Finalisation</h2>
              <p className="text-muted-foreground">
                Derniers réglages pour personnaliser votre expérience
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="daily"
                      checked={data.notificationPreferences.daily}
                      onCheckedChange={(checked) => 
                        setData(prev => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev.notificationPreferences,
                            daily: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="daily" className="text-sm font-normal">
                      Rappels quotidiens de bien-être
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="weekly"
                      checked={data.notificationPreferences.weekly}
                      onCheckedChange={(checked) => 
                        setData(prev => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev.notificationPreferences,
                            weekly: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="weekly" className="text-sm font-normal">
                      Résumé hebdomadaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insights"
                      checked={data.notificationPreferences.insights}
                      onCheckedChange={(checked) => 
                        setData(prev => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev.notificationPreferences,
                            insights: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="insights" className="text-sm font-normal">
                      Conseils personnalisés
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personalNote">Un mot personnel (optionnel)</Label>
                <Textarea
                  id="personalNote"
                  value={data.personalNote}
                  onChange={(e) => setData(prev => ({ ...prev, personalNote: e.target.value }))}
                  placeholder="Partagez quelque chose d'important sur votre situation actuelle..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.age && data.occupation;
      case 2:
        return data.goals.length > 0 && data.stressLevel;
      case 3:
        return data.preferredActivities.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuration de votre profil</h1>
          <p className="text-muted-foreground mb-6">
            Aidez-nous à créer une expérience parfaitement adaptée à vos besoins
          </p>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Étape {currentStep} sur {totalSteps}
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? 'Finalisation...' : 'Terminer'}
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Skip option */}
        <div className="text-center mt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/b2c/dashboard')}
            className="text-sm"
          >
            Passer cette étape pour l'instant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2COnboardingPage;
