
import React, { useState } from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, MessageCircle, Calendar } from 'lucide-react';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  type: 'workshop' | 'meetup' | 'webinar' | 'challenge';
  image?: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image?: string;
}

const WorldPage: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Atelier Gestion du Stress',
      description: 'Apprenez des techniques efficaces pour gérer votre stress quotidien avec des experts.',
      date: '2023-05-20T14:00:00',
      location: 'Paris',
      participants: 18,
      type: 'workshop',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Atelier+Stress'
    },
    {
      id: '2',
      title: 'Méditation en groupe',
      description: 'Joignez-vous à nous pour une session de méditation guidée en plein air.',
      date: '2023-05-27T10:00:00',
      location: 'Lyon',
      participants: 25,
      type: 'meetup',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Meditation'
    },
    {
      id: '3',
      title: 'Webinaire: L\'intelligence émotionnelle au travail',
      description: 'Explorer comment l\'intelligence émotionnelle peut transformer votre environnement professionnel.',
      date: '2023-06-05T18:30:00',
      location: 'En ligne',
      participants: 112,
      type: 'webinar'
    },
    {
      id: '4',
      title: 'Challenge 30 jours de gratitude',
      description: 'Rejoignez le challenge et pratiquez la gratitude chaque jour pendant 30 jours.',
      date: '2023-06-01T00:00:00',
      location: 'Partout',
      participants: 324,
      type: 'challenge'
    }
  ]);
  
  const [groups, setGroups] = useState<CommunityGroup[]>([
    {
      id: '1',
      name: 'Mindfulness au quotidien',
      description: 'Groupe de partage sur la pratique de la pleine conscience dans la vie de tous les jours.',
      members: 156,
      category: 'mindfulness',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Mindfulness'
    },
    {
      id: '2',
      name: 'Professionnels du bien-être',
      description: 'Réseau de professionnels partageant des ressources et expertises sur le bien-être mental.',
      members: 78,
      category: 'professional',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Professionnels'
    },
    {
      id: '3',
      name: 'Parents conscients',
      description: 'Support pour les parents cherchant à cultiver un environnement émotionnellement sain pour leurs enfants.',
      members: 203,
      category: 'parenting',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Parents'
    },
    {
      id: '4',
      name: 'Créativité et émotions',
      description: 'Explorer le lien entre expression créative et gestion des émotions.',
      members: 94,
      category: 'creativity',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Créativité'
    }
  ]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Monde EmotionsCare</h1>
          <p className="text-muted-foreground mb-6">
            Connectez-vous avec une communauté mondiale dédiée au bien-être émotionnel
          </p>
          
          <Tabs defaultValue="events" className="space-y-8">
            <TabsList>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
              <TabsTrigger value="map">Carte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      {event.image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription className="mt-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(event.date)}
                            </CardDescription>
                            <CardDescription className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p>{event.description}</p>
                        
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Rejoindre</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline">Voir plus d'événements</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="groups">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      {group.image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={group.image} 
                            alt={group.name} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p>{group.description}</p>
                        
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{group.members} membres</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" className="w-1/2 mr-2">
                          <MessageCircle className="h-4 w-4 mr-2" /> Discussions
                        </Button>
                        <Button className="w-1/2 ml-2">Rejoindre</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline">Voir plus de groupes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[2/1] lg:aspect-[3/1] bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="font-semibold text-lg mb-2">Carte interactive</h3>
                      <p className="text-muted-foreground mb-4">
                        Découvrez les événements et groupes près de chez vous sur notre carte interactive.
                      </p>
                      <Button>Explorer la carte</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

export default WorldPage;
