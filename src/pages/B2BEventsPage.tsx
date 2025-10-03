/**
 * Page des événements B2B
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Plus, Eye } from "lucide-react";

const B2BEventsPage = () => {
  const events = [
    {
      id: 1,
      title: "Atelier Gestion du Stress",
      description: "Session pratique pour apprendre les techniques de gestion du stress au travail",
      date: "2024-02-15",
      time: "14:00 - 16:00",
      location: "Salle de conférence A",
      participants: 12,
      maxParticipants: 20,
      status: "upcoming",
      category: "Bien-être"
    },
    {
      id: 2,
      title: "Formation Intelligence Émotionnelle",
      description: "Développer ses compétences émotionnelles pour une meilleure collaboration",
      date: "2024-02-20",
      time: "09:00 - 12:00",
      location: "Centre de formation",
      participants: 18,
      maxParticipants: 25,
      status: "upcoming",
      category: "Formation"
    },
    {
      id: 3,
      title: "Séance de Méditation Collective",
      description: "Moment de détente et de recentrage pour toute l'équipe",
      date: "2024-02-10",
      time: "12:00 - 12:30",
      location: "Espace détente",
      participants: 15,
      maxParticipants: 15,
      status: "completed",
      category: "Méditation"
    }
  ];

  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const completedEvents = events.filter(event => event.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <Calendar className="inline-block mr-3 text-indigo-600" />
              Gestion des Événements
            </h1>
            <p className="text-xl text-gray-600">
              Planifiez et gérez les événements bien-être de votre entreprise
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Événement
          </Button>
        </div>

        {/* Événements à venir */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-blue-600" />
              Événements à Venir
            </CardTitle>
            <CardDescription>
              Prochains événements programmés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.participants}/{event.maxParticipants} participants
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm">Modifier</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">
                      {Math.round((event.participants / event.maxParticipants) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
              <p className="text-sm text-gray-600">Événements ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">156</div>
              <p className="text-sm text-gray-600">Participants total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <p className="text-sm text-gray-600">Taux de satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </CardContent>
          </Card>
        </div>

        {/* Événements terminés */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-green-600" />
              Événements Terminés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-green-800">{event.title}</h3>
                      <p className="text-sm text-green-600">
                        {new Date(event.date).toLocaleDateString('fr-FR')} • {event.participants} participants
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                      <Button variant="outline" size="sm">Rapport</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BEventsPage;