
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, UserCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BRoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-indigo-500 mr-3" />
            <span className="text-3xl font-bold">EmotionsCare Business</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choisissez votre type d'accès
          </h1>
          <p className="text-gray-600">
            Sélectionnez le profil qui correspond à votre rôle dans l'entreprise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Collaborateur */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Collaborateur</CardTitle>
              <CardDescription>
                Accès personnel aux outils de bien-être pour les employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Analyse émotionnelle personnalisée
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Coach IA dédié au bien-être au travail
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Journal de bord professionnel
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Communauté d'entraide
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/b2b/user/register')}
                >
                  S'inscrire comme collaborateur
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2b/user/login')}
                >
                  Se connecter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Administrateur */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <UserCheck className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Administrateur</CardTitle>
              <CardDescription>
                Gestion et supervision du bien-être des équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Tableau de bord analytique
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Gestion des utilisateurs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Rapports de bien-être d'équipe
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Configuration des programmes
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600" 
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  Accès Administrateur
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Accès réservé aux responsables RH et managers
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Besoin d'aide ? Contactez votre responsable RH ou 
            <a href="mailto:support@emotionscare.com" className="text-blue-600 hover:underline ml-1">
              notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BRoleSelectionPage;
