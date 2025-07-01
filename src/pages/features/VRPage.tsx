
import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Settings, Star } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const VRPage: React.FC = () => {
  const vrExperiences = [
    {
      title: "Plage Tropicale",
      description: "Détendez-vous sur une plage paradisiaque",
      duration: "15 min",
      rating: 4.8,
      image: "🏖️"
    },
    {
      title: "Forêt Enchantée",
      description: "Méditation au cœur d'une forêt mystique",
      duration: "20 min",
      rating: 4.9,
      image: "🌲"
    },
    {
      title: "Espace Cosmique",
      description: "Voyage contemplatif dans l'univers",
      duration: "25 min",
      rating: 4.7,
      image: "🌌"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Expériences VR Immersives
          </h1>
          <p className="text-lg text-muted-foreground">
            Plongez dans des environnements relaxants en réalité virtuelle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {vrExperiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumCard>
                <div className="text-center">
                  <div className="text-6xl mb-4">{experience.image}</div>
                  <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                  <p className="text-muted-foreground mb-4">{experience.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {experience.duration}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{experience.rating}</span>
                    </div>
                  </div>
                  <PremiumButton variant="primary" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Lancer l'expérience
                  </PremiumButton>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PremiumCard>
            <div className="text-center">
              <Headphones className="h-16 w-16 mx-auto mb-6 text-green-500" />
              <h3 className="text-2xl font-bold mb-4">Audio Spatial</h3>
              <p className="text-muted-foreground mb-6">
                Profitez d'une expérience audio immersive avec le son spatial 3D
              </p>
              <PremiumButton variant="secondary" className="w-full">
                <Headphones className="mr-2 h-4 w-4" />
                Configurer l'audio
              </PremiumButton>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-6 text-orange-500" />
              <h3 className="text-2xl font-bold mb-4">Paramètres VR</h3>
              <p className="text-muted-foreground mb-6">
                Ajustez vos préférences pour une expérience optimale
              </p>
              <PremiumButton variant="accent" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Régler les paramètres
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>
      </motion.div>
    </div>
  );
};

export default VRPage;
