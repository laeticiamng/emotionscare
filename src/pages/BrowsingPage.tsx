
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Heart, 
  Brain, 
  Music, 
  Camera, 
  Users, 
  BookOpen, 
  Gamepad2,
  Zap,
  Star,
  TrendingUp,
  Filter,
  Grid,
  List,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BrowsingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Tout', icon: Grid, color: 'bg-gray-500' },
    { id: 'analysis', name: 'Analyse Émotionnelle', icon: Brain, color: 'bg-blue-500' },
    { id: 'music', name: 'Musicothérapie', icon: Music, color: 'bg-green-500' },
    { id: 'coaching', name: 'Coaching IA', icon: Heart, color: 'bg-red-500' },
    { id: 'games', name: 'Jeux Thérapeutiques', icon: Gamepad2, color: 'bg-purple-500' },
    { id: 'journal', name: 'Journal Émotionnel', icon: BookOpen, color: 'bg-orange-500' },
    { id: 'social', name: 'Communauté', icon: Users, color: 'bg-pink-500' },
    { id: 'vr', name: 'Réalité Virtuelle', icon: Camera, color: 'bg-indigo-500' }
  ];

  const features = [
    {
      id: 'scan',
      title: 'Scan Émotionnel',
      description: 'Analysez vos émotions en temps réel via caméra ou micro',
      category: 'analysis',
      rating: 4.8,
      users: '50k+',
      icon: Brain,
      color: 'bg-blue-500',
      premium: false,
      route: '/scan'
    },
    {
      id: 'music',
      title: 'Musicothérapie IA',
      description: 'Musique personnalisée selon votre état émotionnel',
      category: 'music',
      rating: 4.9,
      users: '35k+',
      icon: Music,
      color: 'bg-green-500',
      premium: false,
      route: '/music'
    },
    {
      id: 'coach',
      title: 'Coach IA Personnel',
      description: 'Accompagnement personnalisé 24h/24',
      category: 'coaching',
      rating: 4.7,
      users: '28k+',
      icon: Heart,
      color: 'bg-red-500',
      premium: true,
      route: '/coach'
    },
    {
      id: 'journal',
      title: 'Journal Émotionnel',
      description: 'Suivez votre évolution émotionnelle au quotidien',
      category: 'journal',
      rating: 4.6,
      users: '42k+',
      icon: BookOpen,
      color: 'bg-orange-500',
      premium: false,
      route: '/journal'
    },
    {
      id: 'mood-mixer',
      title: 'Mood Mixer',
      description: 'Créez et partagez vos mélanges d\'humeur',
      category: 'games',
      rating: 4.5,
      users: '18k+',
      icon: Gamepad2,
      color: 'bg-purple-500',
      premium: false,
      route: '/mood-mixer'
    },
    {
      id: 'vr-sessions',
      title: 'Sessions VR Relaxation',
      description: 'Immersion totale pour la détente et méditation',
      category: 'vr',
      rating: 4.8,
      users: '15k+',
      icon: Camera,
      color: 'bg-indigo-500',
      premium: true,
      route: '/vr'
    },
    {
      id: 'social-cocon',
      title: 'Cocon Social',
      description: 'Communauté bienveillante de soutien mutuel',
      category: 'social',
      rating: 4.4,
      users: '25k+',
      icon: Users,
      color: 'bg-pink-500',
      premium: false,
      route: '/social-cocon'
    },
    {
      id: 'boss-level-grit',
      title: 'Boss Level Grit',
      description: 'Développez votre résilience avec des défis gamifiés',
      category: 'games',
      rating: 4.6,
      users: '12k+',
      icon: Zap,
      color: 'bg-yellow-500',
      premium: true,
      route: '/boss-level-grit'
    }
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFeatures = features.filter(f => parseFloat(f.rating.toString()) >= 4.7);

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Explorer EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez toutes nos fonctionnalités pour améliorer votre bien-être émotionnel
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une fonctionnalité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Catégories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className={`p-1 rounded-full ${category.color} text-white`}>
                  <category.icon className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Popular Features */}
        {selectedCategory === 'all' && searchTerm === '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-bold">Fonctionnalités Populaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularFeatures.slice(0, 3).map((feature) => (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.route)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      {feature.premium && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{feature.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span>{feature.users}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <Separator className="my-8" />

        {/* All Features */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {selectedCategory === 'all' ? 'Toutes les fonctionnalités' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="text-sm text-muted-foreground">
            {filteredFeatures.length} résultat{filteredFeatures.length > 1 ? 's' : ''}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }
        >
          {filteredFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(feature.route)}
            >
              {viewMode === 'grid' ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      {feature.premium && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{feature.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{feature.users}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${feature.color} text-white flex-shrink-0`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        {feature.premium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{feature.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{feature.users}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </motion.div>

        {filteredFeatures.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default BrowsingPage;
