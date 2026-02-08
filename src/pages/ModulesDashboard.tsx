// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Music,
  MessageSquare,
  BookOpen,
  Scan,
  Sparkles,
  Gamepad2,
  Users,
  BarChart3,
  Zap,
  Target,
  Wind,
  Palette,
  Trophy,
  Shield,
  Heart,
  Activity,
  TrendingUp,
  Search,
  Filter,
  Star,
  Clock,
  Lock,
} from 'lucide-react';
import { routes } from '@/lib/routes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Module {
  title: string;
  description: string;
  url: string;
  icon: any;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  color: string;
  featured?: boolean;
}

const modules: Module[] = [
  // Core Modules
  {
    title: 'Scan Émotionnel',
    description: 'Analysez vos émotions en temps réel avec l\'IA',
    url: routes.b2c.scan(),
    icon: Scan,
    category: 'Core',
    status: 'active',
    color: 'from-info to-info/70',
    featured: true,
  },
  {
    title: 'Musique Adaptative',
    description: 'Musique générée selon votre état émotionnel',
    url: routes.b2c.music(),
    icon: Music,
    category: 'Core',
    status: 'active',
    color: 'from-accent to-accent/70',
    featured: true,
  },
  {
    title: 'AI Coach',
    description: 'Coaching personnalisé par intelligence artificielle',
    url: routes.b2c.coach(),
    icon: MessageSquare,
    category: 'Core',
    status: 'active',
    color: 'from-success to-success/70',
    featured: true,
  },
  {
    title: 'Journal Émotionnel',
    description: 'Suivez votre évolution émotionnelle au quotidien',
    url: routes.b2c.journal(),
    icon: BookOpen,
    category: 'Core',
    status: 'active',
    color: 'from-warning to-destructive',
  },

  // Wellness Modules
  {
    title: 'Respiration Guidée',
    description: 'Exercices de respiration pour la relaxation',
    url: routes.b2c.breath(),
    icon: Wind,
    category: 'Wellness',
    status: 'active',
    color: 'from-info/80 to-info',
  },
  {
    title: 'Méditation',
    description: 'Sessions de méditation guidée',
    url: '/app/meditation',
    icon: Heart,
    category: 'Wellness',
    status: 'active',
    color: 'from-primary/80 to-primary',
  },
  {
    title: 'Flash Glow',
    description: 'Micro-sessions de 2 minutes pour un boost immédiat',
    url: routes.b2c.flashGlow(),
    icon: Zap,
    category: 'Wellness',
    status: 'active',
    color: 'from-warning to-warning/70',
  },
  {
    title: 'VR Galaxy',
    description: 'Expérience immersive de méditation en VR',
    url: routes.b2c.vrGalaxy(),
    icon: Brain,
    category: 'Wellness',
    status: 'beta',
    color: 'from-primary to-accent',
  },
  {
    title: 'VR Breath',
    description: 'Respiration guidée en immersion VR',
    url: '/app/vr-breath-guide',
    icon: Wind,
    category: 'Wellness',
    status: 'beta',
    color: 'from-info to-primary',
  },
  {
    title: 'Screen Silk',
    description: 'Pauses écran intelligentes anti-fatigue',
    url: '/app/screen-silk',
    icon: Activity,
    category: 'Wellness',
    status: 'active',
    color: 'from-accent/60 to-accent',
  },
  {
    title: 'Nyvee Cocon',
    description: 'Votre espace émotionnel personnel',
    url: '/app/nyvee',
    icon: Heart,
    category: 'Wellness',
    status: 'active',
    color: 'from-primary/60 to-primary',
  },
  {
    title: 'Seuil',
    description: 'Exercices de gestion du seuil émotionnel',
    url: '/app/seuil',
    icon: Target,
    category: 'Wellness',
    status: 'active',
    color: 'from-warning/60 to-warning',
  },

  // Fun-First Games
  {
    title: 'Mood Mixer',
    description: 'Créez votre ambiance émotionnelle parfaite',
    url: routes.b2c.moodMixer(),
    icon: Palette,
    category: 'Games',
    status: 'active',
    color: 'from-accent/80 to-accent',
  },
  {
    title: 'Boss Grit',
    description: 'Développez votre résilience par le jeu',
    url: routes.b2c.bossLevel(),
    icon: Target,
    category: 'Games',
    status: 'active',
    color: 'from-destructive to-warning',
  },
  {
    title: 'Bounce Back Battle',
    description: 'Affrontez vos défis avec gamification',
    url: routes.b2c.bounceBack(),
    icon: Shield,
    category: 'Games',
    status: 'beta',
    color: 'from-success/80 to-success',
  },
  {
    title: 'Bubble Beat',
    description: 'Jeu musical anti-stress',
    url: routes.b2c.bubbleBeat(),
    icon: Gamepad2,
    category: 'Games',
    status: 'active',
    color: 'from-info/70 to-info',
  },
  {
    title: 'Story Synth',
    description: 'Créez et partagez vos histoires émotionnelles',
    url: routes.b2c.storySynth(),
    icon: Sparkles,
    category: 'Games',
    status: 'beta',
    color: 'from-accent to-primary',
  },
  {
    title: 'Ambition Arcade',
    description: 'Gamifiez vos objectifs de vie',
    url: '/app/ambition-arcade',
    icon: Gamepad2,
    category: 'Games',
    status: 'active',
    color: 'from-warning/80 to-warning',
  },
  {
    title: 'Face AR',
    description: 'Filtres AR émotionnels en réalité augmentée',
    url: '/app/face-ar',
    icon: Scan,
    category: 'Games',
    status: 'beta',
    color: 'from-primary/70 to-primary',
  },

  // Social — consolidated
  {
    title: 'Entraide',
    description: 'Espace de soutien et d\'entraide entre pairs',
    url: '/app/entraide',
    icon: Users,
    category: 'Social',
    status: 'active',
    color: 'from-info to-primary',
  },
  {
    title: 'Buddies',
    description: 'Trouvez un binôme de soutien',
    url: '/app/buddies',
    icon: Heart,
    category: 'Social',
    status: 'active',
    color: 'from-destructive/70 to-accent',
  },
  {
    title: 'Exchange Hub',
    description: 'Marchés d\'émotions, temps, confiance et progression',
    url: routes.b2c.exchange(),
    icon: TrendingUp,
    category: 'Exchange',
    status: 'active',
    color: 'from-success to-success/70',
    featured: true,
  },
  {
    title: 'Classements',
    description: 'Classement et défis communautaires',
    url: routes.b2c.leaderboard(),
    icon: Trophy,
    category: 'Social',
    status: 'active',
    color: 'from-warning to-warning/70',
  },
  {
    title: 'Sessions Groupe',
    description: 'Rejoignez des sessions de bien-être collectives',
    url: '/app/group-sessions',
    icon: Users,
    category: 'Social',
    status: 'active',
    color: 'from-primary/70 to-accent',
  },

  // Analytics
  {
    title: 'Bilan Hebdomadaire',
    description: 'Visualisez vos barres de progression',
    url: '/app/weekly-bars',
    icon: BarChart3,
    category: 'Analytics',
    status: 'active',
    color: 'from-info to-info/70',
  },
  {
    title: 'Heatmap Émotionnelle',
    description: 'Cartographie de vos émotions dans le temps',
    url: routes.b2c.heatmap(),
    icon: Activity,
    category: 'Analytics',
    status: 'active',
    color: 'from-success to-success/70',
  },
  {
    title: 'Voice Journal',
    description: 'Journal vocal avec transcription IA',
    url: '/app/voice-journal',
    icon: BookOpen,
    category: 'Core',
    status: 'active',
    color: 'from-warning/70 to-warning',
  },

  // Coming Soon
  {
    title: 'Hume AI',
    description: 'Analyse émotionnelle avancée par IA multimodale',
    url: '/app/hume-ai',
    icon: Brain,
    category: 'Core',
    status: 'coming-soon',
    color: 'from-muted to-muted',
  },
  {
    title: 'Wearables',
    description: 'Synchronisez vos montres et capteurs connectés',
    url: '/app/wearables',
    icon: Activity,
    category: 'Wellness',
    status: 'coming-soon',
    color: 'from-muted to-muted',
  },
  {
    title: 'Brain Viewer',
    description: 'Visualisation cérébrale 3D interactive',
    url: '/app/brain-viewer',
    icon: Brain,
    category: 'Core',
    status: 'coming-soon',
    color: 'from-muted to-muted',
  },
];

const categories = [
  { name: 'Core', description: 'Modules principaux', color: 'bg-info' },
  { name: 'Wellness', description: 'Bien-être et relaxation', color: 'bg-success' },
  { name: 'Games', description: 'Jeux Fun-First', color: 'bg-accent' },
  { name: 'Social', description: 'Connexion et communauté', color: 'bg-destructive/70' },
  { name: 'Exchange', description: 'Marchés et échanges', color: 'bg-emerald-500' },
  { name: 'Analytics', description: 'Suivi et progression', color: 'bg-warning' },
];

export default function ModulesDashboard() {
  usePageSEO({
    title: 'Modules Bien-être - Toutes les fonctionnalités',
    description: 'Découvrez tous les modules EmotionsCare : scan émotions, musicothérapie, coach IA, journal, VR, jeux bien-être et plus encore.',
    keywords: 'modules bien-être, fonctionnalités, scan, musique, coach, journal, VR'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || module.status === selectedStatus;
      // Par défaut (sans filtre statut), masquer les coming-soon de la grille principale
      const hideComingSoon = selectedStatus === 'all' ? module.status !== 'coming-soon' : true;
      
      return matchesSearch && matchesCategory && matchesStatus && hideComingSoon;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const modulesByCategory = useMemo(() => {
    const grouped: Record<string, Module[]> = {};
    filteredModules.forEach(module => {
      if (!grouped[module.category]) {
        grouped[module.category] = [];
      }
      grouped[module.category].push(module);
    });
    return grouped;
  }, [filteredModules]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Actif</Badge>;
      case 'beta':
        return <Badge variant="secondary">Bêta</Badge>;
      case 'coming-soon':
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Bientôt
          </Badge>
        );
      default:
        return null;
    }
  };

  const isComingSoon = (module: Module) => module.status === 'coming-soon';

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tous les Modules
            </h1>
            <p className="text-muted-foreground text-lg">
              Explorez les outils de bien-être EmotionsCare
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {modules.filter(m => m.status !== 'coming-soon').length} actifs
            </Badge>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Rechercher un module"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="beta">Bêta</SelectItem>
              <SelectItem value="coming-soon">Bientôt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recommandés pour vous */}
      {selectedCategory === 'all' && selectedStatus === 'all' && !searchQuery && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-warning fill-warning" aria-hidden="true" />
            Recommandés pour vous
          </h2>
          <p className="text-muted-foreground">Commencez par ces modules essentiels</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.filter(m => m.featured && m.status !== 'coming-soon').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.title} 
                  className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 bg-gradient-to-br from-background to-primary/5"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} text-white group-hover:scale-110 transition-transform shadow-lg`} aria-hidden="true">
                        <Icon className="h-7 w-7" />
                      </div>
                      {getStatusBadge(module.status)}
                    </div>
                    <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={module.url} aria-label={`Accéder au module ${module.title}`}>
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        Accéder au module
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories Overview */}
      {selectedCategory === 'all' && selectedStatus === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="text-left w-full"
              aria-label={`Filtrer par ${cat.name}`}
            >
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color} mb-2`} aria-hidden="true" />
                  <CardTitle className="text-sm">{cat.name}</CardTitle>
                  <CardDescription className="text-xs">{cat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {modules.filter(m => m.category === cat.name).length}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* Modules par catégorie */}
      {Object.keys(modulesByCategory).length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            Aucun module ne correspond à vos critères
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Card>
      ) : (
        categories
          .filter(category => modulesByCategory[category.name])
          .map((category) => {
            const categoryModules = modulesByCategory[category.name];
            
            return (
              <div key={category.name} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded ${category.color}`} />
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <Badge variant="outline" className="ml-auto">
                    {categoryModules.length} modules
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryModules.map((module) => {
                    const Icon = module.icon;
                    const comingSoon = isComingSoon(module);
                    
                    return (
                      <Card 
                        key={module.title} 
                        className={cn(
                          "group transition-all duration-300 border-2",
                          comingSoon 
                            ? "opacity-60 border-dashed border-muted-foreground/20"
                            : "hover:shadow-lg hover:border-primary/50"
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "p-3 rounded-lg bg-gradient-to-br text-white transition-transform",
                              module.color,
                              !comingSoon && "group-hover:scale-110"
                            )} aria-hidden="true">
                              <Icon className="h-6 w-6" />
                            </div>
                            {getStatusBadge(module.status)}
                          </div>
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {comingSoon ? (
                            <Button 
                              className="w-full"
                              variant="outline"
                              disabled
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Bientôt disponible
                            </Button>
                          ) : (
                            <Link to={module.url}>
                              <Button 
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                variant="outline"
                              >
                                Accéder au module
                              </Button>
                            </Link>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
      )}

      {/* Coming Soon section - visible uniquement sans filtre */}
      {selectedCategory === 'all' && selectedStatus === 'all' && !searchQuery && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
            <Clock className="h-6 w-6" />
            Bientôt disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.filter(m => m.status === 'coming-soon').map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.title} className="opacity-60 border-dashed border-muted-foreground/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-muted" aria-hidden="true">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {getStatusBadge(module.status)}
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <CardDescription className="text-sm">{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{modules.filter(m => m.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Modules actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">{modules.filter(m => m.status === 'beta').length}</p>
              <p className="text-sm text-muted-foreground">En bêta</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-muted-foreground">{modules.filter(m => m.status === 'coming-soon').length}</p>
              <p className="text-sm text-muted-foreground">Bientôt</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Catégories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
