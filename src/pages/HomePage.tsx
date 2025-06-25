
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-testid="page-root">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plateforme premium de bien-être émotionnel pour particuliers et entreprises
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Particuliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accès personnel à tous nos outils de bien-être émotionnel
              </p>
              <Link to="/b2c/login">
                <Button className="w-full">
                  Commencer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Collaborateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Espace dédié aux employés des entreprises partenaires
              </p>
              <Link to="/b2b/user/login">
                <Button variant="outline" className="w-full">
                  Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-green-500" />
                Administrateurs RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tableau de bord complet pour la gestion des équipes
              </p>
              <Link to="/b2b/admin/login">
                <Button variant="secondary" className="w-full">
                  Accéder <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/choose-mode">
            <Button size="lg" variant="outline">
              Choisir votre profil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
