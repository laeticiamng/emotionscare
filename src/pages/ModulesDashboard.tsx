// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { routes } from '@/lib/routes';

interface Module {
  title: string;
  description: string;
  url: string;
  icon: any;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  color: string;
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
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Musique Adaptative',
    description: 'Musique générée selon votre état émotionnel',
    url: routes.b2c.music(),
    icon: Music,
    category: 'Core',
    status: 'active',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'AI Coach',
    description: 'Coaching personnalisé par intelligence artificielle',
    url: routes.b2c.coach(),
    icon: MessageSquare,
    category: 'Core',
    status: 'active',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Journal Émotionnel',
    description: 'Suivez votre évolution émotionnelle au quotidien',
    url: routes.b2c.journal(),
    icon: BookOpen,
    category: 'Core',
    status: 'active',
    color: 'from-orange-500 to-red-500',
  },

  // Wellness Modules
  {
    title: 'Respiration Guidée',
    description: 'Exercices de respiration pour la relaxation',
    url: routes.b2c.breath(),
    icon: Wind,
    category: 'Wellness',
    status: 'active',
    color: 'from-sky-500 to-blue-500',
  },
  {
    title: 'VR Galaxy',
    description: 'Expérience immersive de méditation en VR',
    url: routes.b2c.vrGalaxy(),
    icon: Brain,
    category: 'Wellness',
    status: 'beta',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Flash Glow',
    description: 'Stimulation visuelle pour l\'apaisement',
    url: routes.b2c.flashGlow(),
    icon: Zap,
    category: 'Wellness',
    status: 'active',
    color: 'from-yellow-500 to-orange-500',
  },

  // Fun-First Games
  {
    title: 'Mood Mixer',
    description: 'Créez votre ambiance émotionnelle parfaite',
    url: routes.b2c.moodMixer(),
    icon: Palette,
    category: 'Games',
    status: 'active',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Boss Grit',
    description: 'Développez votre résilience par le jeu',
    url: routes.b2c.bossLevel(),
    icon: Target,
    category: 'Games',
    status: 'active',
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Bounce Back Battle',
    description: 'Affrontez vos défis avec gamification',
    url: routes.b2c.bounceBack(),
    icon: Shield,
    category: 'Games',
    status: 'beta',
    color: 'from-teal-500 to-green-500',
  },
  {
    title: 'Bubble Beat',
    description: 'Jeu musical anti-stress',
    url: routes.b2c.bubbleBeat(),
    icon: Gamepad2,
    category: 'Games',
    status: 'active',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Story Synth',
    description: 'Créez et partagez vos histoires émotionnelles',
    url: routes.b2c.storySynth(),
    icon: Sparkles,
    category: 'Games',
    status: 'beta',
    color: 'from-violet-500 to-purple-500',
  },

  // Social
  {
    title: 'Communauté',
    description: 'Connectez-vous avec d\'autres utilisateurs',
    url: routes.b2c.community(),
    icon: Users,
    category: 'Social',
    status: 'active',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Social Cocon',
    description: 'Espace de soutien et d\'entraide',
    url: routes.b2c.socialCocon(),
    icon: Heart,
    category: 'Social',
    status: 'active',
    color: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Leaderboard',
    description: 'Classement et défis communautaires',
    url: routes.b2c.leaderboard(),
    icon: Trophy,
    category: 'Social',
    status: 'active',
    color: 'from-amber-500 to-orange-500',
  },

  // Analytics
  {
    title: 'Analytics',
    description: 'Visualisez vos statistiques émotionnelles',
    url: routes.b2c.activity(),
    icon: Activity,
    category: 'Analytics',
    status: 'active',
    color: 'from-emerald-500 to-green-500',
  },
  {
    title: 'Heatmap Émotionnelle',
    description: 'Cartographie de vos émotions dans le temps',
    url: routes.b2c.heatmap(),
    icon: BarChart3,
    category: 'Analytics',
    status: 'active',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Gamification',
    description: 'Badges, achievements et progression',
    url: routes.b2c.gamification(),
    icon: TrendingUp,
    category: 'Analytics',
    status: 'active',
    color: 'from-purple-500 to-pink-500',
  },
];

const categories = [
  { name: 'Core', description: 'Modules principaux', color: 'bg-blue-500' },
  { name: 'Wellness', description: 'Bien-être et relaxation', color: 'bg-green-500' },
  { name: 'Games', description: 'Jeux Fun-First', color: 'bg-purple-500' },
  { name: 'Social', description: 'Connexion et communauté', color: 'bg-pink-500' },
  { name: 'Analytics', description: 'Suivi et progression', color: 'bg-orange-500' },
];

export default function ModulesDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'beta':
        return <Badge variant="secondary">Beta</Badge>;
      case 'coming-soon':
        return <Badge variant="outline">Bientôt</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Tous les Modules
        </h1>
        <p className="text-muted-foreground text-lg">
          Explorez tous les modules de la plateforme EmotionsCare
        </p>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="border-2">
            <CardHeader className="pb-3">
              <div className={`w-3 h-3 rounded-full ${cat.color} mb-2`} />
              <CardTitle className="text-sm">{cat.name}</CardTitle>
              <CardDescription className="text-xs">{cat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {modules.filter(m => m.category === cat.name).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules by Category */}
      {categories.map((category) => {
        const categoryModules = modules.filter(m => m.category === category.name);
        
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
                
                return (
                  <Card 
                    key={module.title} 
                    className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {getStatusBadge(module.status)}
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={module.url}>
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
        );
      })}

      {/* Stats Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statistiques Globales
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{modules.length}</p>
            <p className="text-sm text-muted-foreground">Modules totaux</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">
              {modules.filter(m => m.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Modules actifs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-500">
              {modules.filter(m => m.status === 'beta').length}
            </p>
            <p className="text-sm text-muted-foreground">En beta</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-500">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Catégories</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
