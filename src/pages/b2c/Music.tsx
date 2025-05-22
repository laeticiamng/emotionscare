
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, Volume } from 'lucide-react';

const B2CMusicPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thérapie Musicale</h1>
        <p className="text-muted-foreground mt-2">
          Écoutez des playlists adaptées à vos émotions et à votre état d'esprit.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Relaxation profonde',
            description: 'Mélodies apaisantes pour réduire l\'anxiété',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format'
          },
          {
            title: 'Concentration',
            description: 'Musique instrumentale pour améliorer la concentration',
            image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format'
          },
          {
            title: 'Méditation guidée',
            description: 'Sessions de méditation avec narration',
            image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=200&auto=format'
          },
          {
            title: 'Énergisant',
            description: 'Rythmes dynamiques pour retrouver de l\'énergie',
            image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=200&auto=format'
          },
          {
            title: 'Sommeil profond',
            description: 'Sons ambiants pour favoriser l\'endormissement',
            image: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?q=80&w=200&auto=format'
          },
          {
            title: 'Pensée positive',
            description: 'Mélodies inspirantes pour une humeur positive',
            image: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=200&auto=format'
          }
        ].map((playlist, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img 
                src={playlist.image} 
                alt={playlist.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{playlist.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {playlist.description}
              </p>
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
      
      <Card className="fixed bottom-0 left-0 right-0 mx-4 mb-4 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format" 
                  alt="Relaxation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">Relaxation profonde</p>
                <p className="text-xs text-muted-foreground">Piste 3 - Océan calme</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="rounded-full">
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CMusicPage;
