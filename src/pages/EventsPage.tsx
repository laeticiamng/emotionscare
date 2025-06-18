
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, MapPin, Clock, Users, Filter, Search } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Atelier Gestion du Stress',
      description: 'Techniques pratiques pour gérer le stress au quotidien',
      date: '2024-12-20',
      time: '14:00',
      duration: '2h',
      location: 'Salle de conférence A',
      type: 'Atelier',
      participants: 15,
      maxParticipants: 20,
      status: 'upcoming',
      organizer: 'Dr. Sophie Martin'
    },
    {
      id: 2,
      title: 'Séance de Méditation Collective',
      description: 'Moment de détente et de méditation guidée',
      date: '2024-12-18',
      time: '12:30',
      duration: '30min',
      location: 'Espace bien-être',
      type: 'Méditation',
      participants: 8,
      maxParticipants: 12,
      status: 'upcoming',
      organizer: 'Marie Chen'
    },
    {
      id: 3,
      title: 'Conférence: Équilibre Vie Pro/Perso',
      description: 'Comment maintenir un équilibre sain entre travail et vie personnelle',
      date: '2024-12-22',
      time: '10:00',
      duration: '1h30',
      location: 'Auditorium',
      type: 'Conférence',
      participants: 45,
      maxParticipants: 100,
      status: 'upcoming',
      organizer: 'Thomas Dubois'
    },
    {
      id: 4,
      title: 'Team Building Créatif',
      description: 'Activités créatives pour renforcer la cohésion d\'équipe',
      date: '2024-12-15',
      time: '15:00',
      duration: '3h',
      location: 'Salle polyvalente',
      type: 'Team Building',
      participants: 25,
      maxParticipants: 30,
      status: 'completed',
      organizer: 'Pierre Laurent'
    }
  ];

  const eventTypes = [
    { id: 'all', label: 'Tous les événements' },
    { id: 'Atelier', label: 'Ateliers' },
    { id: 'Méditation', label: 'Méditation' },
    { id: 'Conférence', label: 'Conférences' },
    { id: 'Team Building', label: 'Team Building' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Atelier': return 'bg-purple-100 text-purple-800';
      case 'Méditation': return 'bg-green-100 text-green-800';
      case 'Conférence': return 'bg-blue-100 text-blue-800';
      case 'Team Building': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Événements Bien-être</h1>
          <p className="text-muted-foreground">
            Organisez et participez aux événements de bien-être de l'entreprise
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Événements ce mois</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participants total</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <Badge className="h-8 w-8 rounded-full bg-purple-500">★</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À venir</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={selectedFilter} 
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {eventTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status === 'upcoming' && 'À venir'}
                    {event.status === 'completed' && 'Terminé'}
                    {event.status === 'cancelled' && 'Annulé'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Date and Time */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time} ({event.duration})
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.participants}/{event.maxParticipants} participants</span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Organizer */}
              <div className="text-xs text-muted-foreground">
                Organisé par {event.organizer}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {event.status === 'upcoming' ? (
                  <>
                    <Button size="sm" className="flex-1">
                      S'inscrire
                    </Button>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm">
                      Feedback
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucun événement programmé pour le moment'
            }
          </p>
          <Button onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Quick Create Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Créer un événement rapidement</CardTitle>
          <CardDescription>
            Types d'événements les plus populaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {['Méditation', 'Atelier Stress', 'Team Building', 'Conférence'].map((type) => (
              <Button key={type} variant="outline" className="h-20 flex flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
