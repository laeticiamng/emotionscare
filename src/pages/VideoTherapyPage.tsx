
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Video, Play, Bookmark, ThumbsUp, Clock, Share2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  date: string;
  category: string;
}

const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Méditation guidée pour l\'anxiété',
    description: 'Une séance de méditation de 10 minutes pour gérer l\'anxiété et retrouver votre calme.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500',
    duration: '10:15',
    views: 1250,
    likes: 342,
    date: '2023-05-15',
    category: 'meditation'
  },
  {
    id: '2',
    title: 'Exercice de respiration profonde',
    description: 'Apprenez la technique de respiration 4-7-8 pour vous aider à vous détendre rapidement.',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500',
    duration: '7:22',
    views: 980,
    likes: 267,
    date: '2023-05-10',
    category: 'breathing'
  },
  {
    id: '3',
    title: 'Relaxation musculaire progressive',
    description: 'Un guide complet pour la relaxation musculaire progressive pour réduire le stress.',
    thumbnail: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?q=80&w=500',
    duration: '15:40',
    views: 756,
    likes: 198,
    date: '2023-05-05',
    category: 'relaxation'
  }
];

const VideoTherapyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Thérapie Vidéo"
          description="Découvrez des vidéos thérapeutiques pour améliorer votre bien-être"
          icon={<Video className="h-5 w-5" />}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b bg-transparent p-0 h-auto">
            <div className="flex overflow-x-auto pb-1">
              <TabsTrigger
                value="recommended"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Recommandés
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Récents
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-2"
              >
                Sauvegardés
              </TabsTrigger>
            </div>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1.5 py-0.5 text-xs rounded">
                      {video.duration}
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{video.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="grid place-items-center h-40">
              <p className="text-muted-foreground">Aucune vidéo récente à afficher.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <div className="grid place-items-center h-40">
              <p className="text-muted-foreground">Aucune vidéo sauvegardée.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VideoTherapyPage;
