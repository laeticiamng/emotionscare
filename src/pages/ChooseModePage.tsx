
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre mode d'accès</h1>
          <p className="text-xl text-muted-foreground">
            Sélectionnez le type de compte qui correspond à vos besoins
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <User className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <CardTitle className="text-2xl">Particulier (B2C)</CardTitle>
              <CardDescription className="text-lg">
                Accès individuel pour votre bien-être personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>✓ Coach IA personnel</li>
                <li>✓ Suivi émotionnel</li>
                <li>✓ Méditation guidée</li>
                <li>✓ Journal personnel</li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/b2c/login">Accéder en tant que particulier</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Building2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <CardTitle className="text-2xl">Entreprise (B2B)</CardTitle>
              <CardDescription className="text-lg">
                Solutions pour les équipes et organisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>✓ Gestion d'équipe</li>
                <li>✓ Analytics RH</li>
                <li>✓ Prévention burnout</li>
                <li>✓ Rapports détaillés</li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/b2b/selection">Accéder en tant qu'entreprise</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
