/**
 * PAGE B2C PREMIUM - PLATEFORME EMOTIONSCARE
 * Page de présentation complète avec intégrations Suno, Hume et OpenAI
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  Play,
  Mic,
  Camera,
  MessageSquare,
  Headphones,
  Activity,
  Star,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// === DONNÉES DES FONCTIONNALITÉS ===
const features = [
  {
    icon: Brain,
    title: 'Analyse Émotionnelle IA',
    description: 'Détection d\'émotions en temps réel via Hume AI - facial, vocal et textuel',
    tech: 'Hume AI',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    benefits: ['Précision 95%+', 'Temps réel', 'Multi-modal']
  },
  {
    icon: Music,
    title: 'Musicothérapie Adaptive',
    description: 'Génération musicale thérapeutique personnalisée via Suno AI',
    tech: 'Suno AI',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    benefits: ['Musique unique', 'Thérapeutique', 'Adaptative']
  },
  {
    icon: MessageSquare,
    title: 'Coach IA Personnel',
    description: 'Accompagnement bienveillant et conseils personnalisés via OpenAI',
    tech: 'OpenAI GPT',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    benefits: ['24/7 disponible', 'Personnalisé', 'Bienveillant']
  },
  {
    icon: Activity,
    title: 'Biométrie Avancée',
    description: 'Suivi du rythme cardiaque, respiration et patterns physiologiques',
    tech: 'WebXR + Sensors',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950',
    benefits: ['Précis', 'Non-invasif', 'Temps réel']
  },
  {
    icon: TrendingUp,
    title: 'Analytics Prédictifs',
    description: 'Prédiction et prévention des états émotionnels difficiles',
    tech: 'ML Custom',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    benefits: ['Prédictif', 'Préventif', 'Intelligent']
  },
  {
    icon: Shield,
    title: 'Confidentialité Totale',
    description: 'Chiffrement bout-en-bout et conformité RGPD complète',
    tech: 'Security First',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    benefits: ['RGPD', 'Chiffré', 'Privé']
  }
];

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Manager',
    content: 'EmotionsCare a transformé ma gestion du stress. La musique thérapeutique est incroyable.',
    rating: 5,
    emotion: 'calm'
  },
  {
    name: 'Thomas K.',
    role: 'Étudiant',
    content: 'L\'analyse émotionnelle m\'aide à comprendre mes patterns et à mieux gérer mes émotions.',
    rating: 5,
    emotion: 'happy'
  },
  {
    name: 'Sophie M.',
    role: 'Psychologue',
    content: 'Un outil remarquable pour le suivi de mes patients. Très complet et respectueux.',
    rating: 5,
    emotion: 'focused'
  }
];

const B2CPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDemoClick = (demoType: string) => {
    setActiveDemo(demoType);
    // Ici on pourrait lancer une vraie démo
    setTimeout(() => setActiveDemo(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={1}
      >
        Aller au contenu principal
      </a>
      <a 
        href="#features" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux fonctionnalités
      </a>

      <main id="main-content" role="main" className="min-h-screen bg-background">
        {/* === HERO SECTION === */}
        <section className="relative py-20 px-4 overflow-hidden" aria-labelledby="hero-title">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          
          <div className="relative max-w-7xl mx-auto text-center">
          <div className={cn(
            'transition-all duration-1000 transform',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          )}>
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Plateforme de Bien-être Émotionnel Premium
            </Badge>
            
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              L'intelligence artificielle au service de votre bien-être émotionnel. 
              Analyse, musique thérapeutique et coaching personnalisé.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="px-8 py-3" asChild>
                <Link to="/app" aria-label="Commencer gratuitement - Accédez à votre plateforme de bien-être">
                  <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                  Commencer gratuitement
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="px-8 py-3" aria-label="Voir la démo vidéo de la plateforme">
                <Camera className="w-5 h-5 mr-2" aria-hidden="true" />
                Voir la démo
              </Button>
            </div>
            
            {/* Démos rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button
                variant="ghost"
                className="p-6 h-auto flex-col space-y-2"
                onClick={() => handleDemoClick('facial')}
                disabled={activeDemo === 'facial'}
              >
                <Camera className={cn(
                  'w-8 h-8',
                  activeDemo === 'facial' ? 'animate-pulse text-primary' : 'text-muted-foreground'
                )} />
                <span className="text-sm">Analyse Faciale</span>
                {activeDemo === 'facial' && (
                  <Badge variant="secondary" className="text-xs">
                    Détection en cours...
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="p-6 h-auto flex-col space-y-2"
                onClick={() => handleDemoClick('voice')}
                disabled={activeDemo === 'voice'}
              >
                <Mic className={cn(
                  'w-8 h-8',
                  activeDemo === 'voice' ? 'animate-pulse text-primary' : 'text-muted-foreground'
                )} />
                <span className="text-sm">Analyse Vocale</span>
                {activeDemo === 'voice' && (
                  <Badge variant="secondary" className="text-xs">
                    Écoute active...
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="p-6 h-auto flex-col space-y-2"
                onClick={() => handleDemoClick('music')}
                disabled={activeDemo === 'music'}
              >
                <Headphones className={cn(
                  'w-8 h-8',
                  activeDemo === 'music' ? 'animate-pulse text-primary' : 'text-muted-foreground'
                )} />
                <span className="text-sm">Musique IA</span>
                {activeDemo === 'music' && (
                  <Badge variant="secondary" className="text-xs">
                    Génération...
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

        {/* === FONCTIONNALITÉS PRINCIPALES === */}
        <section id="features" className="py-20 px-4 bg-muted/30" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">
                Technologie de Pointe
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment nous révolutionnons le bien-être émotionnel avec l'IA
              </p>
            </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={cn(
                  'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                  'border-0 bg-background'
                )}
              >
                <div className={cn('absolute inset-0 opacity-50', feature.bgColor)} />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('p-2 rounded-lg', feature.bgColor)}>
                      <feature.icon className={cn('w-6 h-6', feature.color)} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.tech}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* === TÉMOIGNAGES === */}
        <section className="py-20 px-4" aria-labelledby="testimonials-title">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez comment EmotionsCare transforme des vies
              </p>
            </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                  <Badge variant="outline" className="mt-4">
                    <Heart className="w-3 h-3 mr-1" />
                    {testimonial.emotion}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* === CTA FINAL === */}
        <section className="py-20 px-4 bg-primary text-primary-foreground" aria-labelledby="cta-title">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-6">
              Commencez votre parcours de bien-être aujourd'hui
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui transforment leur vie émotionnelle avec EmotionsCare
            </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
                <Link to="/signup" aria-label="Inscription gratuite - Créer votre compte EmotionsCare">
                  <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
                  Inscription gratuite
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/entreprise" aria-label="Version Entreprise - Solutions pour les organisations">
                  <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                  Version Entreprise
                </Link>
              </Button>
            </div>
          
          <p className="text-sm mt-6 opacity-75">
            Aucun engagement • 30 jours d'essai • Support 24/7
          </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - L'IA au service de votre bien-être</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions
                </Link>
                <Link to="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2CPage;