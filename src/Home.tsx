
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, TrendingUp, Zap, Star } from 'lucide-react';
import SecurityFooter from '@/components/SecurityFooter';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { selectedMode, setSelectedMode } = useUserMode();

  if (isAuthenticated && selectedMode) {
    // Redirect authenticated users to their dashboard
    window.location.href = selectedMode === 'B2C' ? '/dashboard' : '/admin';
    return null;
  }

  const features = [
    {
      icon: Heart,
      title: "Bien-être émotionnel",
      description: "Analysez et améliorez votre santé émotionnelle avec notre IA avancée"
    },
    {
      icon: Shield,
      title: "Sécurité totale",
      description: "Vos données sont protégées par les plus hauts standards de sécurité"
    },
    {
      icon: Users,
      title: "Collaboration d'équipe",
      description: "Créez un environnement de travail plus harmonieux et productif"
    },
    {
      icon: TrendingUp,
      title: "Analytics avancés",
      description: "Suivez votre progression avec des tableaux de bord détaillés"
    }
  ];

  const handleModeSelection = (mode: 'B2C' | 'B2B') => {
    setSelectedMode(mode);
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="w-3 h-3 mr-1" />
            Plateforme #1 du bien-être en entreprise
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transformez le bien-être émotionnel de votre organisation avec notre plateforme IA révolutionnaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => handleModeSelection('B2C')}
              className="w-full sm:w-auto"
            >
              <Heart className="w-4 h-4 mr-2" />
              Accès Personnel
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleModeSelection('B2B')}
              className="w-full sm:w-auto"
            >
              <Users className="w-4 h-4 mr-2" />
              Accès Entreprise
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction utilisateur</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support disponible</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Prêt à transformer votre bien-être ?</CardTitle>
              <CardDescription className="text-lg">
                Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Commencer maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <SecurityFooter />
    </div>
  );
};

export default Home;
