
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, Trophy } from 'lucide-react';

const WeeklyBarsPage: React.FC = () => {
  const weekData = [
    { day: 'Lun', value: 85, activities: 7 },
    { day: 'Mar', value: 72, activities: 5 },
    { day: 'Mer', value: 94, activities: 9 },
    { day: 'Jeu', value: 67, activities: 4 },
    { day: 'Ven', value: 89, activities: 8 },
    { day: 'Sam', value: 76, activities: 6 },
    { day: 'Dim', value: 82, activities: 7 }
  ];

  const maxValue = Math.max(...weekData.map(d => d.value));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weekly Bars</h1>
          <p className="text-muted-foreground">Visualisation hebdomadaire de votre progression</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cette Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">81.4</div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +7% vs sem. dernière
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Régularité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">7/7</div>
                <p className="text-sm text-muted-foreground">Jours actifs</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Parfait!
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">94</div>
                <p className="text-sm text-muted-foreground">Meilleur score</p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Mercredi
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progression Hebdomadaire</CardTitle>
            <CardDescription>
              Barres interactives montrant votre évolution jour par jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">{day.value}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(day.value / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{day.activities} activités</span>
                    <span>{day.value}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objectifs de la Semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score hebdo &gt; 80</span>
                  <span className="text-green-600">✓ Atteint</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Activités &gt; 6/jour</span>
                  <span className="text-orange-600">6/7 jours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendance Mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">↗ +12%</div>
                <p className="text-sm text-muted-foreground">
                  Amélioration constante ce mois-ci
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Semaine 1</span>
                    <span>72.3</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Semaine 2</span>
                    <span>78.1</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Semaine 3</span>
                    <span>81.4</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBarsPage;
