
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, User, Target, Heart, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  firstName: string;
  lastName: string;
  age: string;
  goals: string;
  concerns: string;
  preferences: string[];
}

const B2COnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    age: '',
    goals: '',
    concerns: '',
    preferences: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    setData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: `${data.firstName} ${data.lastName}`,
            preferences: {
              age: data.age,
              goals: data.goals,
              concerns: data.concerns,
              preferences: data.preferences,
              onboarding_completed: true
            }
          })
          .eq('id', user.id);

        if (error) throw error;
        
        toast.success('Profil configuré avec succès !');
        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const preferences = [
    'Méditation', 'Relaxation', 'Exercices de respiration', 
    'Musique thérapeutique', 'Journal personnel', 'Coaching IA',
    'Analyses émotionnelles', 'Suivi de progression'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Configuration de votre profil</CardTitle>
            <CardDescription>
              Aidez-nous à personnaliser votre expérience EmotionsCare
            </CardDescription>
            <Progress value={(step / totalSteps) * 100} className="mt-4" />
            <p className="text-sm text-muted-foreground">Étape {step} sur {totalSteps}</p>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Informations personnelles</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Prénom"
                    value={data.firstName}
                    onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Nom"
                    value={data.lastName}
                    onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Âge"
                  value={data.age}
                  onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Vos objectifs</h3>
                </div>
                <Textarea
                  placeholder="Quels sont vos objectifs de bien-être ? (ex: réduire le stress, améliorer l'humeur, mieux gérer les émotions...)"
                  value={data.goals}
                  onChange={(e) => setData(prev => ({ ...prev, goals: e.target.value }))}
                  rows={4}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Préoccupations actuelles</h3>
                </div>
                <Textarea
                  placeholder="Y a-t-il des préoccupations particulières que vous aimeriez aborder ? (optionnel)"
                  value={data.concerns}
                  onChange={(e) => setData(prev => ({ ...prev, concerns: e.target.value }))}
                  rows={4}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Fonctionnalités préférées</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sélectionnez les fonctionnalités qui vous intéressent le plus :
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {preferences.map((preference) => (
                    <Button
                      key={preference}
                      variant={data.preferences.includes(preference) ? "default" : "outline"}
                      onClick={() => handlePreferenceToggle(preference)}
                      className="text-left justify-start h-auto py-3"
                    >
                      {preference}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Précédent
              </Button>
              
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!data.firstName || !data.lastName)) ||
                    (step === 2 && !data.goals)
                  }
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading || data.preferences.length === 0}
                >
                  {isLoading ? 'Finalisation...' : 'Terminer'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
