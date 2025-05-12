
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoIcon, Play, Clock, Star, BookmarkIcon, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Données de démonstration pour les vidéos
const featuredVideos = [
  {
    id: '1',
    title: 'Gestion du stress par la respiration',
    thumbnail: 'https://i.imgur.com/ZaHJCF0.jpg',
    duration: '15:20',
    category: 'stress',
    coach: 'Dr. Sophie Martin'
  },
  {
    id: '2',
    title: 'Méditation guidée pour l\'anxiété',
    thumbnail: 'https://i.imgur.com/krLEpnR.jpg',
    duration: '22:45',
    category: 'anxiété',
    coach: 'Marc Dubois'
  },
  {
    id: '3',
    title: 'Exercices de pleine conscience',
    thumbnail: 'https://i.imgur.com/7TlJPm1.jpg',
    duration: '18:30',
    category: 'méditation',
    coach: 'Léa Bernard'
  }
];

const recentVideos = [
  {
    id: '4',
    title: 'Technique de relaxation musculaire progressive',
    thumbnail: 'https://i.imgur.com/NmCHkwW.jpg',
    duration: '12:10',
    category: 'relaxation',
    coach: 'Pierre Lefèvre'
  },
  {
    id: '5',
    title: 'Communication non-violente au quotidien',
    thumbnail: 'https://i.imgur.com/wsYnbRX.jpg',
    duration: '28:15',
    category: 'communication',
    coach: 'Nathalie Klein'
  },
  {
    id: '6',
    title: 'Améliorer son sommeil naturellement',
    thumbnail: 'https://i.imgur.com/RYG3hkA.jpg',
    duration: '20:40',
    category: 'sommeil',
    coach: 'Dr. Thomas Leroux'
  }
];

const VideoTherapyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Vidéothérapie" 
          description="Découvrez des vidéos thérapeutiques pour améliorer votre bien-être"
          icon={<VideoIcon className="h-5 w-5" />}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="featured">À la une</TabsTrigger>
            <TabsTrigger value="recent">Récents</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center py-8">
              <VideoIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">Pas encore de favoris</h3>
              <p className="text-muted-foreground mt-2">
                Ajoutez des vidéos à vos favoris pour les retrouver facilement ici.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Catégories populaires</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Méditation</Badge>
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Anxiété</Badge>
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Sommeil</Badge>
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Gestion du stress</Badge>
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Relaxation</Badge>
            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">Pleine conscience</Badge>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    category: string;
    coach: string;
  };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Image placeholder - dans une application réelle, utilisez une vraie image */}
        <div 
          className="w-full h-48 bg-muted bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${video.thumbnail})`,
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white">
              <Play className="h-6 w-6 ml-1" />
            </Button>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {video.duration}
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg">{video.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between">
          <Badge variant="secondary">{video.category}</Badge>
          <span className="text-sm text-muted-foreground">{video.coach}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Star className="h-4 w-4 mr-1" />
            Favoris
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="h-4 w-4 mr-1" />
            Partager
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoTherapyPage;
