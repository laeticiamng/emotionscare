
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Headphones, Brain } from 'lucide-react';

interface WelcomeHeroProps {
  userName?: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ userName }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/10 rounded-3xl">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Bienvenue{' '}
          <span className="text-primary">{userName ? userName : 'sur Emotial'}</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Découvrez votre bien-être émotionnel, faites le point sur votre santé mentale et
          accédez à des outils thérapeutiques innovants adaptés à vos besoins.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/scan">
              <Heart className="h-5 w-5" />
              Scan Émotionnel
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/music">
              <Headphones className="h-5 w-5" />
              Thérapie Musicale
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Intelligence émotionnelle</h3>
            <p className="text-sm text-muted-foreground">
              Analysez vos émotions et apprenez à mieux les gérer grâce à notre système IA.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez des playlists adaptées à votre état émotionnel pour favoriser votre bien-être.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Coaching virtuel</h3>
            <p className="text-sm text-muted-foreground">
              Recevez des conseils personnalisés de notre coach IA pour améliorer votre quotidien.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
