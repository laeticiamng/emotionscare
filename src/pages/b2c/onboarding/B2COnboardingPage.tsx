
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    goals: [] as string[],
    emotionalState: '',
    preferences: {
      musicGenres: [] as string[],
      activityTimes: [] as string[],
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const goals = [
    'Réduire le stress',
    'Améliorer mon humeur',
    'Mieux comprendre mes émotions',
    'Développer ma résilience',
    'Améliorer mon sommeil',
    'Augmenter ma confiance en soi',
  ];

  const musicGenres = [
    'Classique',
    'Ambient',
    'Nature',
    'Jazz',
    'Méditation',
    'Lofi',
  ];

  const activityTimes = [
    'Matin (6h-12h)',
    'Après-midi (12h-18h)',
    'Soirée (18h-22h)',
    'Nuit (22h-6h)',
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

  const handleMusicGenreChange = (genre: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        musicGenres: checked 
          ? [...prev.preferences.musicGenres, genre]
          : prev.preferences.musicGenres.filter(g => g !== genre)
      }
    }));
  };

  const handleActivityTimeChange = (time: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        activityTimes: checked 
          ? [...prev.preferences.activityTimes, time]
          : prev.preferences.activityTimes.filter(t => t !== time)
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('b2c_onboarding_data', JSON.stringify(formData));
    
    toast({
      title: "Onboarding terminé !",
      description: "Votre profil a été configuré avec succès.",
    });
    
    navigate('/b2c/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur EmotionsCare !</h2>
              <p className="text-muted-foreground">
                Commençons par apprendre à vous connaître.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Quel âge avez-vous ?</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Votre âge"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Quels sont vos objectifs ?</h2>
              <p className="text-muted-foreground">
                Sélectionnez tous les objectifs qui vous correspondent.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Comment vous sentez-vous aujourd'hui ?</h2>
              <p className="text-muted-foreground">
                Choisissez l'état qui décrit le mieux votre humeur actuelle.
              </p>
            </div>
            
            <RadioGroup
              value={formData.emotionalState}
              onValueChange={(value) => setFormData(prev => ({ ...prev, emotionalState: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">😊 Excellent - Je me sens fantastique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">🙂 Bien - Je me sens plutôt en forme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">😐 Neutre - Ni bien ni mal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tired" id="tired" />
                <Label htmlFor="tired">😴 Fatigué - J'ai besoin de repos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stressed" id="stressed" />
                <Label htmlFor="stressed">😰 Stressé - Je me sens tendu</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Vos préférences</h2>
              <p className="text-muted-foreground">
                Aidez-nous à personnaliser votre expérience.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Quels genres musicaux préférez-vous ?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {musicGenres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre}
                        checked={formData.preferences.musicGenres.includes(genre)}
                        onCheckedChange={(checked) => handleMusicGenreChange(genre, checked as boolean)}
                      />
                      <Label htmlFor={genre} className="text-sm font-normal">
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  À quels moments préférez-vous utiliser l'app ?
                </Label>
                <div className="space-y-2">
                  {activityTimes.map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.preferences.activityTimes.includes(time)}
                        onCheckedChange={(checked) => handleActivityTimeChange(time, checked as boolean)}
                      />
                      <Label htmlFor={time} className="text-sm font-normal">
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-pink-500 mr-2" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          <CardTitle>Configuration de votre profil</CardTitle>
          <CardDescription>
            Étape {currentStep} sur {totalSteps}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
