
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { useOnboarding } from '@/contexts/OnboardingContext';
import PageTransition from '@/components/transitions/PageTransition';
import { generateEventMusic } from '@/services/music/premiumFeatures';
import { ArrowRight, ArrowLeft, User, Briefcase, CheckCircle, Award } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, updateUser, isLoading } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const { steps, updateResponse } = useOnboarding();
  const { progress, updateProgress, completeOnboarding, initOnboarding, logStep } = useOnboardingProgress();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const totalSteps = 3;
  
  // Initialize onboarding progress tracking
  useEffect(() => {
    initOnboarding(totalSteps);
  }, [initOnboarding]);

  // Set user info from auth context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);
  
  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = 'Bonjour';
    } else if (hour < 18) {
      newGreeting = 'Bon après-midi';
    } else {
      newGreeting = 'Bonsoir';
    }
    
    setGreeting(newGreeting);
  }, []);
  
  // Handle mode selection from URL parameters
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'business') {
      setUserMode('b2b-collaborator');
    } else if (mode === 'personal') {
      setUserMode('b2c');
    }
  }, [searchParams, setUserMode]);

  // Play ambient music during onboarding
  useEffect(() => {
    const playOnboardingMusic = async () => {
      try {
        setLoadingMusic(true);
        const track = await generateEventMusic('onboarding', `step-${step}`);
        if (track && track.url) {
          if (!audioRef.current) {
            audioRef.current = new Audio(track.url);
            audioRef.current.volume = 0.2;
            audioRef.current.loop = true;
          } else {
            audioRef.current.src = track.url;
          }
          audioRef.current.play();
        }
      } catch (error) {
        console.error('Failed to load onboarding music:', error);
      } finally {
        setLoadingMusic(false);
      }
    };
    
    // Only attempt to play music if user has interacted with the page
    if (step > 1) {
      playOnboardingMusic();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [step]);

  // Log step view
  useEffect(() => {
    logStep(`step-${step}`, 'view');
  }, [step, logStep]);

  const handleFinishOnboarding = async () => {
    if (!user) return;

    try {
      // Show confetti animation
      setShowConfetti(true);
      
      // Complete onboarding and log progress
      const result = completeOnboarding();
      
      // Update user in database
      await updateUser({
        ...user,
        onboarded: true,
        preferences: {
          ...user.preferences,
          onboardingCompleted: true
        }
      });
      
      // Show success message
      toast({
        title: "Onboarding terminé !",
        description: "Bienvenue sur EmotionsCare. Votre profil est prêt.",
        variant: "success"
      });
      
      // Stop music
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "destructive"
      });
    }
  };
  
  const handleNextStep = () => {
    const currentStepNum = step;
    if (currentStepNum < totalSteps) {
      // Log step completion
      logStep(`step-${currentStepNum}`, 'complete');
      
      // Update progress
      updateProgress({
        currentStep: currentStepNum + 1,
      });
      
      // Move to next step
      setStep(currentStepNum + 1);
      
      // Show encouraging toast at key moments
      if (currentStepNum === 1) {
        toast({
          title: "Bonne progression !",
          description: "Vous avez franchi la première étape !",
          variant: "success"
        });
      }
    } else {
      handleFinishOnboarding();
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      // Log going back
      logStep(`step-${step}`, 'back');
      
      // Update progress
      updateProgress({
        currentStep: step - 1,
      });
      
      // Move to previous step
      setStep(step - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition mode="scale">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {showConfetti && (
            <canvas 
              ref={confettiRef} 
              className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none"
            />
          )}
        </div>
        
        {/* Step 1: Welcome and Name Input */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center pb-4">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{ repeat: Infinity, repeatDelay: 2, duration: 2 }}
                      >
                        <Award className="w-10 h-10 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl">
                    {greeting}, bienvenue sur EmotionsCare
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Commençons par apprendre à vous connaître
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="relative">
                    <label htmlFor="name" className="text-sm font-medium mb-1 block">
                      Comment souhaitez-vous être appelé ?
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <p className="text-sm text-muted-foreground">
                      Nous créons une expérience personnalisée pour vous
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Progress value={33} className="h-1" />
                    <p className="text-xs text-right text-muted-foreground mt-1">Étape 1 sur 3</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" disabled className="opacity-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    disabled={!name.trim()}
                    className="group"
                  >
                    Suivant <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Step 2: Mode Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">
                    Choisissez votre expérience
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Comment souhaitez-vous utiliser EmotionsCare ?
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      onClick={() => {
                        setUserMode('b2c');
                        updateResponse('userMode', 'b2c');
                      }}
                      variant={userMode === 'b2c' ? "default" : "outline"}
                      className={`h-auto flex items-center gap-4 p-4 justify-start ${
                        userMode === 'b2c' ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        userMode === 'b2c' ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <User className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Utilisation personnelle</h3>
                        <p className="text-sm text-muted-foreground">
                          Pour votre bien-être émotionnel individuel
                        </p>
                      </div>
                      {userMode === 'b2c' && (
                        <CheckCircle className="ml-auto h-5 w-5 text-primary" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setUserMode('b2b-collaborator');
                        updateResponse('userMode', 'b2b-collaborator');
                      }}
                      variant={userMode === 'b2b-collaborator' ? "default" : "outline"}
                      className={`h-auto flex items-center gap-4 p-4 justify-start ${
                        userMode === 'b2b-collaborator' ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        userMode === 'b2b-collaborator' ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Utilisation professionnelle</h3>
                        <p className="text-sm text-muted-foreground">
                          Au sein d'une organisation (entreprise, école...)
                        </p>
                      </div>
                      {userMode === 'b2b-collaborator' && (
                        <CheckCircle className="ml-auto h-5 w-5 text-primary" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <Progress value={66} className="h-1" />
                    <p className="text-xs text-right text-muted-foreground mt-1">Étape 2 sur 3</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    disabled={!userMode}
                    className="group"
                  >
                    Suivant <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Step 3: Final Step */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0, -10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl">
                    Votre profil est prêt !
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {userMode === 'b2c' 
                      ? `Nous avons personnalisé votre expérience, ${name}`
                      : `Votre espace professionnel est configuré, ${name}`
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Ce qui vous attend :</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">
                          Un tableau de bord personnalisé selon vos besoins
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">
                          Des outils d'analyse émotionnelle adaptés
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">
                          Une assistance personnalisée pour vous accompagner
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <Progress value={100} className="h-1" />
                    <p className="text-xs text-right text-muted-foreground mt-1">Étape 3 sur 3</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                  </Button>
                  <Button 
                    onClick={handleFinishOnboarding}
                    className="group bg-green-600 hover:bg-green-700"
                  >
                    Commencer l'expérience <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default OnboardingPage;
