
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold mb-2">Choisissez votre espace</h1>
          <p className="text-muted-foreground">
            Sélectionnez le type de compte qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* B2C Option */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Particulier (B2C)</CardTitle>
              <CardDescription>
                Pour un usage personnel et le développement de votre bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Accès à tous les modules de bien-être</li>
                <li>✓ Coach IA personnalisé</li>
                <li>✓ Suivi de votre progression</li>
                <li>✓ Communauté de soutien</li>
              </ul>
              <Link to="/b2c/login" className="block">
                <Button className="w-full" size="lg">
                  Accéder à l'espace particulier
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* B2B Option */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Building className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Professionnel (B2B)</CardTitle>
              <CardDescription>
                Pour les entreprises et organisations soucieuses du bien-être de leurs équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Dashboard administrateur</li>
                <li>✓ Gestion des équipes</li>
                <li>✓ Rapports et analytiques</li>
                <li>✓ Support prioritaire</li>
              </ul>
              <Link to="/b2b/selection" className="block">
                <Button className="w-full" size="lg" variant="outline">
                  Accéder à l'espace professionnel
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
