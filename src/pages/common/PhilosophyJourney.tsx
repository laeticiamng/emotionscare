
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Clock, Zap, ArrowRight, ArrowLeft, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhilosophyJourney: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const journeySteps = [
    {
      id: 'intro',
      title: "Notre vision",
      subtitle: "L'essence d'EmotionsCare",
      content: (
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Redéfinir le bien-être
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            EmotionsCare révolutionne l'approche du bien-être émotionnel en conjuguant 
            l'introspection personnelle et la force du collectif.
          </p>
          <blockquote className="text-2xl italic font-light text-slate-700 dark:text-slate-300 border-l-4 border-primary pl-6">
            "Offrir à chacun une parenthèse, à chaque équipe une énergie partagée"
          </blockquote>
        </div>
      )
    },
    {
      id: 'personal',
      title: "La parenthèse personnelle",
      subtitle: "Votre moment sacré",
      icon: Heart,
      color: "text-pink-500",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="mx-auto p-6 rounded-full bg-pink-50 dark:bg-pink-950 w-24 h-24 flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
            <h3 className="text-3xl font-bold text-pink-600 mb-4">La parenthèse personnelle</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Dans notre monde hyperconnecté, chaque individu mérite un moment de pause, 
              un espace sacré pour se reconnecter à soi-même.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50/50 dark:bg-pink-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Ce que nous offrons</h4>
              <ul className="space-y-2 text-sm">
                <li>• Scanner émotionnel IA pour l'auto-diagnostic</li>
                <li>• Coaching personnalisé adapté à votre état</li>
                <li>• Musicothérapie sur mesure</li>
                <li>• Journal émotionnel privé et sécurisé</li>
              </ul>
            </div>
            <div className="bg-pink-50/50 dark:bg-pink-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Pourquoi c'est essentiel</h4>
              <ul className="space-y-2 text-sm">
                <li>• Réduction du stress et de l'anxiété</li>
                <li>• Amélioration de la conscience de soi</li>
                <li>• Développement de la résilience émotionnelle</li>
                <li>• Équilibre vie personnelle/professionnelle</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'collective',
      title: "L'énergie partagée",
      subtitle: "La force du collectif",
      icon: Users,
      color: "text-purple-500",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="mx-auto p-6 rounded-full bg-purple-50 dark:bg-purple-950 w-24 h-24 flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-purple-600 mb-4">L'énergie partagée</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Dans le collectif naît une force nouvelle, une synergie qui élève 
              chacun vers le meilleur de lui-même.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50/50 dark:bg-purple-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">En entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li>• Cocon social sécurisé pour l'entraide</li>
                <li>• Défis d'équipe motivants et ludiques</li>
                <li>• Partage d'expériences bienveillant</li>
                <li>• Création de liens authentiques</li>
              </ul>
            </div>
            <div className="bg-purple-50/50 dark:bg-purple-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Bénéfices collectifs</h4>
              <ul className="space-y-2 text-sm">
                <li>• Cohésion d'équipe renforcée</li>
                <li>• Climat de travail apaisé</li>
                <li>• Productivité et créativité accrues</li>
                <li>• Réduction de l'absentéisme</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'time',
      title: "Le temps comme luxe",
      subtitle: "Redéfinir notre rapport au temps",
      icon: Clock,
      color: "text-blue-500",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="mx-auto p-6 rounded-full bg-blue-50 dark:bg-blue-950 w-24 h-24 flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-blue-600 mb-4">Le temps comme luxe</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Redéfinir le temps non comme une contrainte mais comme un cadeau précieux à s'offrir.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Notre approche</h4>
              <ul className="space-y-2 text-sm">
                <li>• Sessions courtes mais efficaces (5-15 minutes)</li>
                <li>• Intégration fluide dans votre routine</li>
                <li>• Flexibilité totale d'utilisation</li>
                <li>• Rappels bienveillants personnalisés</li>
              </ul>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Impact sur votre quotidien</h4>
              <ul className="space-y-2 text-sm">
                <li>• Meilleure gestion des priorités</li>
                <li>• Réduction de la procrastination</li>
                <li>• Moments de pause régénératrice</li>
                <li>• Équilibre retrouvé</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'essence',
      title: "L'essentiel révélé",
      subtitle: "Quand tout devient clair",
      icon: Zap,
      color: "text-amber-500",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="mx-auto p-6 rounded-full bg-amber-50 dark:bg-amber-950 w-24 h-24 flex items-center justify-center mb-4">
              <Zap className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-3xl font-bold text-amber-600 mb-4">L'essentiel révélé</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Dans le partage d'énergie positive, l'essentiel émerge naturellement, authentiquement.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-8 rounded-2xl">
              <h4 className="text-2xl font-semibold mb-4">La révélation EmotionsCare</h4>
              <p className="text-lg mb-6">
                Quand l'individuel rencontre le collectif, quand le temps redevient un allié, 
                l'essentiel se révèle : votre bien-être authentique et durable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/b2c/login')}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Commencer mon parcours
                </Button>
                <Button 
                  onClick={() => navigate('/b2b/selection')}
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                  Solutions entreprise
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= journeySteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, journeySteps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={toggleAutoPlay}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Lecture auto'}
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {journeySteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= index
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {step.icon ? (
                    <step.icon className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </button>
                {index < journeySteps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all ${
                      currentStep > index ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Étape {currentStep + 1} sur {journeySteps.length}
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Card className="shadow-2xl border-0">
              <CardContent className="p-12">
                {journeySteps[currentStep].content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="text-center">
            <h3 className="font-semibold text-lg">{journeySteps[currentStep].title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {journeySteps[currentStep].subtitle}
            </p>
          </div>

          <Button
            onClick={nextStep}
            disabled={currentStep === journeySteps.length - 1}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyJourney;
