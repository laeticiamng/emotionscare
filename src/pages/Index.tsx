
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bienvenue sur EmotionsCare
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Votre plateforme de bien-être émotionnel
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button onClick={() => navigate('/dashboard')}>
            Aller au tableau de bord
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
