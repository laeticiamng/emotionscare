
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">EmotionsCare</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Plateforme de bien-être émotionnel pour les professionnels de santé
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/choose-mode">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/scan">
              <Button size="lg" variant="outline">
                Scanner émotionnel
              </Button>
            </Link>
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
              <p className="text-sm text-muted-foreground mb-4">
                Scanner émotionnel, journal, musique thérapeutique et plus encore.
              </p>
              <Link to="/scan">
                <Button variant="ghost" size="sm">
                  Découvrir <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
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
              <p className="text-sm text-muted-foreground mb-4">
                Vos données sont protégées avec les plus hauts standards de sécurité.
              </p>
              <Link to="/privacy">
                <Button variant="ghost" size="sm">
                  En savoir plus <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
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
              <p className="text-sm text-muted-foreground mb-4">
                Partagez vos expériences et soutenez-vous mutuellement.
              </p>
              <Link to="/social-cocon">
                <Button variant="ghost" size="sm">
                  Rejoindre <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Commencer votre parcours</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link to="/b2c/login">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Particulier</CardTitle>
                  <CardDescription>
                    Accès individuel aux outils de bien-être
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/b2b/selection">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Entreprise</CardTitle>
                  <CardDescription>
                    Solutions pour équipes et organisations
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
