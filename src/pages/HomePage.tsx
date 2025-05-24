
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Building2, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre plateforme de bien-être émotionnel powered by AI. 
            Analysez vos émotions, obtenez des conseils personnalisés et améliorez votre bien-être mental.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Analyse Émotionnelle</CardTitle>
              <CardDescription>
                IA avancée pour comprendre vos émotions à travers texte, voix et expressions
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Coach Personnel</CardTitle>
              <CardDescription>
                Conseils personnalisés et exercices adaptés à votre état émotionnel
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Communauté</CardTitle>
              <CardDescription>
                Partagez votre parcours avec une communauté bienveillante
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* B2C */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <Heart className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Utilisateur Personnel</CardTitle>
              <CardDescription className="text-lg">
                Commencez votre parcours de bien-être personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-green-600 font-semibold mb-4">✨ 3 jours gratuits</p>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/b2c/register')}
                >
                  Créer un compte personnel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2c/login')}
                >
                  Se connecter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <Building2 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-lg">
                Solutions de bien-être pour vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-blue-600 font-semibold mb-4">🏢 Version Entreprise</p>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/b2b/selection')}
                >
                  Accès Entreprise
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2b/user/register')}
                >
                  Inscription Collaborateur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>© 2024 EmotionsCare. Votre bien-être émotionnel, notre priorité.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
