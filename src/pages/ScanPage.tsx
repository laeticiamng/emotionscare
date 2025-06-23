
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Camera, Mic, Brain } from 'lucide-react';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scanner Émotionnel
          </h1>
          <p className="text-xl text-gray-600">
            Analysez votre état émotionnel en temps réel avec nos outils avancés
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Scan Facial</CardTitle>
              <CardDescription>
                Analyse des micro-expressions faciales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Notre IA analyse vos expressions pour détecter votre état émotionnel actuel.
              </p>
              <Button className="w-full">Démarrer le scan facial</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <Mic className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Analyse Vocale</CardTitle>
              <CardDescription>
                Détection des émotions par la voix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Analysez le ton, le rythme et les inflexions de votre voix pour identifier vos émotions.
              </p>
              <Button className="w-full">Démarrer l'analyse vocale</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Scan Complet</CardTitle>
              <CardDescription>
                Analyse multimodale complète
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Combinaison de tous nos outils pour une analyse émotionnelle complète et précise.
              </p>
              <Button className="w-full">Scan complet</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Derniers résultats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">État émotionnel actuel</h3>
              <p className="text-blue-600">Calme et concentré (85%)</p>
              <p className="text-sm text-gray-600 mt-2">Basé sur votre dernier scan facial</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Tendance de la semaine</h3>
              <p className="text-green-600">Amélioration constante (+12%)</p>
              <p className="text-sm text-gray-600 mt-2">Votre bien-être progresse positivement</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
