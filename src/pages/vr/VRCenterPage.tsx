/**
 * 🥽 CENTRE VR - EXPÉRIENCES IMMERSIVES
 * Hub central pour toutes les expériences de réalité virtuelle
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Headphones, 
  Play, 
  Pause, 
  VolumeX, 
  Volume2, 
  Settings, 
  Star,
  Clock,
  Users,
  Zap
} from 'lucide-react';

const vrExperiences = [
  {
    id: 'forest-meditation',
    title: 'Forêt Méditative',
    description: 'Plongez dans une forêt zen pour une méditation profonde',
    duration: '15 min',
    difficulty: 'Débutant',
    rating: 4.8,
    participants: 1250,
    image: '/api/placeholder/300/200'
  },
  {
    id: 'ocean-depths',
    title: 'Profondeurs Océaniques',
    description: 'Explorez les fonds marins pour une relaxation totale',
    duration: '20 min',
    difficulty: 'Intermédiaire',
    rating: 4.9,
    participants: 890,
    image: '/api/placeholder/300/200'
  },
  {
    id: 'mountain-peak',
    title: 'Sommet de Montagne',
    description: 'Atteignez les sommets pour une paix intérieure',
    duration: '25 min',
    difficulty: 'Avancé',
    rating: 4.7,
    participants: 567,
    image: '/api/placeholder/300/200'
  }
];

export const VRCenterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Centre VR - Expériences Immersives | EmotionsCare</title>
        <meta name="description" content="Découvrez nos expériences de réalité virtuelle pour la méditation, la relaxation et le bien-être émotionnel." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Centre des Expériences VR
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Immergez-vous dans des environnements virtuels thérapeutiques 
              conçus pour votre bien-être émotionnel
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Expériences', value: '12+', icon: Headphones },
              { label: 'Temps Moyen', value: '18 min', icon: Clock },
              { label: 'Utilisateurs Actifs', value: '2.8k', icon: Users },
              { label: 'Note Moyenne', value: '4.8/5', icon: Star }
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* VR Experiences Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {vrExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Headphones className="h-16 w-16 text-primary/60" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">
                        {experience.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {experience.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {experience.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {experience.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {experience.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {experience.participants}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer l'Expérience
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* VR Setup Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration VR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Pour une expérience optimale, assurez-vous d'avoir :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Équipement Requis</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Casque VR compatible WebXR</li>
                      <li>• Connexion internet stable</li>
                      <li>• Navigateur récent (Chrome/Firefox)</li>
                      <li>• Espace de 2x2 mètres minimum</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Conseils d'Utilisation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Portez des vêtements confortables</li>
                      <li>• Évitez les sessions de plus de 30 min</li>
                      <li>• Prenez des pauses régulières</li>
                      <li>• Ajustez le volume selon votre confort</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">
                    Tester la Compatibilité
                  </Button>
                  <Button variant="outline">
                    Guide d'Installation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default VRCenterPage;