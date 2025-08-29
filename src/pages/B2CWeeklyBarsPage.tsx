import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from 'lucide-react';

const B2CWeeklyBarsPage: React.FC = () => {
  const navigate = useNavigate();

  const weeklyData = [
    { day: 'Lun', mood: 85, energy: 70, stress: 25 },
    { day: 'Mar', mood: 78, energy: 65, stress: 35 },
    { day: 'Mer', mood: 92, energy: 80, stress: 15 },
    { day: 'Jeu', mood: 88, energy: 75, stress: 20 },
    { day: 'Ven', mood: 95, energy: 90, stress: 10 },
    { day: 'Sam', mood: 90, energy: 85, stress: 15 },
    { day: 'Dim', mood: 87, energy: 80, stress: 18 }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activité Hebdomadaire</h1>
            <p className="text-gray-600">Visualisez vos tendances de bien-être</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Graphique Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4 mb-6">
                {weeklyData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">{data.day}</div>
                    <div className="space-y-2">
                      <div className="bg-green-200 rounded-full mx-auto" style={{ height: `${data.mood}px`, width: '20px' }}>
                        <div className="bg-green-500 rounded-full w-full" style={{ height: `${data.mood}%` }}></div>
                      </div>
                      <div className="text-xs text-green-600">{data.mood}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Humeur</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Énergie</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Stress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">+12%</div>
                <div className="text-sm text-gray-600">Amélioration cette semaine</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">7/7</div>
                <div className="text-sm text-gray-600">Jours d'activité</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <div className="text-sm text-gray-600">Score moyen</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CWeeklyBarsPage;