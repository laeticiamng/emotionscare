
import React from 'react';
import { BookOpen, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-orange-100 dark:bg-orange-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Journal Personnel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Suivez votre parcours émotionnel au quotidien
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Nouvelle entrée</h2>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Edit className="h-4 w-4 mr-2" />
              Écrire
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="font-medium">Aujourd'hui</span>
                </div>
                <span className="text-sm text-gray-500">15:30</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Excellente journée ! J'ai pu terminer tous mes projets et je me sens vraiment accompli..."
              </p>
              <div className="flex space-x-2 mt-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">😊 Joyeux</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">💪 Motivé</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Hier</span>
                </div>
                <span className="text-sm text-gray-500">20:15</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Journée un peu difficile, mais la séance de méditation m'a beaucoup aidé à me recentrer..."
              </p>
              <div className="flex space-x-2 mt-3">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">😐 Neutre</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">🧘 Calme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
