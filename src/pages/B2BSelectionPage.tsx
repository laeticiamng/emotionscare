
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/choose-mode">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Accès Entreprise</h1>
          <p className="text-lg text-muted-foreground">
            Choisissez votre rôle dans l'organisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <UserCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Collaborateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Accès aux outils de bien-être avec fonctionnalités collaboratives
                et suivi d'équipe.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li>• Scanner émotionnel d'équipe</li>
                <li>• Journal collaboratif</li>
                <li>• Chat avec collègues</li>
                <li>• Défis d'équipe</li>
              </ul>
              <Link to="/b2b/user/login" className="block">
                <Button className="w-full">
                  Connexion Collaborateur
                </Button>
              </Link>
              <Link to="/b2b/user/register" className="block">
                <Button variant="ghost" className="w-full">
                  Créer un compte
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Administration</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Tableau de bord complet pour gérer l'équipe et analyser 
                le bien-être organisationnel.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li>• Dashboard administrateur</li>
                <li>• Analytics et rapports</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Configuration système</li>
              </ul>
              <Link to="/b2b/admin/login" className="block">
                <Button className="w-full" variant="outline">
                  Connexion Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
