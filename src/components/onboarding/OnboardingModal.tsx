import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  quiz?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
}

interface OnboardingModalProps {
  onClose: () => void;
  isOpen?: boolean;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  onClose,
  isOpen = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('tour');
  const { toast } = useToast();
  const { userMode } = useUserMode();

  // Different steps based on user mode
  const getStepsForUserMode = () => {
    const commonSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Bienvenue sur EmotionsCare',
        description: 'Découvrez comment notre application peut vous aider à comprendre et gérer vos émotions.',
        content: (
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Award className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
            </motion.div>
            <p>
              Nous allons vous guider à travers les principales fonctionnalités de l'application.
            </p>
          </div>
        ),
      },
      {
        id: 'dashboard',
        title: 'Votre tableau de bord',
        description: 'Votre hub central pour suivre et comprendre vos émotions au quotidien.',
        content: (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted rounded-lg p-4 w-full max-w-sm">
                <div className="h-3 w-1/2 bg-primary/30 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-primary/20 rounded"></div>
                  <div className="h-12 bg-primary/20 rounded"></div>
                  <div className="h-12 bg-primary/20 rounded"></div>
                  <div className="h-12 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
            <p>
              Le tableau de bord affiche vos statistiques émotionnelles, tendances récentes, et recommandations personnalisées.
            </p>
          </div>
        ),
      },
      {
        id: 'tools',
        title: 'Outils disponibles',
        description: 'Explorez les différents modules pour améliorer votre bien-être émotionnel.',
        content: (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <span className="text-blue-600">📊</span>
                  </div>
                  <h4 className="text-sm font-medium">Analyse</h4>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <span className="text-purple-600">🎵</span>
                  </div>
                  <h4 className="text-sm font-medium">Musique</h4>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <span className="text-green-600">🧘</span>
                  </div>
                  <h4 className="text-sm font-medium">Méditation</h4>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <span className="text-amber-600">👥</span>
                  </div>
                  <h4 className="text-sm font-medium">Social</h4>
                </CardContent>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez sur chaque module pour découvrir des fonctionnalités adaptées à vos besoins.
            </p>
          </div>
        ),
      },
      {
        id: 'quiz',
        title: 'Testez vos connaissances',
        description: 'Un petit quiz pour vérifier votre compréhension.',
        content: (
          <div className="space-y-4">
            <p className="font-medium">Quelle fonctionnalité permet de visualiser l'évolution de vos émotions dans le temps ?</p>
            <div className="space-y-2">
              {[
                { id: 'a', text: 'Social Cocon', isCorrect: false },
                { id: 'b', text: 'Timeline Émotionnelle', isCorrect: true },
                { id: 'c', text: 'Paramètres de compte', isCorrect: false },
                { id: 'd', text: 'Playlist musicale', isCorrect: false },
              ].map(option => (
                <Button
                  key={option.id}
                  variant={selectedAnswer === option.id ? "default" : "outline"}
                  className={`w-full justify-start ${
                    isAnswerCorrect !== null && 
                    selectedAnswer === option.id && 
                    option.isCorrect ? "bg-green-500 text-white" : ""
                  } ${
                    isAnswerCorrect !== null && 
                    selectedAnswer === option.id && 
                    !option.isCorrect ? "bg-red-500 text-white" : ""
                  }`}
                  onClick={() => {
                    if (isAnswerCorrect === null) {
                      setSelectedAnswer(option.id);
                      setIsAnswerCorrect(option.isCorrect);
                      
                      if (option.isCorrect) {
                        toast({
                          title: "Bonne réponse !",
                          description: "Vous maîtrisez bien les fonctionnalités.",
                          variant: "success"
                        });
                      }
                    }
                  }}
                >
                  <span className="mr-2">{option.id.toUpperCase()}.</span> {option.text}
                  {isAnswerCorrect !== null && option.isCorrect && (
                    <CheckCircle className="ml-auto h-4 w-4 text-white" />
                  )}
                </Button>
              ))}
            </div>
            {isAnswerCorrect === false && (
              <p className="text-sm text-muted-foreground">
                La Timeline Émotionnelle vous permet de visualiser l'évolution de vos émotions au fil du temps.
              </p>
            )}
          </div>
        ),
        quiz: {
          question: "Quelle fonctionnalité permet de visualiser l'évolution de vos émotions dans le temps ?",
          options: [
            { id: 'a', text: 'Social Cocon', isCorrect: false },
            { id: 'b', text: 'Timeline Émotionnelle', isCorrect: true },
            { id: 'c', text: 'Paramètres de compte', isCorrect: false },
            { id: 'd', text: 'Playlist musicale', isCorrect: false },
          ]
        }
      },
      {
        id: 'completion',
        title: 'Félicitations !',
        description: 'Vous êtes maintenant prêt à utiliser EmotionsCare.',
        content: (
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div 
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(74, 222, 128, 0.4)",
                    "0 0 0 20px rgba(74, 222, 128, 0)",
                    "0 0 0 0 rgba(74, 222, 128, 0)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
            </motion.div>
            <p>
              Vous avez terminé l'onboarding ! Explorez maintenant l'application pour découvrir toutes les fonctionnalités.
            </p>
            <div className="flex justify-center pt-2">
              <Badge className="bg-green-500">Formation complétée !</Badge>
            </div>
          </div>
        ),
      },
    ];
    
    // Add B2B-specific steps if user is in B2B mode
    if (userMode === 'b2b-admin' || userMode === 'b2b-collaborator') {
      const b2bSteps: OnboardingStep[] = [
        {
          id: 'team-features',
          title: 'Fonctionnalités d\'équipe',
          description: 'Découvrez les outils collaboratifs disponibles pour votre équipe.',
          content: (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-muted rounded-lg p-4 w-full max-w-sm">
                  <div className="h-3 w-3/4 bg-primary/30 rounded mb-4"></div>
                  <div className="flex -space-x-2 mb-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background"></div>
                    ))}
                  </div>
                  <div className="h-20 bg-primary/10 rounded"></div>
                </div>
              </div>
              <p>
                Les fonctionnalités d'équipe vous permettent de collaborer, partager des ressources et suivre le bien-être collectif.
              </p>
            </div>
          ),
        },
      ];
      
      // Insert the B2B step before the quiz
      return [
        ...commonSteps.slice(0, 3),
        ...b2bSteps,
        ...commonSteps.slice(3)
      ];
    }
    
    return commonSteps;
  };
  
  const steps = getStepsForUserMode();
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      // Add current step to completed steps
      setCompletedSteps(prev => {
        const updated = new Set(prev);
        updated.add(currentStep);
        return updated;
      });
      
      // Reset quiz state when moving to next step
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      
      // Move to next step with a brief delay for animation
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
      
      // Show toast for milestone steps
      if (currentStep === 1) {
        toast({
          title: "Progression !",
          description: "Vous avancez bien dans la formation.",
          variant: "default"
        });
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      // Reset quiz state when moving to previous step
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    // Add last step to completed steps
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      updated.add(steps.length - 1);
      return updated;
    });
    
    toast({
      title: "Formation terminée !",
      description: "Vous pouvez maintenant profiter pleinement d'EmotionsCare.",
      variant: "success"
    });
    
    // Store completion in localStorage
    localStorage.setItem('onboarding-completed', 'true');
    
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>{steps[currentStep].description}</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tour">Visite guidée</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tour" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[200px]"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
            
            <Progress 
              value={((currentStep + 1) / steps.length) * 100} 
              className="h-2 mt-4"
            />
            
            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      completedSteps.has(i)
                        ? 'bg-primary'
                        : i === currentStep
                        ? 'bg-primary/50'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-4 min-h-[200px]">
              <p className="text-muted-foreground">
                Ressources complémentaires pour vous aider à maîtriser l'application.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-1">Guide de démarrage</h4>
                    <p className="text-xs text-muted-foreground">Documentation complète des fonctionnalités</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-1">Tutoriels vidéo</h4>
                    <p className="text-xs text-muted-foreground">5 vidéos pour maîtriser l'application</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-1">FAQ</h4>
                    <p className="text-xs text-muted-foreground">Réponses aux questions fréquentes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-1">Contacter le support</h4>
                    <p className="text-xs text-muted-foreground">Assistance personnalisée disponible</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Précédent
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1 || (steps[currentStep].quiz && isAnswerCorrect === null)}
              className="gap-1"
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="gap-1"
            >
              Terminer <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
