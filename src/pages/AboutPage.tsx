
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Users, Shield, Award, Lightbulb, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Bienveillance",
      description: "Nous plaçons le bien-être humain au cœur de nos préoccupations"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Confidentialité",
      description: "Vos données personnelles sont protégées selon les normes RGPD"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "Nous utilisons les dernières technologies d'IA pour votre bien-être"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté",
      description: "Nous créons des liens authentiques entre les utilisateurs"
    }
  ];

  const team = [
    {
      name: "Dr. Sophie Martin",
      role: "Directrice Scientifique",
      description: "Spécialiste en psychologie cognitive et intelligence artificielle",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie"
    },
    {
      name: "Thomas Dubois",
      role: "CTO",
      description: "Expert en développement d'applications de santé mentale",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas"
    },
    {
      name: "Marie Chen",
      role: "UX Lead",
      description: "Designeuse spécialisée dans l'expérience utilisateur thérapeutique",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              À propos d'EmotionsCare
            </Badge>
            <h1 className="text-4xl font-bold mb-6">
              Notre mission : démocratiser le bien-être émotionnel
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Nous croyons que chacun mérite d'avoir accès à des outils de bien-être émotionnel 
              performants et personnalisés, guidés par l'intelligence artificielle.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
                <p className="text-muted-foreground mb-4">
                  EmotionsCare est né de la conviction que la technologie peut révolutionner 
                  notre approche du bien-être mental. Fondée en 2024 par une équipe de 
                  psychologues, développeurs et designers passionnés.
                </p>
                <p className="text-muted-foreground mb-4">
                  Nous avons créé une plateforme qui combine recherche scientifique, 
                  intelligence artificielle et design centré sur l'humain pour offrir 
                  une expérience de bien-être personnalisée et efficace.
                </p>
                <p className="text-muted-foreground">
                  Aujourd'hui, plus de 10,000 utilisateurs font confiance à EmotionsCare 
                  pour améliorer leur qualité de vie émotionnelle.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">Intelligence Émotionnelle</h3>
                <p className="text-center text-muted-foreground">
                  Notre IA analyse plus de 50 paramètres émotionnels pour vous offrir 
                  des recommandations personnalisées
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre équipe</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="outline">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Scans émotionnels</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction utilisateur</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Découvrez comment EmotionsCare peut transformer votre quotidien
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/b2c/register">
                Créer mon compte <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
