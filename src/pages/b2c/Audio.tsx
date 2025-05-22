
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Headphones } from 'lucide-react';

const B2CAudioPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audio thérapeutique</h1>
        <p className="text-muted-foreground mt-2">
          Écoutez des sessions audio guidées pour la méditation, la relaxation et le développement personnel.
        </p>
      </div>
      
      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Sessions recommandées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Méditation guidée',
              duration: '15 min',
              type: 'Relaxation'
            },
            {
              title: 'Sommeil réparateur',
              duration: '30 min',
              type: 'Sommeil'
            },
            {
              title: 'Gestion du stress',
              duration: '20 min',
              type: 'Anti-stress'
            }
          ].map((session, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {session.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{session.type}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full flex gap-2 items-center">
                  <Play className="h-4 w-4" />
                  Écouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold pt-4">Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Méditation', icon: <Headphones className="h-5 w-5" /> },
            { name: 'Sommeil', icon: <Headphones className="h-5 w-5" /> },
            { name: 'Anti-stress', icon: <Headphones className="h-5 w-5" /> },
            { name: 'Focus', icon: <Headphones className="h-5 w-5" /> }
          ].map((category, index) => (
            <Button key={index} variant="outline" className="h-auto py-4 flex-col">
              <div className="bg-primary/10 p-2 rounded-full mb-2">
                {category.icon}
              </div>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold pt-4">Récemment écoutés</h2>
        <div className="space-y-2">
          {[
            { title: 'Respiration profonde', duration: '10 min', progress: 80 },
            { title: 'Pleine conscience', duration: '15 min', progress: 100 },
            { title: 'Visualisation positive', duration: '12 min', progress: 50 }
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.duration}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full bg-muted h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${item.progress}%` }} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default B2CAudioPage;
