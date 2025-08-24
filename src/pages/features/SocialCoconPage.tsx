
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, Share2, Calendar, MapPin, UserPlus, TrendingUp, Shield, Bell } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SocialCoconPage: React.FC = () => {
  const communityEvents = [
    {
      title: "Méditation de Groupe",
      time: "18:00 - 19:00",
      participants: 24,
      type: "live",
      mood: "Zen"
    },
    {
      title: "Partage d'Expériences",
      time: "20:00 - 21:00", 
      participants: 12,
      type: "discussion",
      mood: "Bienveillant"
    }
  ];

  const recentPosts = [
    {
      author: "Sarah M.",
      time: "Il y a 2h",
      content: "Magnifique séance de méditation ce matin ! Je me sens apaisée pour toute la journée 🧘‍♀️",
      likes: 15,
      comments: 3,
      mood: "Sérénité"
    },
    {
      author: "Thomas L.",
      time: "Il y a 4h", 
      content: "Quelqu'un d'autre trouve les exercices de respiration difficiles au début ? Des conseils ?",
      likes: 8,
      comments: 7,
      mood: "Questionnement"
    }
  ];

  const communityFeatures = [
    {
      title: 'Créer un Post',
      description: 'Partagez votre humeur et vos ressentis du jour',
      icon: <MessageCircle className="h-6 w-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      action: () => console.log('Create post')
    },
    {
      title: 'Trouver un Buddy',
      description: 'Connectez-vous avec quelqu\'un qui partage vos objectifs',
      icon: <UserPlus className="h-6 w-6" />,
      gradient: 'from-green-500 to-emerald-500',
      action: () => console.log('Find buddy')
    },
    {
      title: 'Rejoindre un Groupe',
      description: 'Participez à des sessions collectives de bien-être',
      icon: <Users className="h-6 w-6" />,
      gradient: 'from-purple-500 to-violet-500',
      action: () => console.log('Join group')
    },
    {
      title: 'Événements',
      description: 'Découvrez les prochains événements communautaires',
      icon: <Calendar className="h-6 w-6" />,
      gradient: 'from-orange-500 to-red-500',
      action: () => console.log('View events')
    }
  ];

  return (
    <PageLayout
      header={{
        title: 'Cocon Social',
        subtitle: 'Communauté bienveillante et soutenante',
        description: 'Rejoignez une communauté de personnes partageant vos objectifs de bien-être. Partagez, soutenez et grandissez ensemble.',
        icon: Users,
        gradient: 'from-pink-500/20 to-purple-500/5',
        badge: 'Communauté',
        stats: [
          {
            label: 'Membres',
            value: '2.4K',
            icon: Users,
            color: 'text-pink-500'
          },
          {
            label: 'Posts aujourd\'hui',
            value: '47',
            icon: MessageCircle,
            color: 'text-blue-500'
          },
          {
            label: 'Événements',
            value: '12',
            icon: Calendar,
            color: 'text-purple-500'
          },
          {
            label: 'Bienveillance',
            value: '98%',
            icon: Heart,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: 'Rejoindre Event',
            onClick: () => console.log('Join event'),
            variant: 'default',
            icon: Calendar
          },
          {
            label: 'Mon Profil',
            onClick: () => console.log('My profile'),
            variant: 'outline',
            icon: Users
          }
        ]
      }}
      tips={{
        title: 'Règles de bienveillance',
        items: [
          {
            title: 'Respect',
            content: 'Soyez respectueux et empathique envers tous les membres',
            icon: Shield
          },
          {
            title: 'Confidentialité',
            content: 'Respectez la confidentialité des partages personnels',
            icon: MessageCircle
          },
          {
            title: 'Soutien',
            content: 'Offrez votre soutien sans jugement ni conseil non sollicité',
            icon: Heart
          }
        ],
        cta: {
          label: 'Charte de la communauté',
          onClick: () => console.log('Community charter')
        }
      }}
    >
      <div className="space-y-8">
        {/* Fonctionnalités sociales */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Actions Communautaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                gradient={feature.gradient}
                action={{
                  label: 'Accéder',
                  onClick: feature.action
                }}
              />
            ))}
          </div>
        </div>

        {/* Événements et Fil d'actualité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Événements en direct */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-500" />
                  Événements en Direct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityEvents.map((event, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{event.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        Virtuel
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-medium">{event.time}</span>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {event.mood}
                      </Badge>
                      <Button size="sm" variant="default" className="text-xs">
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Fil d'actualité communautaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-6 w-6 text-blue-500" />
                  Fil de la Communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentPosts.map((post, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {post.author.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-sm">{post.author}</h4>
                          <p className="text-xs text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.mood}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-4">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-red-500 hover:text-red-600">
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center text-blue-500 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <Button variant="outline">
                    Voir plus de posts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to action */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
          <CardContent className="text-center p-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Rejoignez notre communauté</h3>
            <p className="text-muted-foreground mb-6">
              Plus de 2,400 personnes partagent déjà leur parcours de bien-être. Découvrez le pouvoir du soutien mutuel.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Créer mon premier post
              </Button>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Trouver mon buddy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SocialCoconPage;
