
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <h1 className="text-3xl font-bold mb-8">Sélectionnez votre profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Collaborateur
            </CardTitle>
            <CardDescription>
              Accédez à votre espace collaborateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Consultez vos outils de bien-être, votre journal émotionnel et vos recommandations personnalisées.</p>
            <Button asChild size="lg" className="w-full">
              <Link to="/b2b/user/dashboard">
                Accéder à l'espace collaborateur
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Administrateur
            </CardTitle>
            <CardDescription>
              Accédez à votre espace administrateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Gérez les utilisateurs, consultez les statistiques et configurez les paramètres de votre organisation.</p>
            <Button asChild size="lg" className="w-full">
              <Link to="/b2b/admin/dashboard">
                Accéder à l'espace administrateur
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Button variant="ghost" className="mt-8" asChild>
        <Link to="/">
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  );
};

export default B2BSelectionPage;
