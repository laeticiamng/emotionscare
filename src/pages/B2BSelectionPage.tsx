
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/choose-mode">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Espace Professionnel</h1>
          <p className="text-lg text-muted-foreground">
            Choisissez votre type d'accès professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle>Collaborateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Accès employé aux outils de bien-être de votre entreprise
              </p>
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Outils personnels de bien-être</li>
                <li>• Suivi individuel</li>
                <li>• Contenu adapté au travail</li>
              </ul>
              <Link to="/b2b/user/login" className="block">
                <Button className="w-full">
                  Accès Collaborateur
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Building2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle>Administrateur RH</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Tableau de bord complet pour la gestion des équipes
              </p>
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Analytics et rapports</li>
                <li>• Gestion des équipes</li>
                <li>• Outils d'administration</li>
              </ul>
              <Link to="/b2b/admin/login" className="block">
                <Button variant="secondary" className="w-full">
                  Accès Administrateur
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
