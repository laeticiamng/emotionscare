
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez l'option qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mode B2C - Particulier */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Particulier</CardTitle>
              <CardDescription className="text-lg">
                Accès individuel pour votre bien-être personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Suivi émotionnel personnel</li>
                <li>• Coach IA personnalisé</li>
                <li>• Programmes de méditation</li>
                <li>• Journal émotionnel</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2c/login')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Accéder en tant que Particulier
              </Button>
            </CardContent>
          </Card>

          {/* Mode B2B - Entreprise */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-lg">
                Solution complète pour les organisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dashboard RH avancé</li>
                <li>• Analytics d'équipe</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Rapports de bien-être</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/selection')} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Accéder en tant qu'Entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
