
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building2, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Accueil
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">Choisissez votre espace</h1>
          <p className="text-xl text-muted-foreground">
            EmotionsCare s'adapte à vos besoins personnels ou professionnels
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* B2C Card */}
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-pink-100 rounded-full w-fit">
                <Heart className="h-12 w-12 text-pink-600" />
              </div>
              <CardTitle className="text-2xl">Espace Personnel</CardTitle>
              <CardDescription className="text-lg">
                Pour les particuliers souhaitant améliorer leur bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Journal émotionnel personnel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Scan d'émotion en temps réel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Coach IA personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Musique thérapeutique
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Expériences VR relaxantes
                </li>
              </ul>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate('/b2c/login')}
              >
                Accéder à l'espace personnel
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/b2c/register')}
                  className="text-pink-600"
                >
                  Créer un compte personnel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              <CardDescription className="text-lg">
                Pour les entreprises soucieuses du bien-être de leurs équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Tableaux de bord d'équipe
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Rapports de bien-être organisationnel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gestion des utilisateurs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Analyses et statistiques avancées
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Outils de communication d'équipe
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate('/b2b/selection')}
              >
                Découvrir l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Vous pouvez changer de mode à tout moment depuis votre profil
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
