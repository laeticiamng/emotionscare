
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Scan, Music, MessageCircle, BookOpen, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroVideo from '@/components/HeroVideo';
import WelcomeHero from '@/components/home/WelcomeHero';
import ModuleCard from '@/components/home/ModuleCard';

const Home: React.FC = () => {
  const ctaButtons = [
    {
      label: "primary",
      link: "/choose-mode",
      text: "Commencer maintenant",
      variant: "default" as const,
      icon: true
    },
    {
      label: "secondary", 
      link: "/browsing",
      text: "Explorer sans inscription",
      variant: "outline" as const,
      icon: false
    }
  ];

  const coreModules = [
    {
      icon: <Scan className="h-6 w-6" />,
      title: "Scanner Émotionnel",
      description: "Analysez votre état émotionnel en temps réel grâce à l'IA et obtenez des recommandations personnalisées.",
      statIcon: <Brain className="h-4 w-4" />,
      statText: "Précision IA",
      statValue: "94%",
      to: "/scan"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Musicothérapie",
      description: "Découvrez des playlists thérapeutiques adaptées à votre humeur et vos besoins émotionnels.",
      statIcon: <Heart className="h-4 w-4" />,
      statText: "Utilisateurs actifs",
      statValue: "12K+",
      to: "/music"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Coach IA",
      description: "Bénéficiez d'un accompagnement personnalisé 24h/24 avec notre coach virtuel spécialisé en bien-être.",
      statIcon: <Sparkles className="h-4 w-4" />,
      statText: "Conversations",
      statValue: "50K+",
      to: "/coach"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Journal Émotionnel",
      description: "Tenez un journal de vos émotions avec analyse automatique des tendances et insights personnalisés.",
      to: "/journal"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section avec vidéo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroVideo className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            EmotionsCare
          </h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            La plateforme de bien-être émotionnel powered by AI pour les professionnels de santé
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-80">
            Transformez votre relation aux émotions grâce à des outils scientifiquement validés, 
            une IA empathique et une communauté bienveillante.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg" asChild>
              <Link to="/choose-mode">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg" asChild>
              <Link to="/browsing">
                Explorer la démo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section des valeurs principales */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Pourquoi EmotionsCare ?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une approche révolutionnaire du bien-être émotionnel, conçue spécialement pour les défis uniques des professionnels de santé.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <CardTitle className="text-2xl">Bien-être Scientifique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Outils basés sur la recherche en neurosciences et psychologie positive, 
                  validés cliniquement pour une efficacité maximale.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Sécurité Maximale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conformité RGPD, chiffrement bout-en-bout et hébergement certifié HDS. 
                  Vos données personnelles restent confidentielles.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Communauté Bienveillante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rejoignez une communauté de professionnels de santé qui partagent 
                  leurs expériences et se soutiennent mutuellement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section modules principaux */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Nos Modules Phares</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des outils puissants et intuitifs pour comprendre, gérer et améliorer votre bien-être émotionnel au quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreModules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez plus de 15 000 professionnels de santé qui ont déjà fait confiance à EmotionsCare 
            pour améliorer leur qualité de vie professionnelle et personnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
              <Link to="/choose-mode">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
