
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowRight, Building2 } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez votre rôle pour accéder aux fonctionnalités appropriées
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collaborateur Card */}
          <Card className="hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Collaborateur</CardTitle>
              <CardDescription className="text-lg">
                Accès aux outils de bien-être personnel et d'équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Scan émotionnel</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Coach IA personnel</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Activités d'équipe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Social Cocon</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/b2b/user/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/b2b/user/register" className="block">
                  <Button variant="outline" className="w-full">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Administrateur Card */}
          <Card className="hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Administrateur RH</CardTitle>
              <CardDescription className="text-lg">
                Gestion d'équipe et tableaux de bord avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Gestion des équipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Rapports détaillés</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Événements & formations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Optimisation RH</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/b2b/admin/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/choose-mode" className="text-gray-600 hover:text-gray-800 transition-colors">
            ← Retour au choix d'espace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
