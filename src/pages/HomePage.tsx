import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart, Brain, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Page d'accueil EmotionsCare
 * Interface moderne et accessible
 */
const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Intelligence Émotionnelle
            <span className="text-primary block mt-2">Premium</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Découvrez votre potentiel émotionnel avec notre plateforme révolutionnaire 
            alimentée par l'IA. Analysez, comprenez et optimisez vos émotions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Commencer Gratuitement
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/login">
                Se Connecter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Analyse IA Avancée</h3>
            <p className="text-muted-foreground">
              Reconnaissance émotionnelle en temps réel par intelligence artificielle
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Music className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Musicothérapie Adaptative</h3>
            <p className="text-muted-foreground">
              Musique thérapeutique générée selon votre état émotionnel
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Bien-être Personnalisé</h3>
            <p className="text-muted-foreground">
              Coaching personnel et exercices adaptés à vos besoins
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default HomePage;