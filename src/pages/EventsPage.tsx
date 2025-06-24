
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Plus, Users, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const EventsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    duration: '60',
    type: 'workshop',
    maxParticipants: '',
    location: ''
  });

  const events = [
    {
      id: '1',
      title: 'Atelier Gestion du Stress',
      description: 'Techniques de respiration et mindfulness pour gérer le stress au travail',
      date: '2024-01-26',
      time: '14:00',
      duration: 90,
      type: 'workshop',
      participants: 12,
      maxParticipants: 15,
      location: 'Salle de conférence A',
      status: 'confirmed',
      facilitator: 'Dr. Sophie Martin'
    },
    {
      id: '2',
      title: 'Session VR Collective',
      description: 'Expérience de méditation guidée en réalité virtuelle',
      date: '2024-01-28',
      time: '10:30',
      duration: 45,
      type: 'vr-session',
      participants: 8,
      maxParticipants: 10,
      location: 'Espace VR',
      status: 'confirmed',
      facilitator: 'Emma Dubois'
    },
    {
      id: '3',
      title: 'Conférence Bien-être Digital',
      description: 'Les outils numériques au service du bien-être en entreprise',
      date: '2024-01-30',
      time: '16:00',
      duration: 120,
      type: 'conference',
      participants: 45,
      maxParticipants: 50,
      location: 'Auditorium',
      status: 'pending',
      facilitator: 'Marc Leroy'
    },
    {
      id: '4',
      title: 'Défi Équipe Bien-être',
      description: 'Challenge collaboratif de 30 jours pour améliorer le bien-être collectif',
      date: '2024-02-01',
      time: '09:00',
      duration: 60,
      type: 'challenge',
      participants: 28,
      maxParticipants: 30,
      location: 'En ligne',
      status: 'draft',
      facilitator: 'Équipe EmotionsCare'
    }
  ];

  const getEventTypeBadge = (type: string) => {
    const types = {
      workshop: { label: 'Atelier', color: 'bg-blue-100 text-blue-800' },
      'vr-session': { label: 'Session VR', color: 'bg-purple-100 text-purple-800' },
      conference: { label: 'Conférence', color: 'bg-green-100 text-green-800' },
      challenge: { label: 'Défi', color: 'bg-orange-100 text-orange-800' }
    };
    const typeInfo = types[type as keyof typeof types] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statuses = {
      confirmed: { label: 'Confirmé', color: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' }
    };
    const statusInfo = statuses[status as keyof typeof statuses] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const handleCreateEvent = () => {
    console.log('Créer événement:', newEvent);
    setShowCreateEvent(false);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '',
      duration: '60',
      type: 'workshop',
      maxParticipants: '',
      location: ''
    });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <CalendarDays className="w-8 h-8 mr-3" />
              Gestion des Événements
            </h1>
            <p className="text-muted-foreground">Organisez et suivez les activités de bien-être</p>
          </div>
          <Button onClick={() => setShowCreateEvent(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{events.filter(e => e.status === 'confirmed').length}</p>
                <p className="text-sm text-muted-foreground">Événements confirmés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{events.reduce((acc, e) => acc + e.participants, 0)}</p>
                <p className="text-sm text-muted-foreground">Participants inscrits</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{events.filter(e => e.type === 'vr-session').length}</p>
                <p className="text-sm text-muted-foreground">Sessions VR</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{events.filter(e => e.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste des événements</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Formulaire de création d'événement */}
            {showCreateEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Créer un nouvel événement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Titre</label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Nom de l'événement"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workshop">Atelier</SelectItem>
                          <SelectItem value="vr-session">Session VR</SelectItem>
                          <SelectItem value="conference">Conférence</SelectItem>
                          <SelectItem value="challenge">Défi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {newEvent.date ? format(newEvent.date, 'dd/MM/yyyy') : 'Sélectionner'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newEvent.date}
                            onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Heure</label>
                      <Input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Durée (minutes)</label>
                      <Input
                        type="number"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                        placeholder="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Participants max</label>
                      <Input
                        type="number"
                        value={newEvent.maxParticipants}
                        onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                        placeholder="20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lieu</label>
                    <Input
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Salle de conférence, En ligne, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Description de l'événement..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateEvent}>Créer l'événement</Button>
                    <Button variant="outline" onClick={() => setShowCreateEvent(false)}>Annuler</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des événements */}
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          {getEventTypeBadge(event.type)}
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <p className="text-muted-foreground">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{event.time} ({event.duration}min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{event.participants}/{event.maxParticipants} participants</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Animé par: {event.facilitator}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participation par type d'événement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique à implémenter avec Recharts
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des inscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Courbe d'évolution à implémenter avec Recharts
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventsPage;
