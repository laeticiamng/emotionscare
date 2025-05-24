
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Heart, Target, Music, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const objectives = [
  { id: 'stress', label: 'Gérer le stress', icon: '🧘' },
  { id: 'emotions', label: 'Comprendre mes émotions', icon: '💭' },
  { id: 'relationships', label: 'Améliorer mes relations', icon: '👥' },
  { id: 'confidence', label: 'Gagner en confiance', icon: '💪' },
  { id: 'mindfulness', label: 'Pratiquer la pleine conscience', icon: '🌸' },
  { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
];

const musicGenres = [
  { id: 'ambient', label: 'Ambiant', description: 'Sons apaisants et naturels' },
  { id: 'classical', label: 'Classique', description: 'Musique orchestrale relaxante' },
  { id: 'jazz', label: 'Jazz doux', description: 'Mélodies jazz douces' },
  { id: 'nature', label: 'Sons de la nature', description: 'Pluie, océan, forêt' },
  { id: 'meditation', label: 'Méditation', description: 'Musiques de méditation' },
  { id: 'lo-fi', label: 'Lo-fi', description: 'Beats calmes et répétitifs' },
];

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedMusicGenre, setSelectedMusicGenre] = useState<string>('');
  const [musicVolume, setMusicVolume] = useState([70]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleObjectiveToggle = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId) 
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    
    try {
      // Sauvegarder les préférences de l'utilisateur
      const preferences = {
        objectives: selectedObjectives,
        music_genre: selectedMusicGenre,
        music_volume: musicVolume[0],
        onboarding_completed: true,
      };

      // Ici on pourrait appeler une API pour sauvegarder les préférences
      console.log('Preferences saved:', preferences);
      
      toast({
        title: "Profil configuré !",
        description: "Bienvenue dans EmotionsCare. Votre parcours commence maintenant.",
      });
      
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la configuration. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Étape de bienvenue
      case 2:
        return selectedObjectives.length > 0;
      case 3:
        return selectedMusicGenre !== '';
      default:
        return false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Configuration - EmotionsCare</title>
        <meta name="description" content="Configurez votre profil EmotionsCare" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            <CardTitle className="text-2xl">Configuration de votre profil</CardTitle>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Étape {currentStep} sur {totalSteps}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6 text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-semibold">Bienvenue dans EmotionsCare !</h3>
                  <p className="text-lg text-muted-foreground">
                    Nous allons personnaliser votre expérience en quelques étapes simples.
                    Cela ne prendra que 2 minutes.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✨ Essai gratuit de 3 jours activé !
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Explorez toutes les fonctionnalités sans engagement
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Quels sont vos objectifs ?</h3>
                    <p className="text-muted-foreground">
                      Sélectionnez un ou plusieurs domaines que vous souhaitez améliorer
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {objectives.map((objective) => (
                      <motion.div
                        key={objective.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedObjectives.includes(objective.id) ? "default" : "outline"}
                          className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                          onClick={() => handleObjectiveToggle(objective.id)}
                        >
                          <span className="text-2xl">{objective.icon}</span>
                          <span className="text-sm font-medium">{objective.label}</span>
                          {selectedObjectives.includes(objective.id) && (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  
                  {selectedObjectives.length > 0 && (
                    <div className="text-center">
                      <Badge variant="secondary">
                        {selectedObjectives.length} objectif{selectedObjectives.length > 1 ? 's' : ''} sélectionné{selectedObjectives.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <Music className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Préférences musicales</h3>
                    <p className="text-muted-foreground">
                      Choisissez le type de musique qui vous apaise le mieux
                    </p>
                  </div>
                  
                  <RadioGroup 
                    value={selectedMusicGenre} 
                    onValueChange={setSelectedMusicGenre}
                    className="space-y-3"
                  >
                    {musicGenres.map((genre) => (
                      <div key={genre.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={genre.id} id={genre.id} />
                        <Label htmlFor={genre.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{genre.label}</div>
                          <div className="text-sm text-muted-foreground">{genre.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {selectedMusicGenre && (
                    <div className="space-y-3">
                      <Label>Volume par défaut: {musicVolume[0]}%</Label>
                      <Slider
                        value={musicVolume}
                        onValueChange={setMusicVolume}
                        max={100}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <div className="p-6 border-t flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                "Configuration..."
              ) : currentStep === totalSteps ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default B2COnboardingPage;
