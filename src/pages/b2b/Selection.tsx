
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRound, Building, BuildingIcon, User } from 'lucide-react';

const Selection: React.FC = () => {
  const navigate = useNavigate();
  
  const goToB2C = () => {
    navigate('/b2c/login');
  };
  
  const goToB2BUser = () => {
    navigate('/b2b/user/login');
  };
  
  const goToB2BAdmin = () => {
    navigate('/b2b/admin/login');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/20 to-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">EmotionsCare</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plateforme d'intelligence émotionnelle pour votre bien-être personnel et professionnel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Particulier (B2C) */}
          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <UserRound className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">Particulier</CardTitle>
              <CardDescription className="text-center">
                Accès individuel à la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-sm">
                Gérez votre bien-être émotionnel avec nos outils personnalisés
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Journal émotionnel</li>
                <li>• Coach IA personnalisé</li>
                <li>• Scanner d'émotions</li>
                <li>• Expériences VR immersives</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={goToB2C} className="w-full">
                Accéder
              </Button>
            </CardFooter>
          </Card>
          
          {/* Collaborateur (B2B User) */}
          <Card className="border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <User className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-center">Collaborateur</CardTitle>
              <CardDescription className="text-center">
                Accès professionnel individuel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-sm">
                Améliorez votre bien-être et performance au travail
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Outils de gestion du stress</li>
                <li>• Programmes d'équilibre travail-vie</li>
                <li>• Défis d'équipe</li>
                <li>• Micro-pauses régénérantes</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={goToB2BUser} variant="outline" className="w-full border-blue-200 hover:border-blue-400 text-blue-600">
                Accéder
              </Button>
            </CardFooter>
          </Card>
          
          {/* Administration (B2B Admin) */}
          <Card className="border-purple-200 hover:border-purple-400 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <BuildingIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <CardTitle className="text-center">RH / Administration</CardTitle>
              <CardDescription className="text-center">
                Gestion et supervision d'équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-sm">
                Pilotez le bien-être de vos équipes et favorisez l'engagement
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tableaux de bord analytiques</li>
                <li>• Suivi des tendances émotionnelles</li>
                <li>• Gestion des équipes</li>
                <li>• Création d'événements</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={goToB2BAdmin} variant="outline" className="w-full border-purple-200 hover:border-purple-400 text-purple-600">
                Accéder
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Selection;
