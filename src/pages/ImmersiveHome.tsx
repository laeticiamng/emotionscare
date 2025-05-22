
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Building, Music, Calendar, BookOpen } from 'lucide-react';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block p-3 mb-6 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Prenez soin de votre <span className="text-primary">bien-être émotionnel</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Découvrez des outils personnalisés pour améliorer votre bien-être quotidien
              et renforcer votre résilience émotionnelle, quel que soit votre environnement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/b2c/login')}
                size="lg"
                className="px-8 py-6 text-lg"
              >
                Commencer maintenant
              </Button>
              
              <Button 
                onClick={() => navigate('/pricing')}
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
              >
                Découvrir nos offres
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Background floating elements */}
        <div className="absolute hidden md:block top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute hidden md:block bottom-10 -right-20 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Des fonctionnalités conçues pour votre équilibre
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-primary" />,
                title: "Journal Émotionnel",
                description: "Suivez et analysez vos émotions au quotidien pour mieux vous comprendre"
              },
              {
                icon: <Music className="h-8 w-8 text-primary" />,
                title: "Thérapie par la musique",
                description: "Des playlists personnalisées selon vos états émotionnels"
              },
              {
                icon: <Building className="h-8 w-8 text-primary" />,
                title: "Solutions entreprise",
                description: "Des outils adaptés pour favoriser le bien-être au travail"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg shadow-sm"
              >
                <div className="mb-4 p-3 inline-block rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Button 
              onClick={() => navigate('/pricing')}
              variant="default"
              size="lg"
              className="px-8"
            >
              Voir toutes nos fonctionnalités
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre bien-être ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Essayez gratuitement pendant 5 jours et découvrez comment EmotionsCare 
              peut vous aider à mieux gérer vos émotions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/b2c/register')}
                size="lg"
              >
                Essayer gratuitement
              </Button>
              
              <Button 
                onClick={() => navigate('/b2b/selection')}
                variant="outline"
                size="lg"
              >
                Solutions entreprise
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ImmersiveHome;
