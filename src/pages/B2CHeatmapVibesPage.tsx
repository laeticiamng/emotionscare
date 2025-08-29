import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Heart, Zap } from 'lucide-react';

const B2CHeatmapVibesPage: React.FC = () => {
  const navigate = useNavigate();

  // Simulate heatmap data
  const heatmapData = Array.from({ length: 7 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => ({
      intensity: Math.floor(Math.random() * 5) + 1,
      mood: ['Excellent', 'Bon', 'Moyen', 'Faible', 'Très faible'][Math.floor(Math.random() * 5)]
    }))
  );

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100',
      'bg-green-100',
      'bg-green-300',
      'bg-green-500',
      'bg-green-700'
    ];
    return colors[intensity - 1] || 'bg-gray-100';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Heatmap des Vibes</h1>
            <p className="text-gray-600">Cartographie de votre bien-être émotionnel</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Carte de Chaleur - 7 Dernières Semaines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-8 w-full rounded ${getIntensityColor(day.intensity)} hover:ring-2 hover:ring-green-300 transition-all cursor-pointer`}
                      title={`Semaine ${weekIndex + 1}, ${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][dayIndex]}: ${day.mood}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Moins d'activité</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-4 h-4 rounded ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>Plus d'activité</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">28</div>
              <div className="text-sm text-gray-600">Jours actifs ce mois</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">15</div>
              <div className="text-sm text-gray-600">Streak actuel (jours)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">Excellent</div>
              <div className="text-sm text-gray-600">Vibes dominantes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CHeatmapVibesPage;