
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building, ArrowLeft, Brain, Users } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const selectB2C = () => {
    setUserMode('b2c');
    navigate('/b2c/login');
  };

  const selectB2B = () => {
    navigate('/b2b/selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-3xl font-bold">Comment souhaitez-vous utiliser EmotionsCare ?</h1>
          <p className="text-muted-foreground text-lg">
            Choisissez le mode qui correspond à vos besoins
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* B2C Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-xl">Usage Personnel</CardTitle>
              <CardDescription>
                Pour votre bien-être émotionnel personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Idéal pour :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gestion du stress et de l'anxiété</li>
                  <li>• Amélioration de l'humeur</li>
                  <li>• Développement personnel</li>
                  <li>• Suivi émotionnel quotidien</li>
                  <li>• Coaching IA personnalisé</li>
                </ul>
              </div>
              
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-pink-800 text-xs font-medium">
                  🎁 3 jours d'essai gratuit inclus
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={selectB2C}
              >
                Commencer mon parcours personnel
              </Button>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Usage Professionnel</CardTitle>
              <CardDescription>
                Pour votre entreprise et vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Idéal pour :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bien-être des équipes</li>
                  <li>• Prévention du burn-out</li>
                  <li>• Amélioration de la productivité</li>
                  <li>• Tableaux de bord RH</li>
                  <li>• Analyses organisationnelles</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-xs font-medium">
                  🏢 Solutions personnalisées sur mesure
                </p>
              </div>
              
              <Button 
                variant="outline"
                className="w-full" 
                onClick={selectB2B}
              >
                Explorer les solutions entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <Users className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Vous hésitez ? Nos conseillers sont là pour vous guider vers la meilleure solution.
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mt-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
