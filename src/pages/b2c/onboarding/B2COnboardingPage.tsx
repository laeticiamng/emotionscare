
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    profession: '',
    emotionalGoals: [] as string[],
    wellnessExperience: '',
    preferredTime: '',
    notifications: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 3;

  const emotionalGoalsOptions = [
    'Gérer le stress',
    'Améliorer la confiance en soi',
    'Réguler les émotions',
    'Développer la résilience',
    'Améliorer les relations',
    'Augmenter la motivation',
    'Mieux dormir',
    'Réduire l\'anxiété'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      emotionalGoals: prev.emotionalGoals.includes(goal)
        ? prev.emotionalGoals.filter(g => g !== goal)
        : [...prev.emotionalGoals, goal]
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            preferences: {
              ...formData,
              onboarding_completed: true,
              onboarding_date: new Date().toISOString()
            }
          })
          .eq('id', user.id);

        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder vos préférences",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Bienvenue sur EmotionsCare !",
          description: "Votre profil a été configuré avec succès. Profitez de vos 3 jours gratuits !",
        });

        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
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
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Parlez-nous de vous</h2>
              <p className="text-gray-600">Ces informations nous aident à personnaliser votre expérience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Âge (optionnel)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Votre âge"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession (optionnel)</Label>
                <Input
                  id="profession"
                  placeholder="Votre profession"
                  value={formData.profession}
                  onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Moment préféré pour le bien-être</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                >
                  <option value="">Sélectionnez un moment</option>
                  <option value="morning">Matin</option>
                  <option value="afternoon">Après-midi</option>
                  <option value="evening">Soir</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Vos objectifs de bien-être</h2>
              <p className="text-gray-600">Sélectionnez les domaines sur lesquels vous souhaitez travailler</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {emotionalGoalsOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.emotionalGoals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Dernières préférences</h2>
              <p className="text-gray-600">Configurez votre expérience finale</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wellnessExperience">Expérience avec le bien-être mental (optionnel)</Label>
                <Textarea
                  id="wellnessExperience"
                  placeholder="Décrivez brièvement votre expérience avec le bien-être mental, la méditation, etc."
                  value={formData.wellnessExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, wellnessExperience: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked as boolean }))}
                />
                <Label htmlFor="notifications" className="text-sm">
                  Recevoir des notifications pour mes sessions de bien-être
                </Label>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Votre période d'essai gratuite</span>
                </div>
                <p className="text-sm text-green-600">
                  Vous bénéficiez de 3 jours d'accès complet gratuit à toutes les fonctionnalités EmotionsCare !
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            <CardTitle>Configuration de votre profil</CardTitle>
            <CardDescription>
              Étape {currentStep} sur {totalSteps}
            </CardDescription>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Terminer
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2COnboardingPage;
