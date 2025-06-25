
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre profil</h1>
          <p className="text-lg text-muted-foreground">
            Sélectionnez le type d'accès qui vous correspond
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Particulier (B2C)</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Accès complet à la plateforme de bien-être émotionnel
              </p>
              <Link to="/b2c/login" className="block">
                <Button className="w-full">Continuer</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Collaborateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Employé d'une entreprise partenaire
              </p>
              <Link to="/b2b/user/login" className="block">
                <Button variant="outline" className="w-full">Continuer</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Administrateur RH</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Gestion et suivi des équipes
              </p>
              <Link to="/b2b/admin/login" className="block">
                <Button variant="secondary" className="w-full">Continuer</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
