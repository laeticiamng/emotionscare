
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Building2, Users, Shield, ArrowLeft } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleModeSelection = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    
    switch (mode) {
      case 'b2c':
        navigate('/b2c/login');
        break;
      case 'b2b_user':
        navigate('/b2b/user/login');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/login');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">EmotionsCare</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choisissez votre espace</h1>
            <p className="text-lg text-muted-foreground">
              Sélectionnez l'espace qui correspond à votre profil pour accéder 
              aux fonctionnalités adaptées à vos besoins.
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* B2C Card */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Espace Particulier</CardTitle>
                <CardDescription className="text-base">
                  Suivi personnalisé de votre bien-être émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Analyse émotionnelle quotidienne
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Recommandations personnalisées
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Outils de méditation et relaxation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Journal émotionnel privé
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6" 
                  onClick={() => handleModeSelection('b2c')}
                >
                  Accéder à mon espace
                </Button>
              </CardContent>
            </Card>

            {/* B2B Selection Card */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Espace Professionnel</CardTitle>
                <CardDescription className="text-base">
                  Bien-être en entreprise et gestion d'équipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Choisissez votre rôle professionnel :
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleModeSelection('b2b_user')}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Collaborateur</div>
                      <div className="text-xs text-muted-foreground">
                        Accès aux outils de bien-être d'équipe
                      </div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleModeSelection('b2b_admin')}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Administrateur RH</div>
                      <div className="text-xs text-muted-foreground">
                        Gestion et analytiques d'équipe
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Besoin d'aide pour choisir ? Contactez notre équipe support.
            </p>
            <Button variant="ghost" onClick={() => navigate('/help')}>
              Obtenir de l'aide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
