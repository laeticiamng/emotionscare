
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Info } from 'lucide-react';

const GlowMugStart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/breath')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux exercices
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Glow Mug</CardTitle>
            <CardDescription>
              Exercice de respiration avec visualisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Instructions
                  </h3>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Tenez une tasse chaude entre vos mains</li>
                    <li>• Inspirez lentement en sentant la chaleur</li>
                    <li>• Visualisez la lumière dorée qui se répand</li>
                    <li>• Expirez en relâchant toute tension</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5-10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">minutes</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Facile</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">difficulté</div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/breath/glowmug/live')}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Commencer la session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlowMugStart;
