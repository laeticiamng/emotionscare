
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center mb-8">
            <Heart className="h-12 w-12 text-pink-500 mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Votre compagnon intelligent pour le bien-être émotionnel. 
            Analysez, comprenez et améliorez votre état émotionnel avec l'aide de l'IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link to="/choose-mode">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-4">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Découvrez nos solutions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* B2C Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-pink-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-pink-500" />
                <CardTitle className="text-2xl">Usage Personnel</CardTitle>
              </div>
              <CardDescription className="text-base">
                Prenez soin de votre bien-être émotionnel au quotidien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Scan émotionnel par caméra et IA
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Coach personnel intelligent
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Musicothérapie adaptative
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Journal émotionnel
                </li>
              </ul>
              <Link to="/choose-mode">
                <Button className="w-full bg-pink-500 hover:bg-pink-600">
                  Découvrir B2C
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">Solution Entreprise</CardTitle>
              </div>
              <CardDescription className="text-base">
                Améliorez le bien-être de vos équipes et la performance organisationnelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Tableau de bord RH avancé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Analyses d'équipe anonymisées
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Outils collaborateur intégrés
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Rapports de bien-être
                </li>
              </ul>
              <Link to="/choose-mode">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Découvrir B2B
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel avec EmotionsCare.
          </p>
          <Link to="/choose-mode">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Choisir mon mode d'utilisation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
