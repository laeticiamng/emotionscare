
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mode Entreprise</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choisissez votre rôle dans l'organisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Utilisateur */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <User className="h-12 w-12 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-2xl">Utilisateur</CardTitle>
              <CardDescription className="text-lg">
                Accès collaborateur aux outils de bien-être
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
                  <span>Accès aux ressources d'équipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Communauté interne</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Suivi de progression</span>
                </li>
              </ul>
              <Link to="/b2b/user/login" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Connexion utilisateur
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/b2b/user/register" className="block mt-2">
                <Button variant="outline" className="w-full">
                  Créer un compte utilisateur
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Administrateur */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900 rounded-full w-fit">
                <Shield className="h-12 w-12 text-red-600 dark:text-red-300" />
              </div>
              <CardTitle className="text-2xl">Administrateur</CardTitle>
              <CardDescription className="text-lg">
                Gestion complète de l'organisation
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
                  <span>Gestion des utilisateurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Rapports et analyses avancés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Configuration système</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Support technique prioritaire</span>
                </li>
              </ul>
              <Link to="/b2b/admin/login" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Connexion administrateur
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Navigation de retour */}
        <div className="text-center mt-12">
          <Link to="/choose-mode">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              ← Retour au choix de mode
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
