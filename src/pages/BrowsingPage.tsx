import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Building2, Search, Filter, Star, ArrowRight, Sparkles } from 'lucide-react';

const BrowsingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const solutions = [
    {
      id: 'b2c',
      title: 'EmotionsCare Personnel',
      description: 'Votre compagnon de bien-être émotionnel au quotidien',
      features: ['Scan émotionnel IA', 'VR thérapeutique', 'Coach virtuel', 'Musicothérapie'],
      price: 'Gratuit',
      category: 'personnel',
      popular: true,
      path: '/b2c'
    },
    {
      id: 'b2b-collab',
      title: 'EmotionsCare Collaborateur',
      description: 'Solutions de bien-être pour les employés en entreprise',
      features: ['Gestion du stress professionnel', 'Équilibre vie-travail', 'Support communautaire', 'Analytics personnels'],
      price: 'Sur mesure',
      category: 'entreprise',
      popular: false,
      path: '/entreprise'
    },
    {
      id: 'b2b-rh',
      title: 'EmotionsCare RH Manager',
      description: 'Tableaux de bord et insights pour les ressources humaines',
      features: ['Dashboard équipe', 'Analytics RH', 'Prévention burn-out', 'Rapports de bien-être'],
      price: 'Sur mesure',
      category: 'entreprise',
      popular: false,
      path: '/entreprise'
    }
  ];

  const modules = [
    {
      name: 'Scan Émotionnel',
      description: 'Analysez vos émotions en temps réel',
      icon: '🧠',
      category: 'core'
    },
    {
      name: 'VR Thérapeutique',
      description: 'Environnements immersifs apaisants',
      icon: '🥽',
      category: 'immersion'
    },
    {
      name: 'Flash Glow',
      description: 'Boost d\'énergie instantané',
      icon: '⚡',
      category: 'fun'
    },
    {
      name: 'Musicothérapie',
      description: 'Musique adaptée à votre humeur',
      icon: '🎵',
      category: 'core'
    },
    {
      name: 'Breathwork',
      description: 'Techniques de respiration guidée',
      icon: '💨',
      category: 'wellness'
    },
    {
      name: 'Journal Vocal',
      description: 'Exprimez-vous naturellement',
      icon: '🎤',
      category: 'expression'
    },
    {
      name: 'Bounce Back Battle',
      description: 'Entraînement à la résilience',
      icon: '🛡️',
      category: 'fun'
    },
    {
      name: 'Cocon Social',
      description: 'Communauté de soutien',
      icon: '👥',
      category: 'social'
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes', count: solutions.length },
    { id: 'personnel', label: 'Personnel', count: solutions.filter(s => s.category === 'personnel').length },
    { id: 'entreprise', label: 'Entreprise', count: solutions.filter(s => s.category === 'entreprise').length }
  ];

  const moduleCategories = [
    { id: 'core', label: 'Essentiel', color: 'bg-blue-100 text-blue-800' },
    { id: 'fun', label: 'Fun-First', color: 'bg-purple-100 text-purple-800' },
    { id: 'wellness', label: 'Bien-être', color: 'bg-green-100 text-green-800' },
    { id: 'immersion', label: 'Immersion', color: 'bg-orange-100 text-orange-800' },
    { id: 'expression', label: 'Expression', color: 'bg-pink-100 text-pink-800' },
    { id: 'social', label: 'Social', color: 'bg-cyan-100 text-cyan-800' }
  ];

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const categoryObj = moduleCategories.find(c => c.id === category);
    return categoryObj ? categoryObj.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EmotionsCare</h1>
                <p className="text-sm text-gray-600">Explorez nos solutions de bien-être</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">
            Découvrez EmotionsCare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme complète de bien-être émotionnel avec IA, réalité virtuelle 
            et outils personnalisés pour particuliers et entreprises.
          </p>
          
          {/* Recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une solution..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions principales */}
        <section className="space-y-8">
          <h3 className="text-2xl font-bold text-gray-900">Nos Solutions</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {filteredSolutions.map(solution => (
              <Card 
                key={solution.id} 
                className={`relative hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  solution.popular ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => navigate(solution.path)}
              >
                {solution.popular && (
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-purple-600 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {solution.category === 'personnel' ? (
                      <Heart className="w-8 h-8 text-purple-600" />
                    ) : (
                      <Building2 className="w-8 h-8 text-blue-600" />
                    )}
                    <div>
                      <CardTitle className="text-xl">{solution.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {solution.price}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600">{solution.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Fonctionnalités clés :</h4>
                      <ul className="space-y-1">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full" variant={solution.popular ? "default" : "outline"}>
                      {solution.category === 'personnel' ? 'Essayer gratuitement' : 'En savoir plus'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Modules et fonctionnalités */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Modules d'Innovation
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos modules uniques conçus pour transformer votre expérience du bien-être
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h4 className="font-semibold mb-2">{module.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <Badge variant="outline" className={getCategoryColor(module.category)}>
                    {moduleCategories.find(c => c.id === module.category)?.label}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h3 className="text-3xl font-bold mb-4">
            Prêt à commencer votre voyage ?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui transforment leur bien-être quotidien
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/b2c">
              <Button size="lg" variant="secondary" className="px-8">
                <Heart className="w-5 h-5 mr-2" />
                Solution Personnelle
              </Button>
            </Link>
            <Link to="/entreprise">
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-purple-600">
                <Building2 className="w-5 h-5 mr-2" />
                Solution Entreprise
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            ✨ Essai gratuit • 🔒 Données sécurisées • 🏆 Support premium
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6" />
            <span className="text-xl font-bold">EmotionsCare</span>
          </div>
          <p className="text-gray-400">
            Votre partenaire de confiance pour le bien-être émotionnel
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrowsingPage;