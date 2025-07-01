
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, Share2, Calendar, MapPin } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Cocon Social
          </h1>
          <p className="text-lg text-muted-foreground">
            Une communauté bienveillante pour partager votre parcours bien-être
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Événements en direct */}
          <PremiumCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Événements en Direct</h3>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {communityEvents.map((event, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      Virtuel
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.time}</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-sm">{event.participants} participants</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {event.mood}
                    </span>
                    <PremiumButton variant="primary" size="sm">
                      Rejoindre
                    </PremiumButton>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Actions rapides */}
          <div className="space-y-6">
            <PremiumCard>
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-bold mb-2">Créer un Post</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Partagez votre humeur du jour
                </p>
                <PremiumButton variant="primary" className="w-full">
                  Partager
                </PremiumButton>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-bold mb-2">Trouver un Buddy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez-vous avec quelqu'un
                </p>
                <PremiumButton variant="secondary" className="w-full">
                  Rechercher
                </PremiumButton>
              </div>
            </PremiumCard>
          </div>
        </div>

        {/* Fil d'actualité communautaire */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Fil de la Communauté</h3>
            <Share2 className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-6">
            {recentPosts.map((post, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-bold">{post.author}</h4>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {post.mood}
                  </span>
                </div>
                
                <p className="mb-4">{post.content}</p>
                
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
          </div>

          <div className="text-center mt-8">
            <PremiumButton variant="ghost">
              Voir plus de posts
            </PremiumButton>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default SocialCoconPage;
