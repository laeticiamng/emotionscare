
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Music, Gamepad2, Users, Shield, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Scan Émotionnel",
      description: "Analysez votre état émotionnel en temps réel avec notre technologie avancée",
      color: "bg-blue-50"
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musicothérapie",
      description: "Découvrez des playlists personnalisées adaptées à votre humeur",
      color: "bg-purple-50"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Journal Émotionnel",
      description: "Suivez votre évolution émotionnelle avec notre journal intelligent",
      color: "bg-red-50"
    },
    {
      icon: <Gamepad2 className="h-8 w-8 text-green-500" />,
      title: "Gamification",
      description: "Progressez dans votre bien-être avec des défis et récompenses",
      color: "bg-green-50"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Communauté",
      description: "Connectez-vous avec d'autres utilisateurs dans un environnement sécurisé",
      color: "bg-orange-50"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Sécurité & Confidentialité",
      description: "Vos données sont protégées selon les normes RGPD les plus strictes",
      color: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Nouvelle version disponible
        </Badge>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          La plateforme de bien-être émotionnel qui transforme votre quotidien grâce à l'intelligence artificielle
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {!isAuthenticated ? (
            <>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/b2c/login">
                  Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/about">En savoir plus</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/home">
                Accéder au dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">4.9/5 - Plus de 10,000 utilisateurs satisfaits</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fonctionnalités principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg" variant="secondary">
              <Link to="/b2c/register">
                Créer mon compte gratuitement
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
