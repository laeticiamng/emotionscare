
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre mode d'accès</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sélectionnez le type de compte qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mode B2C */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="text-2xl">Mode Personnel (B2C)</CardTitle>
              <CardDescription className="text-lg">
                Pour les professionnels de santé individuels
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Scanner émotionnel personnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Journal de bien-être</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Musique thérapeutique</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Coach virtuel personnalisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Communauté de soutien</span>
                </li>
              </ul>
              <Link to="/b2c/login" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Accéder au mode personnel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mode B2B */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="text-2xl">Mode Entreprise (B2B)</CardTitle>
              <CardDescription className="text-lg">
                Pour les établissements de santé et entreprises
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Tableaux de bord administrateur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Gestion des équipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Rapports et analyses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Conformité RGPD avancée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Link to="/b2b/selection" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Accéder au mode entreprise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Navigation de retour */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              ← Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
