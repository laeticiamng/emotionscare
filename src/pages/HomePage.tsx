
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import CallToAction from '@/components/home/CallToAction';
import WelcomeHero from '@/components/home/WelcomeHero';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const ctaButtons = [
    {
      label: "commencer",
      link: "/choose-mode",
      text: "Commencer",
      variant: "default",
      icon: true
    },
    {
      label: "entreprise",
      link: "/b2b/selection",
      text: "Solutions Entreprise",
      variant: "outline",
      icon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pb-16">
        <WelcomeHero 
          title="Prenez soin de votre bien-être émotionnel"
          subtitle="Découvrez des outils personnalisés pour améliorer votre bien-être quotidien et renforcer votre résilience émotionnelle."
          ctaButtons={ctaButtons}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: 'Journal émotionnel',
              description: 'Suivez et analysez vos émotions quotidiennes pour mieux vous comprendre'
            },
            {
              title: 'Thérapie musicale',
              description: 'Playlists personnalisées pour accompagner vos émotions et favoriser votre bien-être'
            },
            {
              title: 'Coach IA personnalisé',
              description: 'Un accompagnement intelligent pour vous guider dans votre parcours émotionnel'
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8">Choisissez votre parcours</h2>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <CallToAction type="personal" className="flex-1" />
            <CallToAction type="business" className="flex-1" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
