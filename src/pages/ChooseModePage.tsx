
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choisissez votre mode d'accès</h1>
          <p className="text-lg text-muted-foreground">
            Sélectionnez le type de compte qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Particulier (B2C)</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Accès individuel aux outils de bien-être émotionnel, 
                gestion personnelle du stress et de l'humeur.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li>• Scanner émotionnel personnel</li>
                <li>• Journal de bord privé</li>
                <li>• Musicothérapie adaptée</li>
                <li>• Coach IA personnel</li>
              </ul>
              <Link to="/b2c/login" className="block">
                <Button className="w-full">
                  Accès Particulier
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Entreprise (B2B)</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Solutions pour équipes et organisations, 
                tableau de bord administrateur et analyses d'équipe.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li>• Dashboard équipe</li>
                <li>• Analytics RH</li>
                <li>• Gestion multi-utilisateurs</li>
                <li>• Rapports de bien-être</li>
              </ul>
              <Link to="/b2b/selection" className="block">
                <Button className="w-full" variant="outline">
                  Accès Entreprise
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
