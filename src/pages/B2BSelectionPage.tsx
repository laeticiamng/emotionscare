
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accès Entreprise B2B
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez votre type d'accès selon votre rôle dans l'organisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Access Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <User className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Utilisateur</CardTitle>
              <CardDescription className="text-lg">
                Accès collaborateur aux outils de bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Scanner émotionnel professionnel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Journal de bien-être au travail
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Musicothérapie en pause
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Coach IA pour la productivité
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Communauté d'entreprise
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/b2b/user/login" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Connexion Utilisateur
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-300">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Administrateur</CardTitle>
              <CardDescription className="text-lg">
                Gestion complète et tableaux de bord RH
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Dashboard de gestion d'équipe
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Analytics et rapports RH
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Gestion des utilisateurs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Paramètres de sécurité
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Conformité et audit
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/b2b/admin/login" className="w-full">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Connexion Admin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Besoin d'aide pour accéder à votre compte ? Contactez votre administrateur IT
          </p>
          <Link to="/choose-mode">
            <Button variant="outline">
              ← Retour au choix de mode
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
