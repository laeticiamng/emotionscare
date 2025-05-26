
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Info } from 'lucide-react';

const FlowWalkStart: React.FC = () => {
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
            <CardTitle className="text-2xl">Flow Walk</CardTitle>
            <CardDescription>
              Marche méditative avec respiration rythmée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Instructions
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Marchez à un rythme confortable</li>
                    <li>• Synchronisez votre respiration avec vos pas</li>
                    <li>• Inspirez sur 4 pas, expirez sur 4 pas</li>
                    <li>• Concentrez-vous sur le moment présent</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10-15</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">minutes</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Débutant</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">difficulté</div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/breath/flowwalk/live')}
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

export default FlowWalkStart;
