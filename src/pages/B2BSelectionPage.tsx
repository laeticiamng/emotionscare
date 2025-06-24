
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mode Entreprise
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez votre type d'accès
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Accès Collaborateur */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-lg">
                Accès aux outils de bien-être pour employés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Scan émotionnel quotidien</li>
                <li>• Coach IA personnalisé</li>
                <li>• Sessions VR de relaxation</li>
                <li>• Musique thérapeutique</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/user/login')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Connexion Collaborateur
              </Button>
            </CardContent>
          </Card>

          {/* Accès Administrateur */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Administrateur</CardTitle>
              <CardDescription className="text-lg">
                Interface de gestion et analytics RH
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dashboard RH complet</li>
                <li>• Analytics d'équipe</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Rapports de conformité</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/admin/login')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Connexion Administrateur
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Choisir un autre mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
