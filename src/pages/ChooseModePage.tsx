
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Shield, ArrowRight } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleModeSelection = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre expérience
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez le mode qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mode B2C */}
          <Card className="relative hover:shadow-lg transition-shadow cursor-pointer group" 
                onClick={() => handleModeSelection('b2c')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Particulier</CardTitle>
              <Badge variant="secondary">B2C</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-center">
                Idéal pour votre développement personnel et votre bien-être individuel
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Scan émotionnel personnel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Coach IA personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Journal intime sécurisé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Communauté bienveillante
                </li>
              </ul>
              <Button className="w-full group-hover:bg-blue-700">
                Choisir ce mode
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Mode B2B User */}
          <Card className="relative hover:shadow-lg transition-shadow cursor-pointer group" 
                onClick={() => handleModeSelection('b2b_user')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Collaborateur</CardTitle>
              <Badge variant="secondary">B2B User</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-center">
                Pour les employés souhaitant améliorer leur bien-être au travail
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Outils personnels + équipe
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Suivi du bien-être au travail
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Activités collaboratives
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Accès aux événements RH
                </li>
              </ul>
              <Button className="w-full group-hover:bg-green-700">
                Choisir ce mode
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Mode B2B Admin */}
          <Card className="relative hover:shadow-lg transition-shadow cursor-pointer group" 
                onClick={() => handleModeSelection('b2b_admin')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Administrateur RH</CardTitle>
              <Badge variant="secondary">B2B Admin</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-center">
                Pour les RH et managers gérant le bien-être des équipes
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Tableau de bord RH complet
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Analytics et rapports
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Gestion des équipes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Outils d'optimisation
                </li>
              </ul>
              <Button className="w-full group-hover:bg-purple-700">
                Choisir ce mode
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Vous pourrez changer de mode à tout moment dans les paramètres
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
