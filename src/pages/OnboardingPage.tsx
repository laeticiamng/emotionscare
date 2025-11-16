/**
 * ONBOARDING PAGE - EMOTIONSCARE
 * Page d'onboarding accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Users, Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUserProfile, loading } = useOnboarding();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    goals: [] as string[],
    experience: '',
    preferences: [] as string[],
    notifications: true
  });

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = `Onboarding - Étape ${currentStep + 1} sur ${steps.length} | EmotionsCare`;
  }, [currentStep]);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue sur EmotionsCare',
      description: 'Votre voyage vers le bien-être émotionnel commence ici',
      icon: Heart
    },
    {
      id: 'goals',
      title: 'Vos Objectifs',
      description: 'Que souhaitez-vous améliorer ?',
      icon: Brain
    },
    {
      id: 'experience',
      title: 'Votre Expérience',
      description: 'Parlez-nous de votre parcours',
      icon: Sparkles
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Personnalisez votre expérience',
      icon: Users
    }
  ];

  const goals = [
    { id: 'stress', label: 'Gérer le stress', icon: '🧘', description: 'Techniques de relaxation et méditation' },
    { id: 'anxiety', label: 'Réduire l\'anxiété', icon: '💙', description: 'Outils pour calmer l\'esprit' },
    { id: 'confidence', label: 'Confiance en soi', icon: '💪', description: 'Renforcer l\'estime personnelle' },
    { id: 'relationships', label: 'Relations sociales', icon: '👥', description: 'Améliorer les interactions' },
    { id: 'sleep', label: 'Qualité du sommeil', icon: '😴', description: 'Mieux dormir et récupérer' },
    { id: 'energy', label: 'Niveau d\'énergie', icon: '⚡', description: 'Augmenter la vitalité' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Débutant', description: 'Nouveau dans le bien-être mental' },
    { id: 'intermediate', label: 'Intermédiaire', description: 'Quelques expériences passées' },
    { id: 'advanced', label: 'Avancé', description: 'Pratique régulière établie' }
  ];

  const preferences = [
    { id: 'morning', label: 'Sessions matinales', icon: '🌅' },
    { id: 'evening', label: 'Sessions en soirée', icon: '🌙' },
    { id: 'short', label: 'Sessions courtes (5-10min)', icon: '⏱️' },
    { id: 'long', label: 'Sessions longues (20-30min)', icon: '⏰' },
    { id: 'guided', label: 'Guidance vocale', icon: '🎧' },
    { id: 'music', label: 'Avec musique', icon: '🎵' },
    { id: 'vr', label: 'Expériences VR', icon: '🥽' },
    { id: 'community', label: 'Activités communautaires', icon: '👥' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handlePreferenceToggle = (prefId: string) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(id => id !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Terminer l'onboarding en sauvegardant le profil
      try {
        await createUserProfile({
          goals: userProfile.goals,
          experience: userProfile.experience,
          preferences: userProfile.preferences,
        });

        toast({
          title: "Bienvenue sur EmotionsCare !",
          description: "Votre profil a été créé avec succès",
        });

        navigate('/app/home');
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder votre profil. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'goals':
        return userProfile.goals.length > 0;
      case 'experience':
        return userProfile.experience !== '';
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div 
        className="min-h-screen bg-gradient-to-br from-info/10 to-accent/20 flex items-center justify-center p-6" 
        data-testid="page-root"
      >
        <main id="main-content" role="main" className="w-full max-w-2xl">
          {/* En-tête avec progression */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-accent" aria-hidden="true" />
              <h1 className="text-3xl font-bold text-foreground">EmotionsCare</h1>
            </div>
            <div 
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression de l'onboarding: ${Math.round(progress)}%`}
            >
              <Progress value={progress} className="w-full mb-4" />
            </div>
            <p className="text-muted-foreground">
              Étape {currentStep + 1} sur {steps.length}
            </p>
          </header>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div 
                  className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  role="img"
                  aria-label={`Icône étape ${steps[currentStep].title}`}
                >
                  {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-accent", "aria-hidden": "true" })}
                </div>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <p className="text-muted-foreground">{steps[currentStep].description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
              
              {/* Étape Bienvenue */}
              {steps[currentStep].id === 'welcome' && (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      Prenez soin de votre bien-être émotionnel
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      EmotionsCare vous accompagne dans votre développement personnel avec des outils 
                      innovants : scan émotionnel IA, réalité virtuelle thérapeutique, musicothérapie 
                      personnalisée et coach virtuel.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-info/10 rounded-lg">
                      <div className="text-3xl mb-2">🧠</div>
                      <h4 className="font-semibold">IA Avancée</h4>
                      <p className="text-sm text-muted-foreground">Analyse émotionnelle intelligente</p>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-3xl mb-2">🥽</div>
                      <h4 className="font-semibold">VR Immersive</h4>
                      <p className="text-sm text-muted-foreground">Environnements thérapeutiques</p>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-3xl mb-2">👥</div>
                      <h4 className="font-semibold">Communauté</h4>
                      <p className="text-sm text-muted-foreground">Soutien et partage</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape Objectifs */}
              {steps[currentStep].id === 'goals' && (
                <section aria-labelledby="goals-title">
                  <h2 id="goals-title" className="sr-only">Sélection des objectifs de bien-être</h2>
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground mb-6">
                      Sélectionnez les domaines que vous souhaitez améliorer (plusieurs choix possibles)
                    </p>
                    <fieldset>
                      <legend className="sr-only">Objectifs de bien-être disponibles</legend>
                      <div className="grid md:grid-cols-2 gap-4" role="group" aria-labelledby="goals-title">
                        {goals.map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => handleGoalToggle(goal.id)}
                            onKeyDown={(e) => handleKeyDown(e, () => handleGoalToggle(goal.id))}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                              userProfile.goals.includes(goal.id)
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/50'
                            }`}
                            role="checkbox"
                            aria-checked={userProfile.goals.includes(goal.id)}
                            tabIndex={0}
                            aria-describedby={`goal-${goal.id}-desc`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl" role="img" aria-label={`Icône ${goal.label}`}>{goal.icon}</span>
                              <h3 className="font-semibold">{goal.label}</h3>
                              {userProfile.goals.includes(goal.id) && (
                                <Check className="w-5 h-5 text-accent ml-auto" aria-label="Sélectionné" />
                              )}
                            </div>
                            <p id={`goal-${goal.id}-desc`} className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </section>
              )}

              {/* Étape Expérience */}
              {steps[currentStep].id === 'experience' && (
                <section aria-labelledby="experience-title">
                  <h2 id="experience-title" className="sr-only">Sélection du niveau d'expérience</h2>
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground mb-6">
                      Quel est votre niveau d'expérience avec les pratiques de bien-être mental ?
                    </p>
                    <fieldset>
                      <legend className="sr-only">Niveaux d'expérience disponibles</legend>
                      <div className="space-y-3" role="radiogroup" aria-labelledby="experience-title">
                        {experienceLevels.map((level) => (
                          <div
                            key={level.id}
                            onClick={() => setUserProfile(prev => ({ ...prev, experience: level.id }))}
                            onKeyDown={(e) => handleKeyDown(e, () => setUserProfile(prev => ({ ...prev, experience: level.id })))}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                              userProfile.experience === level.id
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/50'
                            }`}
                            role="radio"
                            aria-checked={userProfile.experience === level.id}
                            tabIndex={userProfile.experience === level.id ? 0 : -1}
                            aria-describedby={`level-${level.id}-desc`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{level.label}</h3>
                                <p id={`level-${level.id}-desc`} className="text-sm text-muted-foreground">{level.description}</p>
                              </div>
                              {userProfile.experience === level.id && (
                                <Check className="w-5 h-5 text-accent" aria-label="Sélectionné" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </section>
              )}

              {/* Étape Préférences */}
              {steps[currentStep].id === 'preferences' && (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground mb-6">
                    Choisissez vos préférences pour personnaliser votre expérience
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {preferences.map((pref) => (
                      <div
                        key={pref.id}
                        onClick={() => handlePreferenceToggle(pref.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          userProfile.preferences.includes(pref.id)
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{pref.icon}</span>
                            <span className="font-medium">{pref.label}</span>
                          </div>
                          {userProfile.preferences.includes(pref.id) && (
                            <Check className="w-4 h-4 text-accent" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <nav aria-label="Navigation de l'onboarding" className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  onKeyDown={(e) => handleKeyDown(e, prevStep)}
                  disabled={currentStep === 0}
                  className="focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Étape précédente"
                  tabIndex={0}
                >
                  Précédent
                </Button>
                
                <div className="flex gap-2" role="status" aria-label="Résumé des sélections">
                  {userProfile.goals.length > 0 && (
                    <Badge variant="secondary">
                      {userProfile.goals.length} objectif{userProfile.goals.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {userProfile.preferences.length > 0 && (
                    <Badge variant="secondary">
                      {userProfile.preferences.length} préférence{userProfile.preferences.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={nextStep}
                  onKeyDown={(e) => handleKeyDown(e, nextStep)}
                  disabled={!isStepValid() || loading}
                  className="bg-accent hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label={currentStep === steps.length - 1 ? 'Terminer l\'onboarding' : 'Étape suivante'}
                  tabIndex={0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Indicateurs d'étapes */}
        <nav 
          className="flex justify-center gap-2 mt-8"
          aria-label="Indicateur de progression des étapes"
          role="tablist"
        >
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-accent'
                  : index < currentStep
                  ? 'bg-accent/50'
                  : 'bg-muted'
              }`}
              role="tab"
              aria-selected={index === currentStep}
              aria-label={`Étape ${index + 1}${index === currentStep ? ' (actuelle)' : index < currentStep ? ' (terminée)' : ' (à venir)'}`}
            />
          ))}
        </nav>
      </main>
    </div>
  </>
  );
};

export default OnboardingPage;