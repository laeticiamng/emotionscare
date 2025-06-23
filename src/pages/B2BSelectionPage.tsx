
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link to="/choose-mode" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au choix du mode
          </Link>
          <h1 className="text-3xl font-bold mb-2">Espace Professionnel</h1>
          <p className="text-muted-foreground">
            Choisissez votre rôle dans l'organisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Option */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Utilisateur</CardTitle>
              <CardDescription>
                Accès aux modules de bien-être dans le cadre professionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Modules de bien-être</li>
                <li>✓ Suivi personnel</li>
                <li>✓ Coach IA adapté</li>
                <li>✓ Communauté d'entreprise</li>
              </ul>
              <Link to="/b2b/user/login" className="block">
                <Button className="w-full" size="lg">
                  Connexion Utilisateur
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Option */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Administrateur</CardTitle>
              <CardDescription>
                Gestion des équipes et accès aux analyses avancées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Dashboard administrateur</li>
                <li>✓ Gestion des utilisateurs</li>
                <li>✓ Rapports détaillés</li>
                <li>✓ Configuration avancée</li>
              </ul>
              <Link to="/b2b/admin/login" className="block">
                <Button className="w-full" size="lg" variant="outline">
                  Connexion Administrateur
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
