
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>EmotionsCare - Votre bien-être émotionnel</title>
        <meta name="description" content="Plateforme de bien-être émotionnel pour particuliers et entreprises" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-5xl font-bold">EmotionsCare</h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto">
              Votre partenaire pour un bien-être émotionnel optimal
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez, analysez et améliorez votre bien-être émotionnel grâce à notre plateforme intelligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/choose-mode">
                <Button size="lg" className="text-lg px-8 py-4">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">
              Nos solutions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* B2C Solution */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Pour les particuliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Une approche personnalisée pour votre bien-être émotionnel quotidien.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Scanner d'émotions en temps réel</li>
                    <li>• Journal personnel guidé</li>
                    <li>• Musique thérapeutique adaptée</li>
                    <li>• Coach IA personnel</li>
                    <li>• Communauté bienveillante</li>
                  </ul>
                  <Link to="/b2c/login" className="block">
                    <Button className="w-full">
                      Découvrir l'espace personnel
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* B2B Solution */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Building className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Pour les entreprises</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Améliorez le bien-être et la productivité de vos équipes.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Tableaux de bord RH avancés</li>
                    <li>• Analyse du climat émotionnel</li>
                    <li>• Suivi des collaborateurs</li>
                    <li>• Rapports détaillés</li>
                    <li>• Solutions préventives</li>
                  </ul>
                  <Link to="/b2b/selection" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Découvrir l'espace entreprise
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white/80">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">
              Prêt à transformer votre bien-être ?
            </h3>
            <p className="text-xl text-gray-600">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie.
            </p>
            <Link to="/choose-mode">
              <Button size="lg" className="text-lg px-8 py-4">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
