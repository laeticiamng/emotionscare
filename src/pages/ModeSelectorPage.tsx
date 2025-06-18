
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import { Users, User } from 'lucide-react';

/**
 * Page de sélection du mode utilisateur
 * Permet de choisir entre B2C (particulier) et B2B (entreprise)
 */
const ModeSelectorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez le mode qui correspond à votre utilisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mode B2C - Particulier */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Particulier</CardTitle>
              <CardDescription className="text-base">
                Accès personnel à EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Scanner d'émotions personnel</li>
                <li>• Coach IA personnalisé</li>
                <li>• Musicothérapie adaptative</li>
                <li>• Journal personnel</li>
                <li>• Expériences VR</li>
              </ul>
              <Link to={UNIFIED_ROUTES.B2C_LOGIN} className="block">
                <Button className="w-full" size="lg">
                  Accès Particulier
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mode B2B - Entreprise */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-base">
                Solutions pour organisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestion d'équipes</li>
                <li>• Tableaux de bord RH</li>
                <li>• Analyses collectives</li>
                <li>• Cocon social d'entreprise</li>
                <li>• Rapports et optimisation</li>
              </ul>
              <Link to={UNIFIED_ROUTES.B2B_SELECTION} className="block">
                <Button className="w-full" variant="outline" size="lg">
                  Accès Entreprise
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link 
            to={UNIFIED_ROUTES.HOME} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectorPage;
