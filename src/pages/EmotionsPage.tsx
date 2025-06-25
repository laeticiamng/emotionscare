
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmotionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/b2c/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="h-8 w-8 text-pink-500" />
              Scan Émotionnel
            </h1>
            <p className="text-gray-600 mt-2">Analysez et comprenez votre état émotionnel</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
              <CardDescription>
                Prenez un moment pour analyser vos émotions actuelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['😊 Joyeux', '😔 Triste', '😰 Anxieux', '😌 Calme', '😡 Colère', '😴 Fatigué', '🤔 Pensif', '😍 Enthousiaste'].map((emotion) => (
                  <Button key={emotion} variant="outline" className="h-16 text-lg">
                    {emotion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique Émotionnel</CardTitle>
              <CardDescription>
                Suivez l'évolution de vos émotions dans le temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vos données d'analyse émotionnelle apparaîtront ici une fois que vous aurez commencé à utiliser le scan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionsPage;
