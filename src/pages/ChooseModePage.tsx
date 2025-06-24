
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowRight } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre mode d'utilisation
          </h1>
          <p className="text-xl text-gray-600">
            EmotionsCare s'adapte à vos besoins personnels ou professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/b2c/login')}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-pink-600" />
              </div>
              <CardTitle className="text-2xl">Mode Personnel (B2C)</CardTitle>
              <CardDescription className="text-lg">
                Prenez soin de votre bien-être émotionnel personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <p>✨ Coach IA personnalisé</p>
                <p>📊 Suivi émotionnel personnel</p>
                <p>🎵 Musicothérapie adaptative</p>
                <p>📖 Journal intime sécurisé</p>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Commencer en mode personnel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/b2b/selection')}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Mode Entreprise (B2B)</CardTitle>
              <CardDescription className="text-lg">
                Gérez le bien-être de vos équipes et collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <p>👥 Gestion d'équipes</p>
                <p>📈 Analytics et rapports</p>
                <p>🛡️ Administration sécurisée</p>
                <p>🤝 Collaboration en équipe</p>
              </div>
              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                Continuer en mode entreprise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
