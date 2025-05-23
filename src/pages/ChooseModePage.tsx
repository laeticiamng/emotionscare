
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building, ArrowLeft, Brain, Heart, Users } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-4xl font-bold">Choisissez votre mode d'accès</h1>
          <p className="text-muted-foreground text-lg">
            Sélectionnez le mode qui correspond le mieux à vos besoins
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* B2C Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Particulier</CardTitle>
              <CardDescription className="text-base">
                Accès personnel pour améliorer votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Fonctionnalités incluses :
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li>• Scanner émotionnel personnel</li>
                  <li>• Coach IA 24h/24</li>
                  <li>• Musicothérapie adaptée</li>
                  <li>• Journal de bord émotionnel</li>
                  <li>• Suivi de progression</li>
                  <li>• Objectifs personnalisés</li>
                </ul>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full text-lg py-6" 
                  onClick={() => navigate('/b2c/login')}
                >
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-lg py-6"
                  onClick={() => navigate('/b2c/register')}
                >
                  Créer un compte
                </Button>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  🎉 3 jours d'essai gratuit
                </p>
                <p className="text-xs text-green-600">
                  Aucune carte de crédit requise
                </p>
              </div>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <Building className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-base">
                Solutions professionnelles pour organisations et équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Fonctionnalités avancées :
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li>• Gestion d'équipes</li>
                  <li>• Tableau de bord RH</li>
                  <li>• Analytics organisationnels</li>
                  <li>• Rapports de bien-être</li>
                  <li>• Prévention du burnout</li>
                  <li>• Support premium</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full text-lg py-6" 
                  onClick={() => navigate('/b2b/selection')}
                >
                  Accès Entreprise
                </Button>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  💼 Démo personnalisée
                </p>
                <p className="text-xs text-purple-600">
                  Contactez notre équipe commerciale
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Toutes nos solutions incluent
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span>IA avancée</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Données sécurisées</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-500" />
              <span>Mises à jour</span>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="text-center">
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
