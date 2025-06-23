
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Settings, ArrowRight } from 'lucide-react';

const B2BPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EmotionsCare B2B
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solutions de bien-être émotionnel pour votre entreprise. 
            Choisissez votre mode d'accès pour commencer.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Sélection de mode */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-6 w-6 mr-3 text-blue-600" />
                Sélection de mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Choisissez entre les modes Utilisateur et Administrateur selon vos besoins.
              </p>
              <Link to="/b2b/selection">
                <Button className="w-full">
                  Accéder à la sélection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accès Utilisateur */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-3 text-green-600" />
                Espace Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accès direct aux outils de bien-être pour les collaborateurs.
              </p>
              <div className="space-y-2">
                <Link to="/b2b/user/login" className="block">
                  <Button variant="outline" className="w-full">
                    Connexion Utilisateur
                  </Button>
                </Link>
                <Link to="/b2b/user/register" className="block">
                  <Button variant="ghost" className="w-full">
                    Inscription Utilisateur
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accès Administrateur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-purple-600" />
              Espace Administrateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Gestion et Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Tableau de bord complet pour le suivi du bien-être de vos équipes.
                </p>
                <Link to="/b2b/admin/login">
                  <Button variant="default">
                    Connexion Admin
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fonctionnalités Admin</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gestion des équipes</li>
                  <li>• Rapports détaillés</li>
                  <li>• Organisation d'événements</li>
                  <li>• Configuration système</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Actions rapides</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                Retour à l'accueil
              </Button>
            </Link>
            <Link to="/choose-mode">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Choisir un mode
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BPage;
