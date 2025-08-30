/**
 * Page de debug simple pour tester le contenu
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Music, Brain, Play, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

export default function DebugDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard EmotionsCare
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Votre centre de bien-être émotionnel personnalisé
          </p>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-green-500/10 via-background/95 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    Statut du Système
                  </h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-600">
                      ✓ Authentifié: {isAuthenticated ? 'Oui' : 'Non'}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">
                      👤 Mode: {userMode || 'Aucun'}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-600">
                      📧 Email: {user?.email || 'Aucun'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Musicothérapie IA",
              description: "Musique adaptative pour votre bien-être",
              icon: Music,
              color: "from-purple-500 to-blue-500",
              path: "/app/music",
              badge: "Nouveau"
            },
            {
              title: "Coach IA Personnel",
              description: "Accompagnement émotionnel personnalisé",
              icon: Brain,
              color: "from-blue-500 to-cyan-500",
              path: "/app/coach",
              badge: "IA"
            },
            {
              title: "Scanner Émotionnel",
              description: "Analyse instantanée de votre état émotionnel",
              icon: Heart,
              color: "from-pink-500 to-rose-500",
              path: "/app/scan",
              badge: "Populaire"
            },
            {
              title: "Journal Personnel",
              description: "Suivez votre évolution émotionnelle",
              icon: Star,
              color: "from-yellow-500 to-orange-500",
              path: "/app/journal",
              badge: "Quotidien"
            },
            {
              title: "VR Immersive",
              description: "Expériences de relaxation en réalité virtuelle",
              icon: Play,
              color: "from-green-500 to-teal-500",
              path: "/app/vr",
              badge: "Premium"
            },
            {
              title: "Centre Émotionnel",
              description: "Explorez et comprenez vos émotions",
              icon: Heart,
              color: "from-red-500 to-pink-500",
              path: "/app/emotions",
              badge: "Essentiel"
            }
          ].map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-background/95 to-accent/5">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${action.color}`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <Button 
                    onClick={() => navigate(action.path)}
                    className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg transition-all`}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistiques rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Sessions", value: "12", color: "text-blue-600" },
            { label: "Bien-être", value: "85%", color: "text-green-600" },
            { label: "Streak", value: "7 jours", color: "text-purple-600" },
            { label: "Niveau", value: "Expert", color: "text-amber-600" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-4 bg-gradient-to-br from-background/95 to-accent/5">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}