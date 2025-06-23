
import React from 'react';
import { MessageCircle, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-purple-100 dark:bg-purple-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Coach Virtuel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Votre accompagnateur bien-être personnalisé
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 h-12 w-12 rounded-full flex items-center justify-center mr-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Bonjour ! 👋</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comment vous sentez-vous aujourd'hui ?
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-purple-800 dark:text-purple-200">
                "Basé sur votre dernier scan, je recommande une petite séance de méditation de 5 minutes."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 h-12">
                💪 Continuez sur cette lancée !
              </Button>
              <Button variant="outline" className="h-12">
                🧘 Une petite méditation ?
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Tapez votre message..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
              <Button size="icon" className="bg-purple-600 hover:bg-purple-700">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
