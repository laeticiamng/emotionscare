
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/types/navigation';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Bienvenue sur EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Votre plateforme de bien-être émotionnel et de gestion du stress au travail
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary">
            {/* Redirect individuals to login to enforce authentication */}
            <Link to={ROUTES.b2c.login}>Accès Particulier</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/b2b/selection">Accès Entreprise</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
