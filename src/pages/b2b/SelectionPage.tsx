
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre espace B2B
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sélectionnez le type d'accès qui correspond à votre profil
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Utilisateur B2B */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Utilisateur</CardTitle>
              <CardDescription>
                Accès aux outils de bien-être et de productivité personnelle
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Suivi émotionnel personnel</li>
                <li>• Coaching IA personnalisé</li>
                <li>• Accès aux expériences VR</li>
                <li>• Participation aux activités d'équipe</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/user/login')}
                className="w-full"
                size="lg"
              >
                Accès Utilisateur
              </Button>
            </CardContent>
          </Card>

          {/* Administrateur B2B */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl">Administrateur</CardTitle>
              <CardDescription>
                Gestion d'équipe et tableau de bord analytique complet
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Tableau de bord équipe</li>
                <li>• Analytics et rapports</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Configuration et paramètres</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/admin/login')}
                className="w-full"
                size="lg"
                variant="outline"
              >
                Accès Administrateur
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-gray-600 dark:text-gray-400"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
