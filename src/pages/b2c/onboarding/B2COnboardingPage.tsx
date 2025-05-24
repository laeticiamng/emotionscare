
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, CheckCircle, Target, User } from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    experience: '',
    preferences: {
      reminderFrequency: 'daily',
      preferredTime: '09:00'
    },
    personalInfo: {
      age: '',
      occupation: '',
      interests: ''
    }
  });
  const navigate = useNavigate();

  const goals = [
    'Réduire le stress',
    'Améliorer le sommeil',
    'Gérer l\'anxiété',
    'Développer la confiance en soi',
    'Améliorer les relations',
    'Augmenter la productivité',
    'Mieux gérer les émotions',
    'Pratiquer la pleine conscience'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.goals.length === 0) {
      toast.error('Veuillez sélectionner au moins un objectif');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleComplete = () => {
    toast.success('Bienvenue dans EmotionsCare ! Votre profil a été configuré.');
    navigate('/b2c/dashboard');
  };

  const steps = [
    {
      title: 'Vos objectifs',
      description: 'Que souhaitez-vous améliorer ?',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map(goal => (
              <Button
                key={goal}
                variant={formData.goals.includes(goal) ? "default" : "outline"}
                onClick={() => handleGoalToggle(goal)}
                className="justify-start h-auto p-4 text-left"
              >
                <div className="flex items-center space-x-2">
                  {formData.goals.includes(goal) && <CheckCircle className="h-4 w-4" />}
                  <span>{goal}</span>
                </div>
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Sélectionnez tous les objectifs qui vous correspondent
          </p>
        </div>
      )
    },
    {
      title: 'Votre expérience',
      description: 'Parlez-nous de votre parcours',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Avez-vous déjà utilisé des outils de bien-être ?
            </label>
            <Textarea
              placeholder="Décrivez votre expérience avec la méditation, le coaching, la thérapie, etc."
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Vos préférences',
      description: 'Personnalisons votre expérience',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Fréquence des rappels
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.preferences.reminderFrequency}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, reminderFrequency: e.target.value }
              }))}
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="none">Aucun rappel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Heure préférée pour les notifications
            </label>
            <Input
              type="time"
              value={formData.preferences.preferredTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, preferredTime: e.target.value }
              }))}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Informations personnelles',
      description: 'Dernières informations pour personnaliser votre coaching',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Âge (optionnel)</label>
            <Input
              type="number"
              placeholder="25"
              value={formData.personalInfo.age}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, age: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profession (optionnel)</label>
            <Input
              placeholder="Développeur, Enseignant, Étudiant..."
              value={formData.personalInfo.occupation}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, occupation: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Centres d'intérêt (optionnel)</label>
            <Textarea
              placeholder="Sport, lecture, musique, voyage..."
              value={formData.personalInfo.interests}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, interests: e.target.value }
              }))}
            />
          </div>
        </div>
      )
    }
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
            <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Configuration de votre profil</CardTitle>
            <CardDescription>
              Étape {currentStep} sur {steps.length}
            </CardDescription>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{steps[currentStep - 1].title}</h3>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
            
            {steps[currentStep - 1].content}
            
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Précédent
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="ml-auto">
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="ml-auto">
                  Terminer la configuration
                  <CheckCircle className="ml-2 h-4 w-4" />
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
