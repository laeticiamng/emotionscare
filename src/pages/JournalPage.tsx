
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-yellow-600" />
            Journal de Bien-être
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Suivez votre évolution émotionnelle au quotidien
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nouvelle entrée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Écrire maintenant</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Voir mes entrées</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Analyser ma progression</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mes dernières entrées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Journée du {new Date().toLocaleDateString()}</h4>
                      <span className="text-sm text-gray-500">Il y a {i + 1} jour{i > 0 ? 's' : ''}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Aperçu de l'entrée du journal...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="ghost">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
