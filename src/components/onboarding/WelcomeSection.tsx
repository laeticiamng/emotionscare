// @ts-nocheck

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeSectionProps {
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onResponse: (key: string, value: any) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onContinue, videoRef, onResponse }) => {
  useEffect(() => {
    onResponse('visited_welcome', true);
  }, [onResponse]);
  
  const playWelcomeVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Bienvenue sur EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
          Découvrez une nouvelle façon d'explorer et de gérer vos émotions, conçue pour vous accompagner dans votre bien-être émotionnel.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="aspect-video bg-muted rounded-xl overflow-hidden relative"
      >
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/images/welcome-poster.jpg"
          controls
        >
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 video-overlay">
          <Button 
            size="lg" 
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={playWelcomeVideo}
          >
            <Play size={24} />
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Personnalisation avancée</h3>
            <p className="text-muted-foreground">
              Une expérience entièrement adaptée à votre profil émotionnel unique.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Intelligence émotionnelle</h3>
            <p className="text-muted-foreground">
              Des outils avancés pour vous aider à reconnaître et gérer vos émotions efficacement.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <Button onClick={onContinue} size="lg">
          Commencer l'expérience
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeSection;
