
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Activity, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur EmotionsCare</h1>
        <p className="text-xl text-muted-foreground">
          Votre plateforme de bien-être émotionnel powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Scanner d'émotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Analysez vos émotions en temps réel grâce à l'IA
            </p>
            <Link to="/scan">
              <Button className="w-full">Commencer un scan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Journal personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Suivez votre parcours émotionnel au quotidien
            </p>
            <Link to="/journal">
              <Button className="w-full">Ouvrir le journal</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Obtenez des conseils personnalisés de votre coach virtuel
            </p>
            <Link to="/coach">
              <Button className="w-full">Parler au coach</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Modules disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/music">
            <Button variant="outline" className="w-full h-16">
              🎵 Musicothérapie
            </Button>
          </Link>
          <Link to="/vr">
            <Button variant="outline" className="w-full h-16">
              🥽 Réalité Virtuelle
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" className="w-full h-16">
              👥 Communauté
            </Button>
          </Link>
          <Link to="/gamification">
            <Button variant="outline" className="w-full h-16">
              🎮 Gamification
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
