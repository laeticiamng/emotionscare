
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Users, 
  Clock, 
  MapPin, 
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Star,
  BarChart3,
  Video,
  Coffee,
  Brain,
  Heart,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'webinar' | 'meditation' | 'conference' | 'team-building' | 'wellness';
  date: Date;
  time: string;
  duration: number; // in minutes
  location: string;
  isVirtual: boolean;
  organizer: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  registrationOpen: boolean;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  const { toast } = useToast();

  // Mock events data
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Atelier Gestion du Stress',
        description: 'Techniques avancées pour gérer le stress en milieu professionnel',
        type: 'workshop',
        date: new Date(2024, 2, 15, 14, 0),
        time: '14:00',
        duration: 120,
        location: 'Salle de conférence A',
        isVirtual: false,
        organizer: 'Dr. Marie Dubois',
        participants: 18,
        maxParticipants: 25,
        status: 'upcoming',
        priority: 'high',
        tags: ['stress', 'bien-être', 'productivité'],
        registrationOpen: true
      },
      {
        id: '2',
        title: 'Webinaire: Mindfulness au Travail',
        description: 'Introduction à la pleine conscience pour améliorer le bien-être professionnel',
        type: 'webinar',
        date: new Date(2024, 2, 18, 12, 0),
        time: '12:00',
        duration: 60,
        location: 'En ligne',
        isVirtual: true,
        organizer: 'Institut EmotionsCare',
        participants: 45,
        maxParticipants: 100,
        status: 'upcoming',
        priority: 'medium',
        tags: ['mindfulness', 'webinaire', 'gratuit'],
        registrationOpen: true
      },
      {
        id: '3',
        title: 'Séance de Méditation Collective',
        description: 'Méditation guidée pour équipes',
        type: 'meditation',
        date: new Date(2024, 2, 20, 17, 30),
        time: '17:30',
        duration: 45,
        location: 'Espace Zen',
        isVirtual: false,
        organizer: 'Sarah Martin',
        participants: 12,
        maxParticipants: 20,
        status: 'upcoming',
        priority: 'low',
        tags: ['méditation', 'relaxation', 'équipe'],
        registrationOpen: true
      },
      {
        id: '4',
        title: 'Conférence: IA et Bien-être Émotionnel',
        description: 'L\'impact de l\'intelligence artificielle sur la santé mentale',
        type: 'conference',
        date: new Date(2024, 2, 22, 10, 0),
        time: '10:00',
        duration: 180,
        location: 'Auditorium Principal',
        isVirtual: false,
        organizer: 'Prof. Jean Dupont',
        participants: 85,
        maxParticipants: 150,
        status: 'upcoming',
        priority: 'high',
        tags: ['IA', 'innovation', 'recherche'],
        registrationOpen: true
      },
      {
        id: '5',
        title: 'Team Building Émotionnel',
        description: 'Activités pour renforcer la cohésion d\'équipe',
        type: 'team-building',
        date: new Date(2024, 2, 25, 9, 0),
        time: '09:00',
        duration: 240,
        location: 'Parc des Expositions',
        isVirtual: false,
        organizer: 'Équipe RH',
        participants: 32,
        maxParticipants: 40,
        status: 'upcoming',
        priority: 'medium',
        tags: ['équipe', 'collaboration', 'fun'],
        registrationOpen: true
      }
    ];
    
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
                           event.type === selectedFilter ||
                           event.status === selectedFilter ||
                           event.priority === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedFilter]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop':
        return Brain;
      case 'webinar':
        return Video;
      case 'meditation':
        return Heart;
      case 'conference':
        return Users;
      case 'team-building':
        return Coffee;
      case 'wellness':
        return Zap;
      default:
        return CalendarIcon;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'webinar':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'meditation':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'conference':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'team-building':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'wellness':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateEvent = () => {
    toast({
      title: "Événement créé",
      description: "Votre événement a été créé avec succès.",
    });
    setShowCreateDialog(false);
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, participants: event.participants + 1 }
        : event
    ));
    
    toast({
      title: "Inscription confirmée",
      description: "Vous êtes maintenant inscrit à cet événement.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Événements</h1>
            <p className="text-muted-foreground">
              Organisez et participez aux événements de bien-être
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel événement</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input id="title" placeholder="Nom de l'événement" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Atelier</SelectItem>
                        <SelectItem value="webinar">Webinaire</SelectItem>
                        <SelectItem value="meditation">Méditation</SelectItem>
                        <SelectItem value="conference">Conférence</SelectItem>
                        <SelectItem value="team-building">Team Building</SelectItem>
                        <SelectItem value="wellness">Bien-être</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Description de l'événement" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure</Label>
                    <Input id="time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lieu</Label>
                    <Input id="location" placeholder="Lieu de l'événement" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants max</Label>
                    <Input id="participants" type="number" placeholder="50" />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateEvent}>
                      Créer l'événement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les événements</SelectItem>
              <SelectItem value="upcoming">À venir</SelectItem>
              <SelectItem value="workshop">Ateliers</SelectItem>
              <SelectItem value="webinar">Webinaires</SelectItem>
              <SelectItem value="meditation">Méditation</SelectItem>
              <SelectItem value="high">Priorité haute</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <div className="lg:col-span-3">
                <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.filter(event => event.status === 'upcoming').map((event) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5 text-blue-600" />
                                <Badge className={getEventColor(event.type)}>
                                  {event.type}
                                </Badge>
                              </div>
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                  {format(event.date, 'dd MMMM yyyy', { locale: fr })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>{event.time} ({event.duration} min)</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4" />
                                <span>{event.participants}/{event.maxParticipants} participants</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {event.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleJoinEvent(event.id)}
                                disabled={event.participants >= event.maxParticipants}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                {event.participants >= event.maxParticipants ? 'Complet' : 'Rejoindre'}
                              </Button>
                              <Button size="sm" variant="outline">
                                <Star className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{events.length}</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">À venir</p>
                      <p className="text-2xl font-bold">
                        {events.filter(e => e.status === 'upcoming').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="text-2xl font-bold">
                        {events.reduce((acc, e) => acc + e.participants, 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de remplissage</p>
                      <p className="text-2xl font-bold">
                        {Math.round((events.reduce((acc, e) => acc + e.participants, 0) / 
                          events.reduce((acc, e) => acc + e.maxParticipants, 0)) * 100)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{event.title}</h3>
                            <Badge className={getEventColor(event.type)}>
                              {event.type}
                            </Badge>
                            <Badge className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{format(event.date, 'dd/MM/yyyy')}</span>
                            <span>{event.time}</span>
                            <span>{event.location}</span>
                            <span>{event.participants}/{event.maxParticipants}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinEvent(event.id)}
                            disabled={event.participants >= event.maxParticipants}
                          >
                            {event.participants >= event.maxParticipants ? 'Complet' : 'Rejoindre'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
