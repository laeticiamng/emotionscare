
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/home/HeroSection';
import ActionButtons from './components/home/ActionButtons';
import WelcomeHero from './components/home/WelcomeHero';
import CallToAction from './components/home/CallToAction';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Brain, Heart, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const ctaButtons = [
    {
      label: 'b2c',
      link: '/b2c/login',
      text: 'Espace Personnel',
      variant: 'default' as const,
      icon: true
    },
    {
      label: 'b2b',
      link: '/b2b/selection',
      text: 'Espace Entreprise',
      variant: 'outline' as const,
      icon: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-16">
        <WelcomeHero 
          title="Bienvenue sur EmotionsCare"
          subtitle="Votre plateforme de bien-être émotionnel alimentée par l'IA"
          ctaButtons={ctaButtons}
        />

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <CallToAction type="personal" />
          <CallToAction type="business" />
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Nos fonctionnalités</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Analyse émotionnelle IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analysez vos émotions avec notre IA avancée pour mieux comprendre votre état mental.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Musique thérapeutique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Découvrez des playlists personnalisées adaptées à votre humeur et vos besoins.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Accompagnement coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bénéficiez d'un accompagnement personnalisé avec notre coach IA bienveillant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center">
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default Home;
