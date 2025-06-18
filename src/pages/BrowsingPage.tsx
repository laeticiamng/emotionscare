
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Brain, Music, Heart, Gamepad2, Users, Zap, ArrowRight, Star, Clock } from 'lucide-react';

const BrowsingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tout', icon: <Zap className="h-4 w-4" /> },
    { id: 'scan', name: 'Scan Émotionnel', icon: <Brain className="h-4 w-4" /> },
    { id: 'music', name: 'Musicothérapie', icon: <Music className="h-4 w-4" /> },
    { id: 'journal', name: 'Journal', icon: <Heart className="h-4 w-4" /> },
    { id: 'games', name: 'Gamification', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'community', name: 'Communauté', icon: <Users className="h-4 w-4" /> }
  ];

  const features = [
    {
      id: 1,
      title: "Scan Émotionnel Avancé",
      description: "Analysez votre état émotionnel en temps réel avec notre IA propriétaire",
      category: "scan",
      rating: 4.9,
      users: "2.1k",
      duration: "2-3 min",
      tags: ["IA", "Temps réel", "Précision"],
      color: "bg-blue-500",
      route: "/scan"
    },
    {
      id: 2,
      title: "Musicothérapie Personnalisée",
      description: "Playlists adaptées à votre humeur et état émotionnel",
      category: "music",
      rating: 4.8,
      users: "5.7k",
      duration: "15-30 min",
      tags: ["Personnalisé", "Relaxation", "Bien-être"],
      color: "bg-purple-500",
      route: "/music"
    },
    {
      id: 3,
      title: "Journal Émotionnel Intelligent",
      description: "Suivez votre évolution avec des insights personnalisés",
      category: "journal",
      rating: 4.7,
      users: "3.2k",
      duration: "5-10 min",
      tags: ["Suivi", "Insights", "Évolution"],
      color: "bg-red-500",
      route: "/journal"
    },
    {
      id: 4,
      title: "Défis Bien-être",
      description: "Progressez avec des défis ludiques et motivants",
      category: "games",
      rating: 4.6,
      users: "1.8k",
      duration: "10-20 min",
      tags: ["Motivation", "Progression", "Récompenses"],
      color: "bg-green-500",
      route: "/gamification"
    },
    {
      id: 5,
      title: "Communauté de Soutien",
      description: "Connectez-vous avec d'autres personnes sur le même parcours",
      category: "community",
      rating: 4.5,
      users: "4.3k",
      duration: "Illimité",
      tags: ["Soutien", "Partage", "Entraide"],
      color: "bg-orange-500",
      route: "/community"
    },
    {
      id: 6,
      title: "Coach IA Personnel",
      description: "Votre accompagnateur virtuel disponible 24h/24",
      category: "scan",
      rating: 4.8,
      users: "6.1k",
      duration: "Variable",
      tags: ["IA", "Disponible 24/7", "Personnalisé"],
      color: "bg-indigo-500",
      route: "/coach"
    }
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularTags = ["IA", "Bien-être", "Personnalisé", "Relaxation", "Motivation", "Soutien"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Explorez nos fonctionnalités
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez tous les outils disponibles pour améliorer votre bien-être émotionnel
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une fonctionnalité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Popular Tags */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-4">Tags populaires :</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    {categories.find(cat => cat.id === feature.category)?.icon}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {feature.rating}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {feature.users} utilisateurs
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {feature.duration}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {feature.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button asChild className="w-full group-hover:translate-y-[-2px] transition-transform">
                  <Link to={feature.route}>
                    Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou explorez nos catégories
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-blue-100 mb-6">
            Créez votre compte pour accéder à toutes ces fonctionnalités
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/b2c/register">
              Commencer maintenant
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default BrowsingPage;
