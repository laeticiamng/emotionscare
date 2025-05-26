
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Timer, Star, Home } from 'lucide-react';

const GlowMugSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const duration = location.state?.duration || 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Session terminée !</CardTitle>
            <CardDescription>
              Félicitations pour avoir complété votre Glow Mug
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Timer className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold">Durée</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(duration)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-semibold">Points</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  +{Math.floor(duration / 60) * 15}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Bienfaits de cette session
              </h3>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>• Relaxation profonde</li>
                <li>• Réduction de l'anxiété</li>
                <li>• Amélioration de la visualisation</li>
                <li>• Sensation de chaleur apaisante</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/breath/glowmug')}
                className="w-full"
              >
                Refaire une session
              </Button>
              <Button
                onClick={() => navigate('/breath')}
                variant="outline"
                className="w-full"
              >
                Autres exercices
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlowMugSummary;
