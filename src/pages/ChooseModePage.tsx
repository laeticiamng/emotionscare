
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre mode d'accès</h1>
          <p className="text-xl text-muted-foreground">
            Sélectionnez l'option qui correspond le mieux à votre situation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="text-center">
              <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Particulier</CardTitle>
              <CardDescription className="text-lg">
                Accès personnel à toutes les fonctionnalités de bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                <li>• Scan émotionnel personnel</li>
                <li>• Coach IA personnalisé</li>
                <li>• Journal intime</li>
                <li>• Musicothérapie</li>
                <li>• Expériences VR</li>
                <li>• Communauté bienveillante</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link to="/b2c/login">Accès Particulier</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="text-center">
              <Building className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-lg">
                Solutions dédiées aux organisations et équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                <li>• Tableau de bord RH</li>
                <li>• Analytics d'équipe</li>
                <li>• Gestion des collaborateurs</li>
                <li>• Rapports de bien-être</li>
                <li>• Outils d'optimisation</li>
                <li>• Support dédié</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link to="/b2b/selection">Accès Entreprise</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="ghost">
            <Link to="/">← Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
