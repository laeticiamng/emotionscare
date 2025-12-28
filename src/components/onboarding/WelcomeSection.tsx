// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Play, Clock, Users, Heart, Brain, Music, 
  Shield, Star, CheckCircle2, ArrowRight, Zap, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WelcomeSectionProps {
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onResponse: (key: string, value: any) => void;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Marie L.',
    role: 'Utilisatrice depuis 6 mois',
    quote: 'EmotionsCare m\'a aidée à mieux comprendre mes émotions au quotidien.',
    avatar: 'ML',
    rating: 5
  },
  {
    name: 'Thomas D.',
    role: 'Entrepreneur',
    quote: 'Les exercices de respiration m\'ont permis de gérer mon stress efficacement.',
    avatar: 'TD',
    rating: 5
  },
  {
    name: 'Sophie R.',
    role: 'Étudiante',
    quote: 'Le journal émotionnel est devenu mon rituel quotidien de bien-être.',
    avatar: 'SR',
    rating: 5
  }
];

const platformStats = [
  { icon: Users, value: '50K+', label: 'Utilisateurs actifs' },
  { icon: Heart, value: '2M+', label: 'Émotions analysées' },
  { icon: Clock, value: '15min', label: 'Temps moyen/jour' },
  { icon: Star, value: '4.8', label: 'Note moyenne' }
];

const features = [
  {
    icon: Brain,
    title: 'Intelligence émotionnelle',
    description: 'Reconnaissance faciale et analyse vocale pour comprendre vos émotions.',
    badge: 'IA'
  },
  {
    icon: Music,
    title: 'Thérapie musicale',
    description: 'Playlists personnalisées selon votre humeur et vos préférences.',
    badge: 'Nouveau'
  },
  {
    icon: Shield,
    title: 'Confidentialité garantie',
    description: 'Vos données sont chiffrées et restent entièrement privées.',
    badge: 'RGPD'
  },
  {
    icon: Zap,
    title: 'Résultats rapides',
    description: 'Constatez une amélioration de votre bien-être dès la première semaine.',
    badge: 'Efficace'
  }
];

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onContinue, videoRef, onResponse }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [estimatedTime] = useState(3); // minutes

  useEffect(() => {
    onResponse('visited_welcome', true);
    onResponse('welcome_timestamp', new Date().toISOString());
  }, [onResponse]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const playWelcomeVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
      const overlay = document.querySelector('.video-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
      }
    }
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Bienvenue dans votre espace bien-être
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Découvrez une nouvelle façon d'explorer et de gérer vos émotions, 
            conçue pour vous accompagner dans votre bien-être émotionnel.
          </p>
          
          {/* Estimated time badge */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>~{estimatedTime} min pour configurer</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>100% confidentiel</span>
            </div>
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {platformStats.map((stat, index) => (
            <Card key={index} className="text-center p-4 bg-gradient-to-br from-background to-muted/30">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
        
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="aspect-video bg-muted rounded-xl overflow-hidden relative shadow-lg"
        >
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/images/welcome-poster.jpg"
            controls
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture vidéo.
          </video>
          
          {!videoPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent video-overlay">
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="rounded-full h-20 w-20 flex items-center justify-center mb-4 shadow-lg"
                  onClick={playWelcomeVideo}
                >
                  <Play size={32} />
                </Button>
                <p className="text-white font-medium">Découvrir EmotionsCare en 2 minutes</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Ce que disent nos utilisateurs
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-4">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{testimonials[currentTestimonial].name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Onboarding Progress Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-muted/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Étapes de configuration</span>
            <span className="text-sm text-muted-foreground">1/5</span>
          </div>
          <Progress value={20} className="h-2 mb-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              Accueil
            </div>
            <span>Profil émotionnel</span>
            <span>Fonctionnalités</span>
            <span>Personnalisation</span>
            <span>Finalisation</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <Button onClick={onContinue} size="lg" className="min-w-64 h-14 text-lg">
            Commencer l'expérience
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            En continuant, vous acceptez notre{' '}
            <Link to="/legal/privacy" className="underline hover:text-primary">
              politique de confidentialité
            </Link>
          </p>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default WelcomeSection;
