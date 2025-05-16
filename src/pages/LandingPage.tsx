
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Shell from '@/Shell';

const LandingPage: React.FC = () => {
  return (
    <Shell>
      <div className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue sur EmotionsCare</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre plateforme dédiée au bien-être émotionnel et à la gestion du stress quotidien.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg">
            <Link to="/b2c/login">
              Espace Personnel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/b2b/selection">
              Espace Entreprise
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default LandingPage;
