
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Brain, Music, Headphones, MessageSquare, Info, ArrowRight } from 'lucide-react';
import Shell from '@/Shell';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell hideNav>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 -z-10" />
        <div className="absolute inset-0 opacity-30 dark:opacity-10 -z-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Emotion Care</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/pricing')}
            >
              Tarifs
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/support')}
            >
              Support
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
            >
              Connexion
            </Button>
            <Button onClick={() => navigate('/b2c/register')}>
              Essai Gratuit
            </Button>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          <section className="container mx-auto px-4 py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                Prenez soin de votre{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  bien-être émotionnel
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                Notre plateforme IA analyse vos émotions et vous propose des solutions personnalisées pour améliorer votre équilibre mental au quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/b2c/register')} 
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/b2b/selection')} 
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Solutions entreprise
                </Button>
              </div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold text-center mb-16">Nos fonctionnalités principales</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scan émotionnel</h3>
                <p className="text-muted-foreground mb-4">
                  Notre IA analyse vos émotions et vous aide à mieux comprendre votre état émotionnel.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/b2c/scan')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
                <p className="text-muted-foreground mb-4">
                  Des playlists personnalisées selon votre état émotionnel pour retrouver l'équilibre.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/music')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Audio guidé</h3>
                <p className="text-muted-foreground mb-4">
                  Méditations et exercices de respiration personnalisés pour réduire le stress.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/audio')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coach IA</h3>
                <p className="text-muted-foreground mb-4">
                  Un coach personnel disponible 24/7 pour vous aider dans votre parcours émotionnel.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/coach')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature 5 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Journal émotionnel</h3>
                <p className="text-muted-foreground mb-4">
                  Suivez vos émotions au quotidien et identifiez les tendances pour progresser.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/journal')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature 6 */}
              <motion.div 
                className="bg-card rounded-xl p-6 shadow-sm border"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tableaux de bord</h3>
                <p className="text-muted-foreground mb-4">
                  Visualisez vos progrès et obtenez des insights sur votre bien-être émotionnel.
                </p>
                <Button variant="link" className="p-0" onClick={() => navigate('/dashboard')}>
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary/5 py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Commencez votre parcours de bien-être émotionnel</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  5 jours d'essai gratuit, sans engagement. Découvrez comment notre plateforme peut transformer votre quotidien.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/b2c/register')} 
                    size="lg"
                    className="text-lg px-8"
                  >
                    Particuliers
                  </Button>
                  <Button 
                    onClick={() => navigate('/b2b/selection')} 
                    variant="outline"
                    size="lg"
                    className="text-lg px-8"
                  >
                    Entreprises
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Heart className="h-6 w-6 text-primary mr-2" />
                <span className="font-semibold">Emotion Care</span>
              </div>
              <div className="flex space-x-6">
                <Button variant="link" onClick={() => navigate('/pricing')}>Tarifs</Button>
                <Button variant="link" onClick={() => navigate('/support')}>Support</Button>
                <Button variant="link" onClick={() => navigate('/about')}>À propos</Button>
                <Button variant="link" onClick={() => navigate('/contact')}>Contact</Button>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Emotion Care. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
