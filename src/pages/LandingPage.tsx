
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, Shield, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">EmotionsCare</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/choose-mode')}>
              Se connecter
            </Button>
            <Button onClick={() => navigate('/choose-mode')}>
              Commencer
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Votre bien-être émotionnel au cœur de votre quotidien
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Une plateforme innovante qui accompagne particuliers et entreprises 
            dans la gestion du bien-être émotionnel grâce à l'intelligence artificielle.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/choose-mode')}
            className="text-lg px-8 py-6"
          >
            Découvrir EmotionsCare
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Nos solutions adaptées à vos besoins
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Espace Particulier</CardTitle>
              <CardDescription>
                Suivi personnalisé de votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>• Analyse émotionnelle quotidienne</li>
                <li>• Recommandations personnalisées</li>
                <li>• Outils de méditation et relaxation</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => {
                  localStorage.setItem('userMode', 'b2c');
                  navigate('/b2c/login');
                }}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Espace Collaborateur</CardTitle>
              <CardDescription>
                Bien-être au travail et cohésion d'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>• Suivi du bien-être en entreprise</li>
                <li>• Activités collaboratives</li>
                <li>• Support émotionnel</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => {
                  localStorage.setItem('userMode', 'b2b_user');
                  navigate('/b2b/user/login');
                }}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Espace Administrateur</CardTitle>
              <CardDescription>
                Gestion et analytiques pour les RH
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>• Dashboard analytique complet</li>
                <li>• Gestion des équipes</li>
                <li>• Rapports de bien-être</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => {
                  localStorage.setItem('userMode', 'b2b_admin');
                  navigate('/b2b/admin/login');
                }}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">EmotionsCare</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 EmotionsCare. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
