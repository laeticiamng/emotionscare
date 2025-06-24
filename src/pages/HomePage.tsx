
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary mb-6">
          EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Page d'accueil fonctionnelle
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/b2c/login">
            <Button>Espace Personnel</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline">En savoir plus</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
