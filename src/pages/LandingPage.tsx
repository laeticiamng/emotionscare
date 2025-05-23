
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EmotionsCare</h1>
          <div className="space-x-2">
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Prenez soin de votre bien-être émotionnel
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Une plateforme complète pour analyser, comprendre et améliorer votre santé émotionnelle, 
            que vous soyez particulier ou professionnel.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/choose-mode')} className="gap-2">
              Commencer maintenant <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
              Espace professionnel
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Pour qui ?</h3>
          <p className="text-muted-foreground">Adapté à tous vos besoins</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Particuliers</CardTitle>
              <CardDescription>
                Analysez vos émotions au quotidien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Outils personnalisés pour comprendre et gérer vos émotions
              </p>
              <Button variant="outline" onClick={() => navigate('/b2c/login')}>
                Accéder à l'espace personnel
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Collaborateurs</CardTitle>
              <CardDescription>
                Bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Participez aux initiatives de bien-être de votre organisation
              </p>
              <Button variant="outline" onClick={() => navigate('/b2b/user/login')}>
                Espace collaborateur
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Administrateurs RH</CardTitle>
              <CardDescription>
                Gestion et analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tableau de bord complet pour le suivi du bien-être de vos équipes
              </p>
              <Button variant="outline" onClick={() => navigate('/b2b/admin/login')}>
                Dashboard administrateur
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
