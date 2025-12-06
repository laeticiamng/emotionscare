import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Grid, List, Star, Clock, 
  Heart, Brain, Activity, Target, Users, Settings, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/routerV2';
import AccessDiagnostic from '@/components/debug/AccessDiagnostic';

interface NavItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'wellness' | 'social' | 'analysis' | 'settings' | 'fun';
  isNew?: boolean;
  isFavorite?: boolean;
  lastUsed?: Date;
}

const NavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [navItems] = useState<NavItem[]>([
    // Wellness
    {
      id: 'scan',
      title: 'Scan Émotionnel',
      description: 'Analysez votre état émotionnel en temps réel',
      path: routes.b2c.scan(),
      icon: Brain,
      category: 'wellness',
      isFavorite: true,
      lastUsed: new Date('2024-01-22'),
    },
    {
      id: 'music',
      title: 'Musicothérapie',
      description: 'Séances personnalisées de musicothérapie',
      path: routes.b2c.music(),
      icon: Heart,
      category: 'wellness',
      lastUsed: new Date('2024-01-21'),
    },
    {
      id: 'vr',
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives de relaxation',
      path: routes.b2c.vr(),
      icon: Activity,
      category: 'wellness',
      isNew: true,
    },
    {
      id: 'coach',
      title: 'Coach IA',
      description: 'Accompagnement personnalisé par IA',
      path: routes.b2c.coach(),
      icon: Target,
      category: 'wellness',
      isFavorite: true,
    },
    {
      id: 'journal',
      title: 'Journal Personnel',
      description: 'Réflexions et suivi quotidien',
      path: routes.b2c.journal(),
      icon: Heart,
      category: 'wellness',
    },
    
    // Fun Modules
    {
      id: 'flash-glow',
      title: 'Flash Glow',
      description: 'Exercices rapides de bien-être',
      path: routes.b2c.flashGlow(),
      icon: Star,
      category: 'fun',
    },
    {
      id: 'bubble-beat',
      title: 'Bubble Beat',
      description: 'Visualisation interactive du rythme cardiaque',
      path: routes.b2c.bubbleBeat(),
      icon: Activity,
      category: 'fun',
      isNew: true,
    },
    {
      id: 'boss-grit',
      title: 'Boss Grit',
      description: 'Défis de résilience et de persévérance',
      path: routes.b2c.bossLevel(),
      icon: Target,
      category: 'fun',
    },
    
    // Social
    {
      id: 'social-cocon',
      title: 'Social Cocon',
      description: 'Communauté bienveillante et sécurisée',
      path: routes.b2c.community(),
      icon: Users,
      category: 'social',
    },
    
    // Analysis
    {
      id: 'leaderboard',
      title: 'Classements',
      description: 'Compétitions amicales et récompenses',
      path: '/app/leaderboard',
      icon: Star,
      category: 'analysis',
    },
    {
      id: 'activity',
      title: 'Activité',
      description: 'Historique et statistiques personnelles',
      path: '/app/activity',
      icon: Activity,
      category: 'analysis',
    },
    {
      id: 'scores',
      title: 'Scores & vibes',
      description: 'Courbes d’humeur, séances et heatmap quotidienne',
      path: '/app/scores',
      icon: Brain,
      category: 'analysis',
    },
    
    // Settings
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration de votre compte',
      path: routes.b2c.settings(),
      icon: Settings,
      category: 'settings',
    },
  ]);

  const categories = [
    { id: 'all', label: 'Toutes', count: navItems.length },
    { id: 'wellness', label: 'Bien-être', count: navItems.filter(item => item.category === 'wellness').length },
    { id: 'fun', label: 'Modules Fun', count: navItems.filter(item => item.category === 'fun').length },
    { id: 'social', label: 'Social', count: navItems.filter(item => item.category === 'social').length },
    { id: 'analysis', label: 'Analyses', count: navItems.filter(item => item.category === 'analysis').length },
    { id: 'settings', label: 'Paramètres', count: navItems.filter(item => item.category === 'settings').length },
  ];

  const categoryColors = {
    wellness: 'bg-green-100 text-green-700',
    fun: 'bg-purple-100 text-purple-700',
    social: 'bg-blue-100 text-blue-700',
    analysis: 'bg-orange-100 text-orange-700',
    settings: 'bg-gray-100 text-gray-700',
  };

  const filteredItems = navItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const favoriteItems = navItems.filter(item => item.isFavorite);
  const recentItems = navItems
    .filter(item => item.lastUsed)
    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Navigation & Diagnostic</h1>
              <p className="text-sm text-muted-foreground">Explorez les fonctionnalités et vérifiez l'accès</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        <Tabs defaultValue="navigation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="diagnostic" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Diagnostic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigation" className="space-y-6">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher une fonctionnalité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

        {/* Sections Rapides */}
        {!searchQuery && (
          <div className="space-y-6 mb-8">
            
            {/* Favoris */}
            {favoriteItems.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Favoris
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {favoriteItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card 
                        key={item.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => navigate(item.path)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Récents */}
            {recentItems.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Récemment utilisés
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card 
                        key={item.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => navigate(item.path)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {item.lastUsed?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* Résultats */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                    viewMode === 'list' ? 'flex items-center gap-4' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-4 w-full' : 'text-center'}`}>
                    <div className={viewMode === 'list' ? 'flex-shrink-0' : 'mb-3'}>
                      <div className={`${categoryColors[item.category]} p-3 rounded-lg inline-block`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.isNew && <Badge className="bg-green-100 text-green-700">Nouveau</Badge>}
                        {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      </div>
                      <p className={`text-sm text-muted-foreground ${viewMode === 'grid' ? 'text-center' : ''}`}>
                        {item.description}
                      </p>
                      {item.lastUsed && viewMode === 'list' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Utilisé le {item.lastUsed.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier votre recherche ou vos filtres
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="diagnostic">
            <AccessDiagnostic />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationPage;