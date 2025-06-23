
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, Lightbulb, Target } from 'lucide-react';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coach IA Personnel
          </h1>
          <p className="text-xl text-gray-600">
            Votre assistant intelligent pour un bien-être émotionnel optimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-blue-100 rounded-full w-fit">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Chat en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Commencer une conversation</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-green-100 rounded-full w-fit">
                <Lightbulb className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Conseils personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Obtenir des conseils</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-purple-100 rounded-full w-fit">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Objectifs bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Définir des objectifs</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-orange-100 rounded-full w-fit">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Exercices mentaux</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Faire un exercice</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Suggestions du jour</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-800 mb-1">Exercice de respiration</h3>
                <p className="text-sm text-blue-600">Prenez 5 minutes pour une session de respiration guidée</p>
                <Button size="sm" className="mt-2">Commencer</Button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-green-800 mb-1">Pause gratitude</h3>
                <p className="text-sm text-green-600">Notez 3 choses pour lesquelles vous êtes reconnaissant</p>
                <Button size="sm" className="mt-2">Ouvrir le journal</Button>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h3 className="font-semibold text-purple-800 mb-1">Écoute musicale</h3>
                <p className="text-sm text-purple-600">Une playlist relaxante basée sur votre humeur</p>
                <Button size="sm" className="mt-2">Écouter</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Votre progression</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Séances cette semaine</span>
                <span className="text-blue-600 font-bold">7/7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Score de bien-être</span>
                <span className="text-green-600 font-bold">8.2/10</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Objectifs atteints</span>
                <span className="text-purple-600 font-bold">4/5</span>
              </div>
              <Button className="w-full mt-4">Voir les détails</Button>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à discuter avec votre coach ?</h2>
          <p className="text-gray-600 mb-6">
            Notre IA est disponible 24h/24 pour vous accompagner dans votre parcours de bien-être
          </p>
          <Button size="lg" className="mr-4">
            <MessageCircle className="h-5 w-5 mr-2" />
            Démarrer une conversation
          </Button>
          <Link to="/">
            <Button size="lg" variant="outline">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
