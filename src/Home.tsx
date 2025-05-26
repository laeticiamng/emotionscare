
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  console.log('Home component rendering successfully');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel avec intelligence artificielle
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">
                Particuliers (B2C)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analyse personnalisée de vos émotions avec recommandations musicales thérapeutiques
              </p>
              <div className="space-y-2">
                <Link to="/b2c/login">
                  <Button className="w-full" variant="default">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/b2c/register">
                  <Button className="w-full" variant="outline">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-green-600">
                Collaborateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Outils de bien-être au travail et suivi de votre santé émotionnelle
              </p>
              <Link to="/b2b/user/login">
                <Button className="w-full" variant="default">
                  Accès Collaborateur
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-purple-600">
                Administrateurs RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tableau de bord pour suivre le bien-être de vos équipes
              </p>
              <Link to="/b2b/admin/login">
                <Button className="w-full" variant="default">
                  Accès Administrateur
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Fonctionnalités principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyse IA</h3>
              <p className="text-gray-600">
                Intelligence artificielle avancée pour analyser vos émotions
              </p>
            </div>
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
              <p className="text-gray-600">
                Playlists personnalisées basées sur votre état émotionnel
              </p>
            </div>
            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi RH</h3>
              <p className="text-gray-600">
                Tableaux de bord pour le bien-être organisationnel
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
