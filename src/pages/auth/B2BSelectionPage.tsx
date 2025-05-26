
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Button
          variant="ghost"
          onClick={() => navigate('/choose-mode')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Entreprise
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez votre profil d'accès
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Collaborateur */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Collaborateur</CardTitle>
              <CardDescription>
                Accédez à votre espace personnel au sein de l'entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Tableau de bord personnel</li>
                <li>• Activités bien-être</li>
                <li>• Suivi de progression</li>
                <li>• Outils de méditation</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/user/login')}
                className="w-full"
              >
                Se connecter en tant que collaborateur
              </Button>
            </CardContent>
          </Card>

          {/* Administrateur */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Administration</CardTitle>
              <CardDescription>
                Gérez et supervisez le bien-être de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Tableau de bord global</li>
                <li>• Analytics d'équipe</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Rapports détaillés</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/admin/login')}
                className="w-full"
                variant="outline"
              >
                Se connecter en tant qu'admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
