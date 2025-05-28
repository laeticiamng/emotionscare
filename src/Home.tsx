
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">EmotionsCare</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Plateforme de bien-être émotionnel pour les professionnels de santé
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Commencer
          </Button>
          <Button size="lg" variant="outline">
            En savoir plus
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Bien-être émotionnel
            </CardTitle>
            <CardDescription>
              Outils pour gérer le stress et améliorer la santé mentale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scanner émotionnel, journal, musique thérapeutique et plus encore.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Sécurisé et confidentiel
            </CardTitle>
            <CardDescription>
              Conformité RGPD et protection des données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vos données sont protégées avec les plus hauts standards de sécurité.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Communauté
            </CardTitle>
            <CardDescription>
              Connectez-vous avec d'autres professionnels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Partagez vos expériences et soutenez-vous mutuellement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
