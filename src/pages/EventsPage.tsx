
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: 'workshop' | 'webinar' | 'team-building' | 'formation';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const events: Event[] = [
    {
      id: '1',
      title: 'Atelier Gestion du Stress',
      description: 'Formation pratique sur les techniques de gestion du stress en milieu professionnel',
      date: '2024-01-15',
      time: '14:00',
      location: 'Salle de conférence A',
      attendees: 12,
      maxAttendees: 20,
      category: 'workshop',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Webinaire Bien-être Mental',
      description: 'Conférence en ligne sur l\'importance de la santé mentale au travail',
      date: '2024-01-18',
      time: '10:00',
      location: 'En ligne',
      attendees: 45,
      maxAttendees: 100,
      category: 'webinar',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Team Building Créatif',
      description: 'Activité de cohésion d\'équipe axée sur la créativité et la collaboration',
      date: '2024-01-12',
      time: '09:00',
      location: 'Espace créatif',
      attendees: 8,
      maxAttendees: 15,
      category: 'team-building',
      status: 'completed'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      workshop: 'Atelier',
      webinar: 'Webinaire',
      'team-building': 'Team Building',
      formation: 'Formation'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Événements</h1>
            <p className="text-muted-foreground">
              Organisez et participez aux événements de bien-être
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Événement
          </Button>
        </div>

        {/* Filtres et Recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Tous
            </Button>
            <Button
              variant={selectedCategory === 'workshop' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('workshop')}
              size="sm"
            >
              Ateliers
            </Button>
            <Button
              variant={selectedCategory === 'webinar' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('webinar')}
              size="sm"
            >
              Webinaires
            </Button>
            <Button
              variant={selectedCategory === 'team-building' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('team-building')}
              size="sm"
            >
              Team Building
            </Button>
          </div>
        </div>

        {/* Liste des Événements */}
        <div className="grid gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        <Badge variant="secondary">
                          {getCategoryLabel(event.category)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === 'scheduled' && 'Programmé'}
                      {event.status === 'ongoing' && 'En cours'}
                      {event.status === 'completed' && 'Terminé'}
                      {event.status === 'cancelled' && 'Annulé'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.attendees}/{event.maxAttendees} participants
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                      {event.status === 'scheduled' && (
                        <Button size="sm">
                          Participer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche ou créez un nouvel événement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
