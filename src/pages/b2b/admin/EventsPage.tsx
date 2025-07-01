
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Users, Clock, MapPin } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const EventsPage: React.FC = () => {
  const upcomingEvents = [
    {
      title: "Séance de Méditation Collective",
      date: "2024-01-15",
      time: "12:00 - 13:00",
      participants: 25,
      maxParticipants: 30,
      location: "Salle de détente",
      type: "Bien-être"
    },
    {
      title: "Atelier Gestion du Stress",
      date: "2024-01-18", 
      time: "14:00 - 16:00",
      participants: 12,
      maxParticipants: 20,
      location: "Salle de formation A",
      type: "Formation"
    },
    {
      title: "Challenge Team Building",
      date: "2024-01-22",
      time: "16:00 - 18:00", 
      participants: 8,
      maxParticipants: 15,
      location: "Espace extérieur",
      type: "Team Building"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Événements & Ateliers
            </h1>
            <p className="text-lg text-muted-foreground">
              Organisez et animez des événements bien-être pour vos équipes
            </p>
          </div>
          <PremiumButton variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Créer un événement
          </PremiumButton>
        </div>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <PremiumCard className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-blue-600">12</h3>
            <p className="text-muted-foreground">Événements ce mois</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">145</h3>
            <p className="text-muted-foreground">Participants total</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-purple-600">3</h3>
            <p className="text-muted-foreground">À venir cette semaine</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold text-orange-600">5</h3>
            <p className="text-muted-foreground">Lieux disponibles</p>
          </PremiumCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Événements à venir */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Événements à Venir</h3>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{event.title}</h4>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants}/{event.maxParticipants}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex space-x-2">
                      <PremiumButton variant="ghost" size="sm">
                        Modifier
                      </PremiumButton>
                      <PremiumButton variant="primary" size="sm">
                        Gérer
                      </PremiumButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>

          {/* Création rapide */}
          <div className="space-y-8">
            <PremiumCard>
              <div className="text-center">
                <Plus className="h-16 w-16 mx-auto mb-6 text-blue-500" />
                <h3 className="text-2xl font-bold mb-4">Création Rapide</h3>
                <p className="text-muted-foreground mb-6">
                  Créez rapidement un événement à partir de modèles
                </p>
                
                <div className="space-y-3">
                  <PremiumButton variant="primary" className="w-full">
                    Méditation de groupe
                  </PremiumButton>
                  <PremiumButton variant="secondary" className="w-full">
                    Atelier anti-stress
                  </PremiumButton>
                  <PremiumButton variant="accent" className="w-full">
                    Team building
                  </PremiumButton>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Statistiques</h3>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Taux de participation</span>
                  <span className="font-bold text-green-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Satisfaction moyenne</span>
                  <span className="font-bold text-blue-600">4.6/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Événements ce trimestre</span>
                  <span className="font-bold text-purple-600">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Heures d'activité</span>
                  <span className="font-bold text-orange-600">156h</span>
                </div>
              </div>
            </PremiumCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventsPage;
