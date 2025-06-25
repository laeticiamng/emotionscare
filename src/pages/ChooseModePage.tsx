
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowLeft, Users, Shield } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sélectionnez l'espace qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-20 w-20 text-pink-500" />
              </div>
              <CardTitle className="text-2xl text-pink-600">Particulier (B2C)</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Pour votre bien-être personnel
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Suivi personnel de votre bien-être émotionnel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Coach virtuel personnel 24h/24</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Musicothérapie personnalisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Journal émotionnel privé</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/b2c')}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
              >
                Accéder à l'espace particulier
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-20 w-20 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Entreprise (B2B)</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Pour le bien-être de vos équipes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Tableau de bord RH complet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Analyses de bien-être d'équipe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Rapports et statistiques avancés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Gestion multi-utilisateurs</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
