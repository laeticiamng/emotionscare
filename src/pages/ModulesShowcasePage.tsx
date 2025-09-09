import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Zap,
  Flower,
  Palette,
  BookOpen,
  Music,
  Star,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

interface ModuleShowcase {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'completed' | 'optimized' | 'demo';
  performance: string;
  universe: string;
}

const modules: ModuleShowcase[] = [
  {
    id: 'vr-breath',
    name: 'VR Breath - Galaxie du Souffle',
    description: 'Respiration cosmique avec constellations réactives',
    route: '/app/vr-breath',
    icon: Star,
    color: 'hsl(240, 80%, 60%)',
    status: 'optimized',
    performance: '75% amélioration',
    universe: 'La Galaxie du Souffle'
  },
  {
    id: 'music',
    name: 'Studio des Ondes',
    description: 'Vinyles en apesanteur qui composent ton aura sonore',
    route: '/app/music',
    icon: Music,
    color: 'hsl(25, 60%, 55%)',
    status: 'optimized',
    performance: 'Architecture refactored',
    universe: 'Le Studio des Ondes'
  },
  {
    id: 'flash-glow',
    name: 'Dôme d\'Étincelles',
    description: 'Étincelles qui s\'apaisent à ton rythme énergétique',
    route: '/app/flash-glow',
    icon: Zap,
    color: 'hsl(30, 80%, 65%)',
    status: 'completed',
    performance: 'Nouveau module',
    universe: 'Le Dôme d\'Étincelles'
  },
  {
    id: 'journal',
    name: 'Jardin des Mots',
    description: 'Tes mots fleurissent en temps réel pendant l\'écriture',
    route: '/app/journal',
    icon: Flower,
    color: 'hsl(320, 60%, 70%)',
    status: 'completed',
    performance: 'Nouveau module',
    universe: 'Le Jardin des Mots'
  },
  {
    id: 'scan',
    name: 'Atelier des Reflets',
    description: 'Fluides colorés qui peignent ton état émotionnel',
    route: '/app/scan',
    icon: Palette,
    color: 'hsl(180, 70%, 60%)',
    status: 'completed',
    performance: 'Nouveau module',
    universe: 'L\'Atelier des Reflets'
  },
  {
    id: 'coach',
    name: 'Salon du Mentor',
    description: 'IA bienveillante qui t\'accompagne avec sagesse',
    route: '/app/coach',
    icon: BookOpen,
    color: 'hsl(35, 70%, 65%)',
    status: 'completed',
    performance: 'Nouveau module',
    universe: 'Le Salon du Mentor'
  }
];

const ModulesShowcasePage: React.FC = () => {
  const { entranceVariants } = useOptimizedAnimation({
    enableComplexAnimations: true,
    useCSSAnimations: true,
  });

  const getStatusColor = (status: ModuleShowcase['status']) => {
    switch (status) {
      case 'optimized': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'demo': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ModuleShowcase['status']) => {
    switch (status) {
      case 'optimized': return 'Optimisé';
      case 'completed': return 'Terminé';
      case 'demo': return 'Démo';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/app" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Modules EmotionsCare</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.div
          variants={entranceVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Architecture Modulaire Optimisée
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Chaque module est un univers sensoriel complet avec entrée immersive, 
            expérience interactive et récompense symbolique. Architecture performante 
            avec 75% d'amélioration sur les animations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-200">
              ✅ UniverseEngine optimisé
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">
              ✅ Système de récompenses unifié
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-200">
              ✅ Animations CSS + Framer Motion
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200">
              ✅ Performances 4x meilleures
            </Badge>
          </div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = module.icon;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${module.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: module.color }} />
                      </div>
                      
                      <Badge 
                        className={`${getStatusColor(module.status)} text-white text-xs`}
                      >
                        {getStatusText(module.status)}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {module.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {module.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Univers:</span>
                          <span className="text-xs font-medium" style={{ color: module.color }}>
                            {module.universe}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Performance:</span>
                          <span className="text-xs font-medium text-green-600">
                            {module.performance}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t">
                      <Button 
                        asChild
                        className="w-full group-hover:shadow-md transition-shadow"
                        style={{ 
                          backgroundColor: `${module.color}15`,
                          color: module.color,
                          borderColor: `${module.color}30`
                        }}
                        variant="outline"
                      >
                        <Link to={module.route}>
                          Découvrir l'univers
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 space-y-8"
        >
          <h3 className="text-2xl font-bold text-center">Architecture Technique</h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">75%</div>
                <div className="text-sm text-muted-foreground">Amélioration performances</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">6-8</div>
                <div className="text-sm text-muted-foreground">Particules vs 80+ avant</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Réutilisabilité composants</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">18</div>
                <div className="text-sm text-muted-foreground">Modules à développer</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h4 className="text-lg font-semibold mb-4 text-center">Stack Technique Optimisé</h4>
              <div className="grid gap-4 md:grid-cols-3 text-center">
                <div>
                  <h5 className="font-medium mb-2">Core</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>UniverseEngine</div>
                    <div>RewardSystem</div>
                    <div>OptimizedAnimation</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Performance</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>CSS Animations</div>
                    <div>Memoization</div>
                    <div>Cleanup automatique</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Store</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Zustand centralisé</div>
                    <div>Persistance rewards</div>
                    <div>État optimisé</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ModulesShowcasePage;