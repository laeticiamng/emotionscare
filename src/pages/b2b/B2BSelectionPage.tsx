
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUserSelection = () => {
    console.log('Navigating to B2B User Login');
    navigate('/b2b/user/login');
  };

  const handleAdminSelection = () => {
    console.log('Navigating to B2B Admin Login');
    navigate('/b2b/admin/login');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Building2 className="mx-auto mb-4 text-blue-600" size={64} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez votre mode d'accès pour continuer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Carte Collaborateur */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full">
                <Users className="text-blue-600" size={32} />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Collaborateur
              </CardTitle>
              <CardDescription className="text-gray-600">
                Accès aux outils de bien-être et suivi personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Scan émotionnel quotidien
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Thérapie musicale personnalisée
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Journal de bord privé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Exercices de respiration
                </li>
              </ul>
              <Button 
                onClick={handleUserSelection}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Accéder en tant que Collaborateur
              </Button>
            </CardContent>
          </Card>

          {/* Carte Administrateur */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
                <Shield className="text-green-600" size={32} />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Administrateur RH
              </CardTitle>
              <CardDescription className="text-gray-600">
                Gestion d'équipe et tableaux de bord analytiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Tableau de bord équipe
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Analyse du climat social
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Rapports de bien-être
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Gestion des invitations
                </li>
              </ul>
              <Button 
                onClick={handleAdminSelection}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Accéder en tant qu'Administrateur
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
