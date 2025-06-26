
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Plus, MapPin, Bell, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventsPage: React.FC = () => {
  const { toast } = useToast();

  const upcomingEvents = [
    {
      id: 1,
      title: "Session de Méditation Collective",
      description: "Méditation guidée pour réduire le stress",
      date: "2024-02-15",
      time: "12:30 - 13:00",
      location: "Salle de repos - Étage 2",
      attendees: 12,
      maxAttendees: 20,
      category: "Bien-être",
      instructor: "Dr. Sophie Martin",
      registered: true
    },
    {
      id: 2,
      title: "Formation Gestion du Stress",
      description: "Techniques pratiques pour gérer le stress au travail",
      date: "2024-02-18",
      time: "14:00 - 16:00",
      location: "Salle de formation A",
      attendees: 8,
      maxAttendees: 15,
      category: "Formation",
      instructor: "Marc Leblanc - Coach",
      registered: false
    },
    {
      id: 3,
      title: "Atelier Team Building",
      description: "Renforcement de la cohésion d'équipe",
      date: "2024-02-22",
      time: "09:00 - 17:00",
      location: "Centre de séminaires",
      attendees: 24,
      maxAttendees: 30,
      category: "Team Building",
      instructor: "Équipe RH",
      registered: true
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "Conférence Burn-out Prevention",
      description: "Prévention et reconnaissance du burn-out",
      date: "2024-01-25",
      time: "10:00 - 12:00",
      attendees: 45,
      rating: 4.8,
      feedback: "Très informatif et pratique",
      category: "Conférence"
    },
    {
      id: 5,
      title: "Yoga du Matin",
      description: "Session de yoga pour bien commencer la journée",
      date: "2024-01-22",
      time: "07:30 - 08:15",
      attendees: 18,
      rating: 4.6,
      feedback: "Excellent pour l'énergie matinale",
      category: "Bien-être"
    }
  ];

  const eventCategories = [
    { name: "Bien-être", color: "bg-green-100 text-green-800", count: 12 },
    { name: "Formation", color: "bg-blue-100 text-blue-800", count: 8 },
    { name: "Team Building", color: "bg-purple-100 text-purple-800", count: 5 },
    { name: "Conférence", color: "bg-orange-100 text-orange-800", count: 7 },
    { name: "Soutien", color: "bg-pink-100 text-pink-800", count: 4 }
  ];

  const stats = {
    totalEvents: 36,
    avgAttendance: 18.5,
    avgRating: 4.7,
    upcomingEvents: 15,
    yourRegistrations: 3
  };

  const registerForEvent = (eventId: number) => {
    toast({
      title: "Inscription confirmée !",
      description: "Vous recevrez un rappel 24h avant l'événement.",
    });
  };

  const unregisterFromEvent = (eventId: number) => {
    toast({
      title: "Désinscription effectuée",
      description: "Vous ne participerez plus à cet événement.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Événements Bien-être</h1>
          <p className="text-gray-600">Participez aux activités de développement personnel et bien-être</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalEvents}</div>
              <p className="text-sm text-gray-600">Événements organisés</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.avgAttendance}</div>
              <p className="text-sm text-gray-600">Participation moyenne</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-1" />
                <span className="text-3xl font-bold text-yellow-600">{stats.avgRating}</span>
              </div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.upcomingEvents}</div>
              <p className="text-sm text-gray-600">À venir</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.yourRegistrations}</div>
              <p className="text-sm text-gray-600">Vos inscriptions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Événements passés</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="create">Organiser</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Événements à venir</h2>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Configurer rappels
              </Button>
            </div>

            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="text-center">
                        <div className="bg-indigo-100 rounded-lg p-3 mb-2">
                          <Calendar className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="text-sm font-medium">{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <Badge className={eventCategories.find(cat => cat.name === event.category)?.color}>
                              {event.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            {event.registered ? (
                              <Button variant="outline" onClick={() => unregisterFromEvent(event.id)}>
                                Se désinscrire
                              </Button>
                            ) : (
                              <Button onClick={() => registerForEvent(event.id)}>
                                S'inscrire
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{event.attendees}/{event.maxAttendees} participants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Animé par {event.instructor}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <h2 className="text-2xl font-bold">Événements passés</h2>

            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-lg p-3 mb-2">
                          <Calendar className="h-8 w-8 text-gray-600" />
                        </div>
                        <div className="text-sm font-medium">{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <Badge variant="secondary">{event.category}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{event.rating}</span>
                            </div>
                            <div className="text-sm text-gray-500">{event.attendees} participants</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm">
                            <span className="font-medium">Feedback: </span>
                            <span className="text-gray-600">"{event.feedback}"</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-2xl font-bold">Catégories d'événements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventCategories.map((category, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Badge className={`${category.color} text-lg px-4 py-2`}>
                        {category.name}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{category.count}</div>
                    <p className="text-sm text-gray-600">événements organisés</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Voir tous
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Organiser un Nouvel Événement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Organisez votre événement</h3>
                  <p className="text-gray-600 mb-4">
                    Créez des événements de bien-être pour votre équipe
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Démarrer la création
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">💡 Idées d'événements populaires</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sessions de méditation</li>
                      <li>• Ateliers de gestion du stress</li>
                      <li>• Cours de yoga</li>
                      <li>• Conférences bien-être</li>
                      <li>• Team building créatif</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📋 Checklist organisateur</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Définir l'objectif</li>
                      <li>• Choisir la date et lieu</li>
                      <li>• Sélectionner l'animateur</li>
                      <li>• Communiquer l'événement</li>
                      <li>• Préparer le matériel</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventsPage;
