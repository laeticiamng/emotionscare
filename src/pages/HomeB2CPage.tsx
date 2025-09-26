import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HomeB2CPage() {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            EmotionsCare B2C
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez votre bien-être émotionnel avec nos outils personnalisés
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/app/scan">Commencer le scan</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}