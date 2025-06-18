
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Heart, 
  Star, 
  Award,
  Smartphone,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import FloatingActionButton from './FloatingActionButton';
import PremiumCard from './PremiumCard';
import AnimatedCounter from './AnimatedCounter';
import GlassmorphismPanel from './GlassmorphismPanel';
import InteractiveTimeline from './InteractiveTimeline';

const PremiumUIShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('components');
  const [isFloating, setIsFloating] = useState(true);

  const premiumFeatures = [
    {
      icon: Palette,
      title: 'Design System Premium',
      description: 'Composants UI avancés avec animations fluides',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Micro-interactions',
      description: 'Animations subtiles qui enchantent',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Smartphone,
      title: 'Expérience Mobile',
      description: 'PWA avec notifications push',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Social Premium',
      description: 'Communauté et partage avancés',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const timelineEvents = [
    { date: '2024', title: 'Lancement EmotionsCare', description: 'Première version de la plateforme' },
    { date: '2024 Q3', title: 'IA Coach Intégré', description: 'Intelligence artificielle conversationnelle' },
    { date: '2024 Q4', title: 'Version Premium', description: 'Interface utilisateur avancée' },
    { date: '2025', title: 'Expansion Globale', description: 'Disponible dans 15 langues' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Premium */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Interface Premium Activée</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Point 18
            </Badge>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Expérience UI Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez une interface utilisateur révolutionnaire avec des animations fluides, 
            des composants premium et une expérience utilisateur exceptionnelle.
          </p>
        </div>

        {/* Navigation Premium */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 h-14 bg-white/50 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="components" className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Palette className="h-4 w-4" />
              Composants
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Zap className="h-4 w-4" />
              Animations
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="components" className="mt-8">
              <motion.div
                key="components"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {premiumFeatures.map((feature, index) => (
                  <PremiumCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    gradient={feature.color}
                    delay={index * 0.1}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="animations" className="mt-8">
              <motion.div
                key="animations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <GlassmorphismPanel />
                
                <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Compteurs Animés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <AnimatedCounter label="Utilisateurs" value={12543} />
                      <AnimatedCounter label="Sessions" value={8921} />
                      <AnimatedCounter label="Analyses" value={34567} />
                      <AnimatedCounter label="Satisfaction" value={98} suffix="%" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-8">
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      Expérience Mobile Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span>PWA (Progressive Web App)</span>
                      <Badge className="bg-green-500">Activée</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span>Notifications Push</span>
                      <Badge className="bg-green-500">Configurées</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <span>Mode Hors-ligne</span>
                      <Badge className="bg-purple-500">Disponible</Badge>
                    </div>
                  </CardContent>
                </Card>

                <InteractiveTimeline events={timelineEvents} />
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      Métriques Temps Réel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Utilisateurs actifs</span>
                        <AnimatedCounter value={1247} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sessions aujourd'hui</span>
                        <AnimatedCounter value={892} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Score moyen bien-être</span>
                        <AnimatedCounter value={87} suffix="/100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Achievements Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span>Interface Premium Activée</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="h-5 w-5 text-blue-500" />
                        <span>Expérience Utilisateur Excellence</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Heart className="h-5 w-5 text-green-500" />
                        <span>Design System Complet</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Floating Action Button Premium */}
        <AnimatePresence>
          {isFloating && (
            <FloatingActionButton
              icon={Settings}
              onClick={() => setIsFloating(false)}
              className="fixed bottom-6 right-6"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PremiumUIShowcase;
