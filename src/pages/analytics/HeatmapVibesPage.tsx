
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Thermometer, Filter } from 'lucide-react';

const HeatmapVibesPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Génération de données heatmap simulées
  const generateHeatmapData = () => {
    const data = [];
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          week,
          day,
          value: Math.floor(Math.random() * 100),
          date: new Date(2024, 5, week * 7 + day + 1).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getIntensityColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-green-400';
    if (value >= 40) return 'bg-yellow-400';
    if (value >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getIntensityLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Bon';
    if (value >= 40) return 'Moyen';
    if (value >= 20) return 'Faible';
    return 'Critique';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Heatmap Vibes</h1>
          <p className="text-muted-foreground">Carte thermique de votre bien-être émotionnel</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            Ce mois
          </Button>
          <Button 
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Trimestre
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
          >
            Année
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Carte de Chaleur Émotionnelle
                </CardTitle>
                <CardDescription>Intensité de votre bien-être par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Jours de la semaine header */}
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    <div></div> {/* Espace pour les semaines */}
                    {dayLabels.map((day) => (
                      <div key={day} className="text-xs text-center text-muted-foreground p-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Grille heatmap */}
                  {[0, 1, 2, 3].map((week) => (
                    <div key={week} className="grid grid-cols-8 gap-1">
                      <div className="text-xs text-muted-foreground p-1 text-right">
                        S{week + 1}
                      </div>
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                        const dataPoint = heatmapData.find(d => d.week === week && d.day === day);
                        return (
                          <div
                            key={`${week}-${day}`}
                            className={`h-8 w-8 rounded ${getIntensityColor(dataPoint?.value || 0)} flex items-center justify-center cursor-pointer transition-all hover:scale-110`}
                            title={`${dataPoint?.date}: ${dataPoint?.value}% - ${getIntensityLabel(dataPoint?.value || 0)}`}
                          >
                            <span className="text-xs text-white font-medium">
                              {dataPoint?.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                
                {/* Légende */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Moins intense</span>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded bg-red-400"></div>
                    <div className="h-3 w-3 rounded bg-orange-400"></div>
                    <div className="h-3 w-3 rounded bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded bg-green-400"></div>
                    <div className="h-3 w-3 rounded bg-green-500"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Plus intense</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">73.2</p>
                  <p className="text-xs text-muted-foreground">Score moyen</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">18</p>
                  <p className="text-xs text-muted-foreground">Jours excellents</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">2</p>
                  <p className="text-xs text-muted-foreground">Jours difficiles</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Patterns Détectés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm font-medium">Lundi Boost</p>
                  <p className="text-xs text-muted-foreground">Excellents débuts de semaine</p>
                </div>
                
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="text-sm font-medium">Mercredi Peak</p>
                  <p className="text-xs text-muted-foreground">Pic de performance milieu de semaine</p>
                </div>
                
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <p className="text-sm font-medium">Weekend Stable</p>
                  <p className="text-xs text-muted-foreground">Régularité les week-ends</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVibesPage;
