
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Music, MessageSquare } from 'lucide-react';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre bien-être émotionnel
              <span className="block text-blue-600">reimaginé</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              EmotionsCare combine intelligence artificielle et thérapies innovantes 
              pour vous accompagner vers un équilibre émotionnel optimal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/choose-mode')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Commencer maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/choose-mode')}
              >
                Découvrir nos solutions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Des outils puissants pour votre bien-être
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos modules thérapeutiques innovants
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Brain className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Scanner d'Émotions</CardTitle>
              <CardDescription>
                Analysez vos émotions en temps réel grâce à l'IA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Coach IA</CardTitle>
              <CardDescription>
                Un accompagnement personnalisé 24h/24
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Music className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Musicothérapie</CardTitle>
              <CardDescription>
                Musiques adaptatives selon votre état émotionnel
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Heart className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Journal Personnel</CardTitle>
              <CardDescription>
                Suivez votre évolution émotionnelle dans le temps
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur équilibre émotionnel
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/choose-mode')}
          >
            Commencer gratuitement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
