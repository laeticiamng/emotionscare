import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play, Pause, Camera, Brain, Heart, Sparkles, Zap,
  ChevronRight, ArrowRight, CheckCircle, Star,
  Volume2, Users, Shield, Headphones,
  LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { usePageSEO } from '@/hooks/usePageSEO';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  preview: React.ReactNode;
}

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DemoPage: React.FC = () => {
  usePageSEO({
    title: 'Démonstration EmotionsCare - Découvrez nos fonctionnalités',
    description: 'Explorez nos fonctionnalités révolutionnaires: scan émotionnel IA, musicothérapie, coach IA empathique. Découvrez comment EmotionsCare transforme votre bien-être émotionnel.',
    keywords: 'démo emotionscare, scan émotionnel, musicothérapie, coach ia, bien-être mental'
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const demoSteps: DemoStep[] = [
    {
      id: 'scan',
      title: 'Scan Émotionnel IA',
      description: 'Analysez instantanément votre état émotionnel grâce à notre technologie de reconnaissance faciale avancée.',
      icon: Camera,
      color: 'from-blue-500 to-cyan-500',
      preview: (
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
          <div className="flex items-center justify-center w-full h-48 bg-white rounded-lg shadow-lg mb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Caméra activée</p>
              <div className="mt-2 text-xs text-gray-500">Détection en cours...</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Joie</span>
              <span className="text-sm font-bold text-green-600">87%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'music',
      title: 'Thérapie Musicale Personnalisée',
      description: 'Générez des playlists thérapeutiques adaptées à votre humeur avec des fréquences binaurales.',
      icon: Headphones,
      color: 'from-purple-500 to-pink-500',
      preview: (
        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Sérénité Océane</h4>
                <p className="text-sm text-gray-600">Fréquence 432Hz • 8 minutes</p>
              </div>
              <Button size="sm" className="rounded-full">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="secondary" className="text-center">528Hz Guérison</Badge>
            <Badge variant="secondary" className="text-center">Bruits Blancs</Badge>
            <Badge variant="secondary" className="text-center">Binaural</Badge>
            <Badge variant="secondary" className="text-center">Nature</Badge>
          </div>
        </div>
      )
    },
    {
      id: 'coach',
      title: 'Coach IA Empathique',
      description: 'Conversez avec notre IA thérapeutique disponible 24/7 pour un soutien personnalisé.',
      icon: Brain,
      color: 'from-emerald-500 to-teal-500',
      preview: (
        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm text-gray-700">
                  Je perçois que vous ressentez un peu de stress. Voulez-vous essayer un exercice de respiration guidée ?
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 ml-8">
              <div className="text-sm text-gray-700">
                Oui, j'aimerais bien essayer
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm text-gray-700">
                  Parfait ! Commençons par la technique 4-7-8...
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Insights & Progrès',
      description: 'Suivez votre évolution émotionnelle avec des analyses détaillées et des recommandations IA.',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      preview: (
        <div className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-xs text-gray-600">Bien-être</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">28</div>
              <div className="text-xs text-gray-600">Jours de série</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression cette semaine</span>
              <span className="text-xs text-green-600">+12%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" style={{width: '76%'}}></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const benefits: Benefit[] = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "100% Sécurisé",
      description: "Vos données restent privées et chiffrées"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "50,000+ Utilisateurs",
      description: "Une communauté active et bienveillante"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "4.8/5 étoiles",
      description: "Note moyenne de satisfaction"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Résultats Rapides",
      description: "Améliorations visibles en 7 jours"
    }
  ];

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
              ✨ Démonstration Interactive
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Découvrez EmotionsCare en Action
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Explorez nos fonctionnalités révolutionnaires et voyez comment l'IA peut transformer votre bien-être émotionnel
            </p>
          </motion.div>
        </div>

        {/* Video Demo Section */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 md:h-96 object-cover"
                  poster="/placeholder-video-thumbnail.jpg"
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos HTML5.
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayDemo}
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-gray-800 ml-1" />
                    ) : (
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    )}
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo Steps */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités Clés</h2>
            <p className="text-lg text-slate-600">Cliquez sur chaque étape pour voir la démo interactive</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Steps Navigation */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                <motion.div
                  key={step.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveStep(index)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeStep === index
                      ? 'bg-white shadow-lg border-2 border-blue-200'
                      : 'bg-white/60 hover:bg-white/80 shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color} text-white flex-shrink-0`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      {activeStep === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 flex items-center text-blue-600 font-medium"
                        >
                          <span className="text-sm">Voir la démonstration</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>

            {/* Active Step Preview */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                {(() => {
                  const ActiveStepIcon = demoSteps[activeStep].icon;
                  return (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${demoSteps[activeStep].color} text-white`}>
                            <ActiveStepIcon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {demoSteps[activeStep].title}
                          </h3>
                        </div>
                        {demoSteps[activeStep].preview}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir EmotionsCare ?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 overflow-hidden">
            <CardContent className="p-12 text-white relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Convaincu ? Commencez Votre Transformation
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-2xl shadow-xl">
                      <Link to={routes.auth.signup()}>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Commencer Gratuitement
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl">
                      <Link to={routes.b2b.home()}>
                        <Users className="w-5 h-5 mr-2" />
                        Solutions Entreprise
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Gratuit pendant 14 jours
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aucune carte requise
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Annulation simple
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;