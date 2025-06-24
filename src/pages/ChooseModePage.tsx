
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre espace
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez l'espace qui correspond à vos besoins
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate('/b2c/login')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-pink-100 rounded-full w-fit group-hover:bg-pink-200 transition-colors">
                <Heart className="h-12 w-12 text-pink-600" />
              </div>
              <CardTitle className="text-2xl">Espace Personnel</CardTitle>
              <CardDescription className="text-base">
                Pour les particuliers souhaitant améliorer leur bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-pink-500 rounded-full mr-3" />
                  Analyse émotionnelle personnalisée
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-pink-500 rounded-full mr-3" />
                  Coach IA disponible 24/7
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-pink-500 rounded-full mr-3" />
                  Musique thérapeutique adaptée
                </li>
              </ul>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Accéder à l'espace personnel
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate('/b2b/selection')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              <CardDescription className="text-base">
                Solutions complètes pour le bien-être de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                  Tableaux de bord RH avancés
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                  Analytics d'équipe en temps réel
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                  Rapports détaillés et conformité RGPD
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
