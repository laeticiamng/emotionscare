
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
                <Badge className="bg-gold-100 text-gold-800">
                  Série parfaite !
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Meilleur Jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">Mer</div>
                <p className="text-sm text-muted-foreground">Score: 94</p>
                <Badge variant="outline">9 activités</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Graphique Hebdomadaire</CardTitle>
            <CardDescription>Vos scores de bien-être jour par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-64 p-4">
              {weekData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg flex items-end justify-center text-white text-xs font-medium min-w-8"
                    style={{ 
                      height: `${(data.value / maxValue) * 200}px`,
                      width: '40px'
                    }}
                  >
                    {data.value}
                  </div>
                  <span className="text-sm font-medium">{data.day}</span>
                  <Badge variant="outline" className="text-xs">
                    {data.activities} act.
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendances</CardTitle>
              <CardDescription>Analyse de vos patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-accent rounded">
                <span className="text-sm">Milieu de semaine</span>
                <Badge className="bg-green-100 text-green-800">+18%</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent rounded">
                <span className="text-sm">Sessions matinales</span>
                <Badge className="bg-blue-100 text-blue-800">Efficaces</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent rounded">
                <span className="text-sm">Week-end</span>
                <Badge variant="outline">Stable</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objectifs</CardTitle>
              <CardDescription>Progression vers vos cibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score hebdo > 80</span>
                  <span className="text-green-600">✓ Atteint</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>7 jours consécutifs</span>
                  <span className="text-green-600">✓ Atteint</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Activités > 6/jour</span>
                  <span className="text-orange-600">6/7 jours</span>
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
