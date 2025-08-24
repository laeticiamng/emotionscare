import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OFFICIAL_ROUTES } from '@/routesManifest';
import {
  Search,
  Zap,
  Star,
  Compass,
  Camera,
  Music,
  Glasses,
  Users,
  Heart,
  Brain,
  Building2,
  Shield,
  Sparkles
} from 'lucide-react';

interface QuickRoute {
  title: string;
  route: string;
  icon: React.ComponentType<any>;
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  keywords: string[];
}

const QuickAccessPanel: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const quickRoutes: QuickRoute[] = [
    // Routes prioritaires
    {
      title: 'Scanner Émotionnel',
      route: OFFICIAL_ROUTES.SCAN,
      icon: Camera,
      category: 'Mesure',
      priority: 'high',
      description: 'Analyse IA de vos émotions en temps réel',
      keywords: ['scan', 'emotion', 'analyse', 'ia', 'camera']
    },
    {
      title: 'Musicothérapie',
      route: OFFICIAL_ROUTES.MUSIC,
      icon: Music,
      category: 'Thérapie',
      priority: 'high',
      description: 'Musique personnalisée selon votre humeur',
      keywords: ['musique', 'therapie', 'humeur', 'relaxation']
    },
    {
      title: 'Dashboard B2C',
      route: OFFICIAL_ROUTES.B2C_DASHBOARD,
      icon: Heart,
      category: 'Personnel',
      priority: 'high',
      description: 'Votre espace de bien-être personnel',
      keywords: ['dashboard', 'personnel', 'accueil', 'b2c']
    },
    {
      title: 'VR Expérience',
      route: OFFICIAL_ROUTES.VR,
      icon: Glasses,
      category: 'Immersif',
      priority: 'high',
      description: 'Immersion en réalité virtuelle',
      keywords: ['vr', 'realite', 'virtuelle', 'immersion']
    },
    
    // Routes secondaires
    {
      title: 'Instant Glow',
      route: OFFICIAL_ROUTES.INSTANT_GLOW,
      icon: Sparkles,
      category: 'Rapide',
      priority: 'medium',
      description: 'Boost de bien-être en 20 secondes',
      keywords: ['instant', 'glow', 'rapide', 'boost']
    },
    {
      title: 'Cocon Social',
      route: OFFICIAL_ROUTES.SOCIAL_COCON,
      icon: Users,
      category: 'Social',
      priority: 'medium',
      description: 'Communauté bienveillante',
      keywords: ['social', 'communaute', 'cocon', 'partage']
    },
    {
      title: 'Gamification',
      route: OFFICIAL_ROUTES.GAMIFICATION,
      icon: Star,
      category: 'Motivation',
      priority: 'medium',
      description: 'Système de points et défis',
      keywords: ['gamification', 'points', 'defis', 'motivation']
    },
    {
      title: 'Dashboard Admin',
      route: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
      icon: Shield,
      category: 'B2B',
      priority: 'medium',
      description: 'Interface d\'administration RH',
      keywords: ['admin', 'rh', 'gestion', 'equipe', 'b2b']
    },
    {
      title: 'Story Synth Lab',
      route: OFFICIAL_ROUTES.STORY_SYNTH_LAB,
      icon: Brain,
      category: 'Créatif',
      priority: 'low',
      description: 'Histoires génératives personnalisées',
      keywords: ['story', 'histoire', 'creativite', 'generation']
    },
    {
      title: 'Breathwork',
      route: OFFICIAL_ROUTES.BREATHWORK,
      icon: Heart,
      category: 'Relaxation',
      priority: 'medium',
      description: 'Exercices de respiration guidée',
      keywords: ['respiration', 'meditation', 'relaxation', 'calme']
    }
  ];

  const filteredRoutes = quickRoutes.filter(route => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      route.title.toLowerCase().includes(term) ||
      route.description.toLowerCase().includes(term) ||
      route.category.toLowerCase().includes(term) ||
      route.keywords.some(keyword => keyword.includes(term))
    );
  });

  const priorityRoutes = filteredRoutes.filter(route => route.priority === 'high');
  const otherRoutes = filteredRoutes.filter(route => route.priority !== 'high');

  const handleRouteSelect = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité';
      case 'medium': return 'Standard';
      case 'low': return 'Avancé';
      default: return 'Normal';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          size="lg"
          aria-label="Accès rapide aux fonctionnalités principales"
        >
          <Compass className="mr-2 h-5 w-5" />
          Accès rapide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Accès rapide aux fonctionnalités
          </DialogTitle>
          <DialogDescription>
            Naviguez rapidement vers les principales fonctionnalités d'EmotionsCare
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fonctionnalité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Priority Routes */}
          {priorityRoutes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Fonctionnalités principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priorityRoutes.map((route) => (
                  <Card 
                    key={route.route}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => handleRouteSelect(route.route)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <route.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{route.title}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPriorityColor(route.priority)}`}
                            >
                              {getPriorityLabel(route.priority)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {route.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {route.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Other Routes */}
          {otherRoutes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                Autres fonctionnalités
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherRoutes.map((route) => (
                  <Card 
                    key={route.route}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => handleRouteSelect(route.route)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <route.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-xs truncate">{route.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {route.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {route.category}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPriorityColor(route.priority)}`}
                            >
                              {getPriorityLabel(route.priority)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {filteredRoutes.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucune fonctionnalité trouvée pour "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAccessPanel;
