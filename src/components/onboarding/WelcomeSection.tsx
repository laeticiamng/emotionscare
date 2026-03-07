// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Play, Clock, Brain, Music, 
  Shield, CheckCircle2, ArrowRight, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  TooltipProvider,
} from "@/components/ui/tooltip";

interface WelcomeSectionProps {
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onResponse: (key: string, value: any) => void;
}

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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [estimatedTime] = useState(3); // minutes

  useEffect(() => {
    onResponse('visited_welcome', true);
    onResponse('welcome_timestamp', new Date().toISOString());
  }, [onResponse]);

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
