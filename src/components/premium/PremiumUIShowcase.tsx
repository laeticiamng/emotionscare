
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Heart, 
  Star, 
  Trophy, 
  Clock,
  Users,
  TrendingUp,
  Settings
} from 'lucide-react';

import PremiumCard from './PremiumCard';
import FloatingActionButton from './FloatingActionButton';
import AnimatedCounter from './AnimatedCounter';
import GlassmorphismPanel from './GlassmorphismPanel';
import InteractiveTimeline from './InteractiveTimeline';
import ThemeCustomizer from './ThemeCustomizer';

const PremiumUIShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('cards');
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  const timelineEvents = [
    {
      date: '2024-01-15',
      title: 'Inscription EmotionsCare',
      description: 'Début de votre parcours de bien-être émotionnel',
      completed: true
    },
    {
      date: '2024-02-01',
      title: 'Premier scan émotionnel',
      description: 'Analyse de votre état émotionnel de base',
      completed: true
    },
    {
      date: '2024-02-15',
      title: 'Programme personnalisé',
      description: 'Création de votre plan de développement personnel',
      completed: true
    },
    {
      date: '2024-03-01',
      title: 'Coaching IA avancé',
      description: 'Accès aux fonctionnalités premium de coaching',
      completed: false
    }
  ];

  const premiumFeatures = [
    {
      icon: Sparkles,
      title: 'Animations Premium',
      description: 'Micro-interactions fluides et engageantes pour une expérience utilisateur exceptionnelle',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0
    },
    {
      icon: Palette,
      title: 'Thèmes Personnalisables',
      description: 'Système de thèmes avancé avec personnalisation complète des couleurs et styles',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: Zap,
      title: 'Composants Interactifs',
      description: 'Boutons flottants, compteurs animés et éléments interactifs premium',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.2
    },
    {
      icon: Heart,
      title: 'Design Émotionnel',
      description: 'Interface pensée pour le bien-être avec des effets visuels apaisants',
      gradient: 'from-red-500 to-pink-500',
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interface Premium EmotionsCare
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre système d'interface utilisateur premium avec des composants avancés, 
            des animations fluides et une expérience utilisateur exceptionnelle.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              Point 18 - Interface Premium
            </Badge>
            <Badge variant="outline">
              100% Complété
            </Badge>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cards">Cartes Premium</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="counters">Compteurs</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="glass">Glassmorphism</TabsTrigger>
          </TabsList>

          {/* Premium Cards Demo */}
          <TabsContent value="cards" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {premiumFeatures.map((feature, index) => (
                <PremiumCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                  delay={feature.delay}
                  onClick={() => console.log(`Clicked on ${feature.title}`)}
                />
              ))}
            </motion.div>
          </TabsContent>

          {/* Animations Demo */}
          <TabsContent value="animations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle>Hover Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="w-full h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Boutons Flottants</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <FloatingActionButton
                    icon={Heart}
                    onClick={() => console.log('Floating button clicked')}
                    variant="primary"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pulsations</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Counters Demo */}
          <TabsContent value="counters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AnimatedCounter
                value={1248}
                label="Utilisateurs actifs"
                suffix=" utilisateurs"
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
              />
              <AnimatedCounter
                value={89.7}
                label="Satisfaction"
                suffix="%"
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
              />
              <AnimatedCounter
                value={432}
                label="Sessions cette semaine"
                prefix="+"
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
              />
              <AnimatedCounter
                value={25}
                label="Améliorations"
                suffix=" nouvelles fonctionnalités"
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
              />
            </div>
          </TabsContent>

          {/* Timeline Demo */}
          <TabsContent value="timeline" className="space-y-6">
            <InteractiveTimeline events={timelineEvents} />
          </TabsContent>

          {/* Glassmorphism Demo */}
          <TabsContent value="glass" className="space-y-6">
            <div className="relative min-h-[500px] bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-3xl p-8">
              <GlassmorphismPanel />
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 pt-8"
        >
          <Button
            onClick={() => setShowThemeCustomizer(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Settings className="h-4 w-4 mr-2" />
            Personnaliser le thème
          </Button>
          
          <Button variant="outline">
            <Star className="h-4 w-4 mr-2" />
            Évaluer l'expérience
          </Button>
        </motion.div>
      </div>

      {/* Theme Customizer Overlay */}
      <AnimatePresence>
        {showThemeCustomizer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowThemeCustomizer(false)}
            />
            <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumUIShowcase;
