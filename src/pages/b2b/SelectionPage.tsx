
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix de mode
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600">
            Connectez-vous selon votre rôle dans l'organisation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/b2b/user/login')}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-lg">
                Accédez à votre espace personnel en tant qu'employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <p>✨ Bien-être personnel</p>
                <p>👥 Interaction avec l'équipe</p>
                <p>📊 Suivi de progression</p>
                <p>🎯 Objectifs collaboratifs</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Se connecter comme collaborateur
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/b2b/admin/login')}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">Administrateur</CardTitle>
              <CardDescription className="text-lg">
                Gérez votre organisation et vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <p>🛡️ Administration complète</p>
                <p>📈 Analytics avancées</p>
                <p>👥 Gestion des équipes</p>
                <p>📋 Rapports détaillés</p>
              </div>
              <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                Se connecter comme administrateur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
