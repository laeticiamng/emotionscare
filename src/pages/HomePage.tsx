
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Brain, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Votre plateforme de bien-être émotionnel et de développement personnel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/choose-mode">
                Commencer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/help-center">
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Scan Émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analysez vos émotions en temps réel avec notre technologie avancée
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Coach IA</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recevez des conseils personnalisés de notre coach intelligent
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Social Cocon</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connectez-vous avec une communauté bienveillante
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-xl">VR Immersive</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vivez des expériences immersives pour votre bien-être
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Accès rapide</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/scan">Scan Émotions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/music">Musicothérapie</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/coach">Coach IA</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/journal">Journal</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/vr">Expérience VR</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/gamification">Gamification</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
