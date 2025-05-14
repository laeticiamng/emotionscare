import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SunMedium, Cloud, CloudRain, Activity, Music, MessageSquare } from 'lucide-react';

export default function B2CDashboard() {
  // Mock data for demonstration
  const currentMood = {
    emotion: 'calm',
    intensity: 70,
    icon: <Cloud className="h-10 w-10 text-blue-500" />,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bonjour';
    if (hour >= 12 && hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">{getGreeting()}, Utilisateur</h2>
          <p className="text-muted-foreground">Voici votre météo émotionnelle du jour</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex gap-2">
            <Activity className="h-4 w-4" /> Scan express
          </Button>
          <Button size="sm" variant="outline" className="flex gap-2">
            <MessageSquare className="h-4 w-4" /> Parler à mon coach
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Votre état émotionnel
              <span className="text-sm font-normal px-2 py-1 bg-primary/10 rounded-full text-primary">
                Aujourd'hui
              </span>
            </CardTitle>
            <CardDescription>Comment vous sentez-vous par rapport aux jours précédents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 border rounded-xl">
              <div className="text-center">
                {currentMood.icon}
                <h3 className="text-xl font-medium mt-2 capitalize">{currentMood.emotion}</h3>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${currentMood.intensity}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Intensité: {currentMood.intensity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggestions personnalisées</CardTitle>
            <CardDescription>Pour améliorer votre bien-être</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Playlist relaxante
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <SunMedium className="mr-2 h-4 w-4" />
              Exercice de respiration
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CloudRain className="mr-2 h-4 w-4" />
              Méditation guidée
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* More dashboard components would go here */}
    </div>
  );
}
