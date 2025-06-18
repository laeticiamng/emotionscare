
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building, ArrowRight } from 'lucide-react';

const TestHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel pour une vie plus équilibrée et épanouie
          </p>
          <Link to="/choose-mode">
            <Button size="lg" className="text-lg px-8 py-6">
              Commencer votre parcours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Utilisateur individuel (B2C)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accès personnel à tous les outils de bien-être émotionnel
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Scanner d'émotions</li>
                <li>• Journal personnel</li>
                <li>• Coach virtuel</li>
                <li>• Musicothérapie</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-500" />
                Utilisateur B2B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Outils collaboratifs pour le bien-être en entreprise
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Outils individuels</li>
                <li>• Collaboration d'équipe</li>
                <li>• Cocon social</li>
                <li>• Gamification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-500" />
                Administrateur B2B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestion complète et analytics pour les organisations
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Tableau de bord admin</li>
                <li>• Gestion des équipes</li>
                <li>• Rapports détaillés</li>
                <li>• Événements d'entreprise</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-gray-600 mb-8">
            Choisissez votre mode d'utilisation et commencez votre parcours vers un meilleur équilibre émotionnel
          </p>
          <Link to="/choose-mode">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Choisir mon mode d'utilisation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestHome;
