
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Espace Entreprise</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez votre type d'accès professionnel
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-lg">
                Accès aux outils de bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                <li>• Scan émotionnel professionnel</li>
                <li>• Coach IA adapté au travail</li>
                <li>• Journal de travail</li>
                <li>• Musicothérapie bureau</li>
                <li>• Équipes et collaboration</li>
                <li>• Feedback anonyme</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link to="/b2b/user/login">Connexion Collaborateur</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Administration</CardTitle>
              <CardDescription className="text-lg">
                Gestion complète et analytics avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                <li>• Dashboard RH complet</li>
                <li>• Analytics et rapports</li>
                <li>• Gestion des équipes</li>
                <li>• Paramètres organisation</li>
                <li>• Export de données</li>
                <li>• Support prioritaire</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link to="/b2b/admin/login">Connexion Admin</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="ghost">
            <Link to="/choose-mode">← Choisir un autre mode</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
