
import React, { useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Home component rendering on path:', location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Bienvenue sur EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Votre plateforme de bien-être émotionnel
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/choose-mode')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Commencer votre parcours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
