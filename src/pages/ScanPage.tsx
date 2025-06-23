
import React from 'react';
import { Camera, Heart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-pink-100 dark:bg-pink-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scan Émotionnel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analysez vos émotions en temps réel
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6">
              <Camera className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Zone de scan - Placez votre visage devant la caméra
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smile className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Énergie</p>
                <p className="font-bold text-green-600">75%</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Focus</p>
                <p className="font-bold text-blue-600">68%</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smile className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Bien-être</p>
                <p className="font-bold text-purple-600">82%</p>
              </div>
            </div>

            <Button className="bg-pink-600 hover:bg-pink-700">
              Démarrer le scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
