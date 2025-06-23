
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-gray-600">
            EmotionsCare s'adapte à vos besoins personnels ou professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* B2C Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Particulier (B2C)</CardTitle>
              <CardDescription className="text-lg">
                Accès personnel à tous les outils de bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Scanner émotionnel personnel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Journal émotionnel privé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Musicothérapie personnalisée
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Coach IA personnel
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/b2c/login" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Accès Particulier
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                <Building className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Entreprise (B2B)</CardTitle>
              <CardDescription className="text-lg">
                Solutions professionnelles pour le bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Gestion d'équipes et collaborateurs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Tableau de bord administrateur
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Rapports et analytics RH
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Conformité RGPD entreprise
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/b2b/selection" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Accès Entreprise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous hésitez ? Contactez notre équipe pour une démonstration personnalisée
          </p>
          <Button variant="outline">
            Demander une démo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
