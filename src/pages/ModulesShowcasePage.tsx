import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Heart, Palette, BookOpen, Target } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ModulesShowcasePage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'flash-glow',
      name: 'Flash Glow',
      description: 'Le Dôme d\'Étincelles - Apaisement instantané en 2 minutes',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      href: '/app/flash-glow',
      status: 'Nouveau',
      category: 'Instantané'
    },
    {
      id: 'journal',
      name: 'Journal Émotionnel',
      description: 'Le Jardin des Mots - Transformez vos pensées en fleurs lumineuses',
      icon: BookOpen,
      color: 'from-green-500 to-teal-500',
      href: '/app/journal',
      status: 'Nouveau',
      category: 'Réflexion'
    },
    {
      id: 'mood-mixer',
      name: 'Mood Mixer',
      description: 'La Console des Humeurs - Devenez DJ de vos émotions',
      icon: Palette,
      color: 'from-blue-500 to-indigo-500',
      href: '/app/mood-mixer',
      status: 'Nouveau',
      category: 'Créatif'
    },
    {
      id: 'boss-grit',
      name: 'Boss Grit',
      description: 'La Forge Intérieure - Matérialisez votre persévérance',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      href: '/app/boss-grit',
      status: 'Nouveau',
      category: 'Développement'
    },
    {
      id: 'bubble-beat',
      name: 'Bubble Beat',
      description: 'L\'Océan des Bulles - Défouloir ludique rythmé',
      icon: Heart,
      color: 'from-cyan-500 to-blue-500',
      href: '/app/bubble-beat',
      status: 'Nouveau',
      category: 'Instantané'
    },
    {
      id: 'story-synth',
      name: 'Story Synth',
      description: 'La Bibliothèque Vivante - Contes personnalisés immersifs',
      icon: BookOpen,
      color: 'from-amber-500 to-yellow-500',
      href: '/app/story-synth',
      status: 'Nouveau',
      category: 'Créatif'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Modules Optimisés</h1>
              <p className="text-sm text-muted-foreground">Architecture nouvelle génération</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Performance 95%+
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Introduction */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Expériences Immersives Optimisées
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chaque module utilise la nouvelle architecture avec <strong>UniverseEngine</strong>, 
              réduisant les animations de 80+ à ~20 éléments pour une fluidité parfaite.
            </p>
          </motion.div>
        </div>

        {/* Statistiques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">95%+</div>
            <p className="text-sm text-muted-foreground">Performance Score</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">~20</div>
            <p className="text-sm text-muted-foreground">Éléments Animés</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <p className="text-sm text-muted-foreground">Nouveaux Modules</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <p className="text-sm text-muted-foreground">Immersion</p>
          </Card>
        </div>

        {/* Grid des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <Link to={module.href} className="block">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {module.name}
                      </h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {module.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {module.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="w-3 h-3" />
                        <span>Optimisé</span>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture Info */}
        <div className="mt-12">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Architecture Nouvelle Génération
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🎨 UniverseEngine</h4>
                <p className="text-muted-foreground">Chaque module vit dans son propre univers sensoriel avec ambiance unique</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚡ Performance</h4>
                <p className="text-muted-foreground">Animations CSS optimisées, particules réduites, rendu fluide</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🏆 Récompenses</h4>
                <p className="text-muted-foreground">Système unifié de badges, cristaux et objets symboliques</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModulesShowcasePage;