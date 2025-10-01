// @ts-nocheck
/**
 * Page du cocon social B2B
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageSquare, Calendar, TrendingUp, Settings, Plus } from "lucide-react";

const B2BSocialCoconPage = () => {
  const teamActivities = [
    {
      id: 1,
      team: "Équipe Développement",
      activity: "Session de méditation collective",
      participants: 8,
      timestamp: "Il y a 2h",
      type: "wellness"
    },
    {
      id: 2,
      team: "Équipe Marketing", 
      activity: "Atelier gestion du stress",
      participants: 12,
      timestamp: "Il y a 4h",
      type: "workshop"
    },
    {
      id: 3,
      team: "Équipe Ventes",
      activity: "Challenge bien-être hebdomadaire",
      participants: 15,
      timestamp: "Il y a 6h",
      type: "challenge"
    }
  ];

  const wellnessPrograms = [
    {
      title: "Programme Anti-Stress",
      description: "8 semaines pour apprendre à gérer le stress au travail",
      participants: 45,
      progress: 65,
      status: "active"
    },
    {
      title: "Équilibre Vie Pro/Perso",
      description: "Techniques pour un meilleur équilibre personnel",
      participants: 32,
      progress: 80,
      status: "active"
    },
    {
      title: "Communication Bienveillante",
      description: "Améliorer les relations interpersonnelles",
      participants: 28,
      progress: 45,
      status: "planning"
    }
  ];

  const teamMetrics = [
    { team: "Dev", wellnessScore: 85, engagement: 92, members: 12 },
    { team: "Marketing", wellnessScore: 78, engagement: 88, members: 8 },
    { team: "Ventes", wellnessScore: 82, engagement: 85, members: 15 },
    { team: "Support", wellnessScore: 89, engagement: 94, members: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <Users className="inline-block mr-3 text-teal-600" />
              Cocon Social B2B
            </h1>
            <p className="text-xl text-gray-600">
              Plateforme collaborative pour le bien-être en entreprise
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Programme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activités récentes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="text-blue-600" />
                  Activités des Équipes
                </CardTitle>
                <CardDescription>
                  Dernières activités de bien-être en entreprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Avatar>
                        <AvatarFallback className="bg-teal-100 text-teal-600">
                          {activity.team.split(' ')[1][0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.team}</h3>
                        <p className="text-sm text-gray-600">{activity.activity}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{activity.participants} participants</span>
                          <span>{activity.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Programmes de bien-être */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-green-600" />
                  Programmes de Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wellnessPrograms.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{program.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{program.participants} participants</span>
                            <Badge variant={program.status === "active" ? "default" : "secondary"}>
                              {program.status === "active" ? "Actif" : "Planifié"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {program.status === "active" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span className="font-medium">{program.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${program.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Métriques des équipes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-purple-600" />
                  Performance Équipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMetrics.map((team, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900">{team.team}</h3>
                        <span className="text-sm text-gray-600">{team.members} membres</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Bien-être</span>
                          <span className="font-medium">{team.wellnessScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${team.wellnessScore}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement</span>
                          <span className="font-medium">{team.engagement}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${team.engagement}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planifier un événement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Envoyer message global
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir rapports détaillés
                </Button>
              </CardContent>
            </Card>

            {/* Stats globales */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-600">41</div>
                    <p className="text-sm text-gray-600">Employés participants</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">83%</div>
                    <p className="text-sm text-gray-600">Taux de participation</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.6/5</div>
                    <p className="text-sm text-gray-600">Satisfaction générale</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSocialCoconPage;