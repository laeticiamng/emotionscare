
/**
 * Page du cocon social B2C
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Users, Star, Plus } from "lucide-react";

const B2CSocialCoconPage = () => {
  const posts = [
    {
      id: 1,
      author: "Emma D.",
      avatar: "ED",
      time: "Il y a 2h",
      content: "Belle session de méditation ce matin ! Le module VR m'a vraiment aidée à me détendre. 🧘‍♀️",
      likes: 12,
      comments: 3,
      tags: ["méditation", "vr", "détente"]
    },
    {
      id: 2,
      author: "Alex M.",
      avatar: "AM",
      time: "Il y a 4h",
      content: "Incroyable comme la musicothérapie peut changer une journée difficile. Merci EmotionsCare ! 🎵",
      likes: 18,
      comments: 7,
      tags: ["musicothérapie", "gratitude"]
    },
    {
      id: 3,
      author: "Sophie L.",
      avatar: "SL",
      time: "Il y a 6h",
      content: "Partage de ma progression cette semaine : 5 scans d'émotions, 3 sessions coach IA. Je me sens plus équilibrée ! 📈",
      likes: 25,
      comments: 12,
      tags: ["progression", "équilibre"]
    }
  ];

  const challenges = [
    { title: "Défi Bien-être Collectif", participants: 127, description: "30 jours de pratiques positives" },
    { title: "Méditation en Groupe", participants: 89, description: "Sessions VR synchronisées" },
    { title: "Journal Collaboratif", participants: 156, description: "Partage d'expériences quotidiennes" }
  ];

  const supportGroups = [
    { name: "Gestion du Stress", members: 234, category: "Anxiété" },
    { name: "Confiance en Soi", members: 187, category: "Développement" },
    { name: "Équilibre Travail-Vie", members: 298, category: "Professional" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Users className="inline-block mr-3 text-green-600" />
            Cocon Social
          </h1>
          <p className="text-xl text-gray-600">
            Connectez-vous avec la communauté EmotionsCare
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Créer un post */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">Vous</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Button variant="outline" className="w-full justify-start text-gray-500">
                      Partagez votre expérience...
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Émotions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Progression
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Inspiration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{post.author}</h3>
                          <span className="text-sm text-gray-500">{post.time}</span>
                        </div>
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        <div className="flex gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <button className="flex items-center gap-1 hover:text-red-600">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-1 hover:text-green-600">
                            <Share2 className="w-4 h-4" />
                            Partager
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Défis communautaires */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Défis Communautaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-green-50">
                    <h3 className="font-medium text-green-800 mb-1">{challenge.title}</h3>
                    <p className="text-xs text-green-600 mb-2">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{challenge.participants} participants</span>
                      <Button size="sm" variant="outline">Rejoindre</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Groupes de soutien */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Groupes de Soutien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportGroups.map((group, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                    <h3 className="font-medium text-gray-800">{group.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{group.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{group.members} membres</span>
                      <Button size="sm" variant="outline">Rejoindre</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats communauté */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Communauté EmotionsCare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">2,847</div>
                    <p className="text-sm text-gray-600">Membres actifs</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">12,439</div>
                    <p className="text-sm text-gray-600">Posts partagés</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
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

export default B2CSocialCoconPage;
