// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Users, 
  MapPin, 
  Clock,
  Zap,
  Star,
  Edit,
  Trash,
  Share
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EventsPageEnhanced = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    type: 'workshop',
    maxParticipants: 50,
    isPublic: true
  });

  // Données simulées pour les événements
  const mockEvents = [
    {
      id: 1,
      title: 'Atelier Mindfulness Matinal',
      description: 'Session de méditation guidée pour commencer la journée en pleine conscience',
      date: '2024-02-20',
      time: '09:00',
      duration: 45,
      location: 'Salle Zen - 2ème étage',
      type: 'workshop',
      maxParticipants: 30,
      currentParticipants: 18,
      status: 'upcoming',
      organizer: 'Sophie Dubois',
      isPublic: true,
      tags: ['mindfulness', 'matinal', 'méditation']
    },
    {
      id: 2,
      title: 'Conférence Bien-être au Travail',
      description: 'Intervention d\'experts sur l\'optimisation du bien-être en entreprise',
      date: '2024-02-25',
      time: '14:00',
      duration: 120,
      location: 'Grand Amphithéâtre',
      type: 'conference',
      maxParticipants: 200,
      currentParticipants: 156,
      status: 'upcoming',
      organizer: 'Dr. Martin Leclerc',
      isPublic: true,
      tags: ['conférence', 'experts', 'bien-être']
    },
    {
      id: 3,
      title: 'Challenge Team Building VR',
      description: 'Expérience immersive de cohésion d\'équipe en réalité virtuelle',
      date: '2024-02-28',
      time: '16:00',
      duration: 90,
      location: 'Espace VR Innovation',
      type: 'team-building',
      maxParticipants: 20,
      currentParticipants: 12,
      status: 'upcoming',
      organizer: 'Alex Chen',
      isPublic: false,
      tags: ['VR', 'team-building', 'innovation']
    },
    {
      id: 4,
      title: 'Session de Respiration Active',
      description: 'Techniques de respiration pour réduire le stress et augmenter l\'énergie',
      date: '2024-02-15',
      time: '12:30',
      duration: 30,
      location: 'Terrasse Détente',
      type: 'workshop',
      maxParticipants: 25,
      currentParticipants: 25,
      status: 'completed',
      organizer: 'Marie Rodriguez',
      isPublic: true,
      tags: ['respiration', 'stress', 'pause-déjeuner']
    }
  ];

  const eventTypes = [
    { value: 'workshop', label: 'Atelier', color: 'bg-blue-500' },
    { value: 'conference', label: 'Conférence', color: 'bg-purple-500' },
    { value: 'team-building', label: 'Team Building', color: 'bg-green-500' },
    { value: 'training', label: 'Formation', color: 'bg-orange-500' },
    { value: 'wellness', label: 'Bien-être', color: 'bg-pink-500' }
  ];

  const createEvent = async () => {
    try {
      // Simulation de création d'événement
      const newEvent = {
        id: Date.now(),
        ...eventForm,
        currentParticipants: 0,
        status: 'upcoming',
        organizer: 'Vous',
        tags: [eventForm.type, 'nouveau']
      };
      
      setEvents(prev => [...prev, newEvent]);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        location: '',
        type: 'workshop',
        maxParticipants: 50,
        isPublic: true
      });
      setShowCreateModal(false);
      
      toast({
        title: "Événement créé",
        description: "Votre événement a été ajouté au calendrier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement.",
        variant: "destructive"
      });
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast({
        title: "Événement supprimé",
        description: "L'événement a été retiré du calendrier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement.",
        variant: "destructive"
      });
    }
  };

  const getEventTypeColor = (type) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { label: 'À venir', color: 'bg-blue-500' },
      ongoing: { label: 'En cours', color: 'bg-green-500' },
      completed: { label: 'Terminé', color: 'bg-gray-500' },
      cancelled: { label: 'Annulé', color: 'bg-red-500' }
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-10 w-10 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gestion d'Événements
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Organisez et gérez vos événements bien-être d'entreprise
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {events.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-sm text-gray-600">Événements à venir</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600 mb-1">
                {events.reduce((sum, e) => sum + e.currentParticipants, 0)}
              </div>
              <div className="text-sm text-gray-600">Participants totaux</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-600 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-600 mb-1">92%</div>
              <div className="text-sm text-gray-600">Taux de satisfaction</div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Liste des événements
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Vue Calendrier */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Calendrier des Événements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-7 gap-2 mb-6">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="text-center font-semibold p-2 bg-gray-100 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayEvents = events.filter(event => {
                      const eventDate = new Date(event.date);
                      return eventDate.getDate() === (i % 31) + 1;
                    });
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className={`h-20 p-2 border rounded-lg cursor-pointer transition-colors ${
                          dayEvents.length > 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{(i % 31) + 1}</div>
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded mb-1 text-white ${getEventTypeColor(event.type)}`}
                          >
                            {event.title.substring(0, 12)}...
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} autre(s)</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Liste des événements */}
          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                              {eventTypes.find(t => t.value === event.type)?.label}
                            </Badge>
                            <Badge className={`${getStatusBadge(event.status).color} text-white`}>
                              {getStatusBadge(event.status).label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{event.time} ({event.duration}min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>{event.currentParticipants}/{event.maxParticipants}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          Organisé par {event.organizer}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Types d'événements populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventTypes.map(type => {
                      const count = events.filter(e => e.type === type.value).length;
                      const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
                      
                      return (
                        <div key={type.value} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{type.label}</span>
                            <span>{count} événements</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className={`${type.color} h-2 rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Taux de participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round((events.reduce((sum, e) => sum + e.currentParticipants, 0) / 
                                  events.reduce((sum, e) => sum + e.maxParticipants, 0)) * 100)}%
                    </div>
                    <p className="text-gray-600">Taux de remplissage moyen</p>
                  </div>
                  
                  <div className="space-y-3">
                    {events.slice(0, 3).map(event => (
                      <div key={event.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{event.title}</span>
                          <span>{Math.round((event.currentParticipants / event.maxParticipants) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de création d'événement */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6">Créer un nouvel événement</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre de l'événement</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Atelier Mindfulness"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre événement..."
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Durée (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={eventForm.duration}
                        onChange={(e) => setEventForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Participants max</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Salle de conférence A"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type d'événement</Label>
                    <Select value={eventForm.type} onValueChange={(value) => setEventForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={createEvent}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Créer l'événement
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventsPageEnhanced;