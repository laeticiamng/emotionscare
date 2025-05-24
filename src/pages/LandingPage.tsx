
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Music, MessageSquare, BarChart3, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'Analyse émotionnelle IA',
      description: 'Analysez vos émotions via texte, voix ou image avec notre IA avancée'
    },
    {
      icon: MessageSquare,
      title: 'Coach personnel IA',
      description: 'Un accompagnement personnalisé 24h/24 pour votre bien-être'
    },
    {
      icon: Music,
      title: 'Musicothérapie générative',
      description: 'Créez des ambiances sonores adaptées à votre état émotionnel'
    },
    {
      icon: BarChart3,
      title: 'Suivi et analytics',
      description: 'Visualisez vos progrès et évolution émotionnelle'
    },
    {
      icon: Shield,
      title: 'Données sécurisées',
      description: 'Chiffrement et respect du RGPD pour votre confidentialité'
    },
    {
      icon: Users,
      title: 'Solutions B2B',
      description: 'Accompagnement des équipes et bien-être en entreprise'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/choose-mode">
                    Accéder à l'app
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/choose-mode">Connexion</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/choose-mode">
                      Commencer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="outline">
            Intelligence Artificielle · Bien-être Émotionnel
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Votre bien-être émotionnel,
            <br />
            guidé par l'IA
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Découvrez EmotionsCare, la plateforme qui utilise l'intelligence artificielle 
            pour vous accompagner dans votre parcours de bien-être émotionnel. 
            Analysez, comprenez et améliorez votre santé mentale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/choose-mode">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/b2b/selection">
                Solutions entreprise
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            ✓ 3 jours d'essai gratuit · ✓ Aucune carte bancaire requise · ✓ RGPD compliant
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Une approche complète du bien-être
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils intelligents pour comprendre, suivre et améliorer votre santé émotionnelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui améliorent leur santé mentale 
            avec EmotionsCare. Commencez votre parcours dès aujourd'hui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/choose-mode">
                Essai gratuit 3 jours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/help">
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-lg font-bold">EmotionsCare</span>
              </div>
              <p className="text-muted-foreground">
                L'intelligence artificielle au service de votre bien-être émotionnel.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/choose-mode" className="hover:text-foreground">Particuliers</Link></li>
                <li><Link to="/b2b/selection" className="hover:text-foreground">Entreprises</Link></li>
                <li><Link to="/help" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-foreground">Tutoriels</Link></li>
                <li><Link to="/help" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-foreground">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
