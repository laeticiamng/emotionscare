
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const AudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guided');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioCategories = [
    { id: 'meditation', name: 'Méditation', count: 12 },
    { id: 'relaxation', name: 'Relaxation', count: 8 },
    { id: 'sleep', name: 'Sommeil', count: 10 },
    { id: 'focus', name: 'Concentration', count: 6 }
  ];
  
  const audioItems = [
    { id: '1', title: 'Méditation guidée pour débutants', duration: '10 min', category: 'meditation', featured: true },
    { id: '2', title: 'Sons de pluie apaisants', duration: '30 min', category: 'relaxation', featured: true },
    { id: '3', title: 'Respiration profonde', duration: '15 min', category: 'meditation', featured: false },
    { id: '4', title: 'Ambiance nocturne', duration: '45 min', category: 'sleep', featured: true },
    { id: '5', title: 'Concentration en pleine conscience', duration: '20 min', category: 'focus', featured: false },
    { id: '6', title: 'Relaxation progressive', duration: '18 min', category: 'relaxation', featured: false }
  ];
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Audiothérapie" 
          description="Explorez des contenus audio thérapeutiques"
          icon={<Headphones className="h-5 w-5" />}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="guided">Méditations guidées</TabsTrigger>
            <TabsTrigger value="ambient">Ambiances sonores</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {audioCategories.map(category => (
              <Card key={category.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} pistes</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <TabsContent value="guided" className="space-y-6">
            <h2 className="text-xl font-semibold">Méditations populaires</h2>
            <div className="space-y-4">
              {audioItems
                .filter(item => item.category === 'meditation' || item.category === 'relaxation')
                .map(audio => (
                <Card key={audio.id}>
                  <div className="flex items-center p-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full mr-4 flex-shrink-0"
                      onClick={togglePlayPause}
                    >
                      {isPlaying && audio.id === '1' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-grow">
                      <h3 className="font-medium">{audio.title}</h3>
                      <p className="text-sm text-muted-foreground">{audio.duration}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ambient" className="space-y-6">
            <h2 className="text-xl font-semibold">Ambiances sonores apaisantes</h2>
            <div className="space-y-4">
              {audioItems
                .filter(item => item.category === 'sleep' || item.category === 'focus')
                .map(audio => (
                <Card key={audio.id}>
                  <div className="flex items-center p-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full mr-4 flex-shrink-0"
                      onClick={togglePlayPause}
                    >
                      {isPlaying && audio.id === '4' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-grow">
                      <h3 className="font-medium">{audio.title}</h3>
                      <p className="text-sm text-muted-foreground">{audio.duration}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Actuellement en lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isPlaying ? (
                <>
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium">Méditation guidée pour débutants</h3>
                      <p className="text-sm text-muted-foreground">10 min</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider defaultValue={[33]} max={100} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3:20</span>
                      <span>10:00</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Slider className="w-24" defaultValue={[80]} max={100} step={1} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                        <Play className="h-4 w-4 ml-0.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Aucune piste en cours de lecture
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AudioPage;
