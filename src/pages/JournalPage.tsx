
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Edit3, TrendingUp, Calendar } from 'lucide-react';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Journal Émotionnel
          </h1>
          <p className="text-xl text-gray-600">
            Suivez et analysez votre évolution émotionnelle au quotidien
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-blue-100 rounded-full w-fit">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Nouvelle entrée</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Écrire</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-green-100 rounded-full w-fit">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Lire mes entrées</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Parcourir</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-purple-100 rounded-full w-fit">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Voir les tendances</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 bg-orange-100 rounded-full w-fit">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Vue mensuelle</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Entrées récentes</CardTitle>
              <CardDescription>Vos dernières réflexions et émotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-800">Journée productive</h3>
                  <span className="text-sm text-gray-500">Aujourd'hui</span>
                </div>
                <p className="text-blue-600 text-sm">
                  J'ai eu une excellente journée au travail. Je me sens épanoui et motivé...
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Joie</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Motivation</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-green-800">Moment de gratitude</h3>
                  <span className="text-sm text-gray-500">Hier</span>
                </div>
                <p className="text-green-600 text-sm">
                  Reconnaissant pour le soutien de ma famille et les petits plaisirs du quotidien...
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Gratitude</span>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Sérénité</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-purple-800">Réflexion du weekend</h3>
                  <span className="text-sm text-gray-500">Il y a 2 jours</span>
                </div>
                <p className="text-purple-600 text-sm">
                  Le weekend m'a permis de me recentrer et de réfléchir à mes objectifs...
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Réflexion</span>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Clarté</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Votre activité journalière</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">28</div>
                <div className="text-sm text-gray-600">Entrées ce mois</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">7.8</div>
                <div className="text-sm text-gray-600">Score bien-être moyen</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">Jours consécutifs</div>
              </div>

              <Button className="w-full mt-4">Voir tous les détails</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Commencez votre entrée du jour</h2>
          <p className="text-gray-600 mb-6">
            Prenez quelques minutes pour noter vos pensées et émotions
          </p>
          <Button size="lg" className="mr-4">
            <Edit3 className="h-5 w-5 mr-2" />
            Nouvelle entrée
          </Button>
          <Link to="/">
            <Button size="lg" variant="outline">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
