
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Heart, Music, Play, Search, Sparkles, Wand2 } from 'lucide-react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Données simulées pour les playlists
const musicData = {
  recommended: [
    {
      id: '1',
      title: 'Méditation matinale',
      description: 'Sons apaisants pour commencer la journée en pleine conscience',
      category: 'Méditation',
      duration: '15 min',
      plays: 1200,
      image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=300&h=300&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Concentration profonde',
      description: 'Musique ambiante pour améliorer la concentration',
      category: 'Productivité',
      duration: '45 min',
      plays: 2500,
      image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=300&h=300&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Sérénité nocturne',
      description: 'Sons apaisants pour faciliter l\'endormissement',
      category: 'Sommeil',
      duration: '30 min',
      plays: 3700,
      image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=300&h=300&auto=format&fit=crop'
    },
    {
      id: '4',
      title: 'Énergie positive',
      description: 'Mélodies rythmées pour se dynamiser',
      category: 'Énergie',
      duration: '20 min',
      plays: 950,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&auto=format&fit=crop'
    }
  ],
  categories: ['Méditation', 'Sommeil', 'Productivité', 'Énergie', 'Anti-stress', 'Spiritualité']
};

const MusicPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moodSlider, setMoodSlider] = useState([50]);
  const [energySlider, setEnergySlider] = useState([30]);
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bibliothèque musicale</h1>
              <p className="text-muted-foreground">
                Découvrez des compositions musicales conçues pour votre bien-être émotionnel
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="flex items-center gap-2" variant="default">
                    <Wand2 size={16} />
                    Composition personnalisée
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Créez une composition musicale basée sur votre état émotionnel actuel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des compositions musicales..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="recommended" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Recommandées
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Par humeur
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Mes favoris
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {musicData.recommended.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="w-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                        <Button 
                          size="icon"
                          variant="secondary"
                          className="absolute right-3 bottom-3 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        >
                          <Heart size={18} className="text-primary" />
                        </Button>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-normal">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.duration}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button asChild className="w-full gap-2">
                          <Link to={`/music/player/${item.id}`}>
                            <Play size={16} />
                            Écouter
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mood">
              <Card>
                <CardHeader>
                  <CardTitle>Trouvez de la musique adaptée à votre humeur</CardTitle>
                  <CardDescription>
                    Ajustez les curseurs pour découvrir des compositions musicales qui correspondent à votre état émotionnel actuel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Humeur</Label>
                        <span className="text-sm text-muted-foreground">
                          {moodSlider[0] < 33 ? 'Calme' : moodSlider[0] < 66 ? 'Équilibrée' : 'Joyeuse'}
                        </span>
                      </div>
                      <Slider
                        value={moodSlider}
                        onValueChange={setMoodSlider}
                        max={100}
                        step={1}
                        className="mb-6"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Énergie</Label>
                        <span className="text-sm text-muted-foreground">
                          {energySlider[0] < 33 ? 'Relaxante' : energySlider[0] < 66 ? 'Modérée' : 'Stimulante'}
                        </span>
                      </div>
                      <Slider
                        value={energySlider}
                        onValueChange={setEnergySlider}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full">Générer des recommandations</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Catégories populaires</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {musicData.categories.map((category, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start gap-2 h-auto py-4"
                    >
                      <Music size={16} />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun favori pour le moment</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Explorez notre bibliothèque et ajoutez des compositions à vos favoris pour y accéder rapidement.
                </p>
                <Button asChild variant="outline">
                  <Link to="/music/player/1">
                    Découvrir des compositions
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

// Helper component for the Label
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </div>
);

export default MusicPage;
