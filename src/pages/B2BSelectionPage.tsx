
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez votre type d'accès
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate('/b2b/user/login')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-base">
                Accès collaborateur pour améliorer votre bien-être au travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3" />
                  Outils de bien-être personnalisés
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3" />
                  Suivi de votre santé émotionnelle
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3" />
                  Accès aux ressources d'entreprise
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Connexion Collaborateur
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate('/b2b/admin/login')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                <Shield className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Administration</CardTitle>
              <CardDescription className="text-base">
                Accès administrateur pour gérer votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mr-3" />
                  Tableaux de bord RH complets
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mr-3" />
                  Gestion des équipes et utilisateurs
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mr-3" />
                  Analytics avancés et rapports
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Connexion Administration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
