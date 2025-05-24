
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Brain, 
  Target, 
  User, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingData {
  personalInfo: {
    age: string;
    occupation: string;
    interests: string[];
  };
  wellbeingGoals: {
    primaryGoals: string[];
    stressLevel: string;
    sleepQuality: string;
  };
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    reminderFrequency: string;
  };
}

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      age: '',
      occupation: '',
      interests: []
    },
    wellbeingGoals: {
      primaryGoals: [],
      stressLevel: '',
      sleepQuality: ''
    },
    preferences: {
      notifications: true,
      dataSharing: false,
      reminderFrequency: 'daily'
    }
  });

  const totalSteps = 4;

  const interests = [
    'Méditation', 'Sport', 'Lecture', 'Musique', 'Art', 'Nature', 
    'Cuisine', 'Voyage', 'Technologie', 'Développement personnel'
  ];

  const wellbeingGoals = [
    'Réduire le stress', 'Améliorer le sommeil', 'Gérer l\'anxiété', 
    'Augmenter la confiance', 'Améliorer l\'humeur', 'Développer la pleine conscience'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateWellbeingGoals = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      wellbeingGoals: {
        ...prev.wellbeingGoals,
        [field]: value
      }
    }));
  };

  const updatePreferences = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (array: string[], item: string, updateFn: (field: string, value: string[]) => void, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFn(field, newArray);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Sauvegarder les données d'onboarding
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...onboardingData.preferences,
            onboarding_completed: true,
            personal_info: onboardingData.personalInfo,
            wellbeing_goals: onboardingData.wellbeingGoals
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Configuration terminée avec succès !');
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Erreur onboarding:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Parlez-nous de vous</h2>
              <p className="text-muted-foreground">
                Ces informations nous aideront à personnaliser votre expérience
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Votre âge</Label>
                <Select 
                  value={onboardingData.personalInfo.age} 
                  onValueChange={(value) => updatePersonalInfo('age', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre tranche d'âge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25 ans</SelectItem>
                    <SelectItem value="26-35">26-35 ans</SelectItem>
                    <SelectItem value="36-45">36-45 ans</SelectItem>
                    <SelectItem value="46-55">46-55 ans</SelectItem>
                    <SelectItem value="56+">56 ans et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="occupation">Votre profession</Label>
                <Input
                  id="occupation"
                  value={onboardingData.personalInfo.occupation}
                  onChange={(e) => updatePersonalInfo('occupation', e.target.value)}
                  placeholder="Ex: Développeur, Enseignant, Médecin..."
                />
              </div>

              <div>
                <Label>Vos centres d'intérêt</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={onboardingData.personalInfo.interests.includes(interest)}
                        onCheckedChange={() => 
                          toggleArrayItem(
                            onboardingData.personalInfo.interests, 
                            interest, 
                            updatePersonalInfo, 
                            'interests'
                          )
                        }
                      />
                      <Label htmlFor={interest} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Vos objectifs bien-être</h2>
              <p className="text-muted-foreground">
                Que souhaitez-vous améliorer dans votre vie ?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Objectifs principaux (sélectionnez plusieurs options)</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {wellbeingGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={onboardingData.wellbeingGoals.primaryGoals.includes(goal)}
                        onCheckedChange={() => 
                          toggleArrayItem(
                            onboardingData.wellbeingGoals.primaryGoals, 
                            goal, 
                            updateWellbeingGoals, 
                            'primaryGoals'
                          )
                        }
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Niveau de stress actuel</Label>
                <Select 
                  value={onboardingData.wellbeingGoals.stressLevel} 
                  onValueChange={(value) => updateWellbeingGoals('stressLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Évaluez votre niveau de stress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="moderate">Modéré</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="very-high">Très élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Qualité de votre sommeil</Label>
                <Select 
                  value={onboardingData.wellbeingGoals.sleepQuality} 
                  onValueChange={(value) => updateWellbeingGoals('sleepQuality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Comment dormez-vous ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Bon</SelectItem>
                    <SelectItem value="average">Moyen</SelectItem>
                    <SelectItem value="poor">Mauvais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Préférences de l'application</h2>
              <p className="text-muted-foreground">
                Personnalisez votre expérience EmotionsCare
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications de rappel</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels pour vos sessions bien-être
                  </p>
                </div>
                <Checkbox
                  id="notifications"
                  checked={onboardingData.preferences.notifications}
                  onCheckedChange={(checked) => updatePreferences('notifications', checked)}
                />
              </div>

              <div>
                <Label>Fréquence des rappels</Label>
                <Select 
                  value={onboardingData.preferences.reminderFrequency} 
                  onValueChange={(value) => updatePreferences('reminderFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSharing">Partage anonyme des données</Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer l'application (données anonymisées)
                  </p>
                </div>
                <Checkbox
                  id="dataSharing"
                  checked={onboardingData.preferences.dataSharing}
                  onCheckedChange={(checked) => updatePreferences('dataSharing', checked)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Vous êtes prêt !</h2>
              <p className="text-muted-foreground">
                Votre profil EmotionsCare est maintenant configuré
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium">3 jours d'essai gratuit activés</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Profil personnalisé créé</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Prêt à commencer votre parcours bien-être ?
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configuration de votre profil</CardTitle>
            <div className="text-sm text-muted-foreground">
              {currentStep}/{totalSteps}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLoading}
            >
              {currentStep === totalSteps ? (
                isLoading ? 'Finalisation...' : 'Terminer'
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
