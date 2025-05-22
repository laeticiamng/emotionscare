
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Glasses, Play, Info, FileText } from 'lucide-react';

const VRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('experiences');

  const vrExperiences = [
    {
      id: 'nature',
      title: 'Nature apaisante',
      description: 'Explorez des paysages naturels relaxants pour réduire le stress',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '15 min'
    },
    {
      id: 'meditation',
      title: 'Méditation guidée',
      description: 'Expérience immersive de méditation guidée par un expert',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '20 min'
    },
    {
      id: 'ocean',
      title: 'Fonds marins',
      description: "Plongez dans les profondeurs de l'océan pour une relaxation intense",
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '18 min'
    },
    {
      id: 'forest',
      title: 'Forêt enchantée',
      description: 'Balade contemplative dans une forêt magique et apaisante',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '22 min'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <h1 className="text-3xl font-bold mb-3">Réalité virtuelle thérapeutique</h1>
            <p className="text-muted-foreground mb-6">
              Plongez dans des expériences immersives conçues pour améliorer votre bien-être émotionnel.
              Notre technologie de réalité virtuelle offre un moyen unique de vous évader et de 
              vous reconnecter avec des environnements apaisants.
            </p>
            <Button size="lg" className="flex items-center gap-2">
              <Glasses className="h-5 w-5" />
              Démarrer une session VR
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 aspect-video relative rounded-lg overflow-hidden"
          >
            <img 
              src="/images/vr-banner-bg.jpg" 
              alt="VR experience" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button size="icon" className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Play className="h-8 w-8 text-white" fill="white" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        <Tabs defaultValue="experiences" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experiences">Expériences VR</TabsTrigger>
            <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
            <TabsTrigger value="benefits">Bienfaits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experiences" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vrExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={exp.image} 
                        alt={exp.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                        {exp.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button size="icon" className="h-12 w-12 rounded-full">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{exp.title}</CardTitle>
                      <CardDescription>{exp.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Démarrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Guide d'utilisation de la VR</CardTitle>
                <CardDescription>
                  Apprenez à utiliser notre plateforme de réalité virtuelle thérapeutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="font-bold">1</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Installation</h3>
                      <p className="text-muted-foreground">
                        Assurez-vous que votre casque VR est correctement configuré et connecté à votre appareil. 
                        Notre application est compatible avec les casques Oculus, HTC Vive et PlayStation VR.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="font-bold">2</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Environnement</h3>
                      <p className="text-muted-foreground">
                        Choisissez un espace calme et sécurisé d'au moins 2m x 2m. Assurez-vous qu'il n'y a aucun obstacle 
                        dans votre zone de jeu pour éviter tout accident.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="font-bold">3</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Commencez votre expérience</h3>
                      <p className="text-muted-foreground">
                        Sélectionnez une expérience VR dans notre catalogue et suivez les instructions à l'écran. 
                        Vous pouvez naviguer dans l'interface en pointant et en cliquant avec les contrôleurs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Télécharger le guide complet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Bienfaits de la réalité virtuelle thérapeutique</CardTitle>
                <CardDescription>
                  Découvrez comment la VR peut améliorer votre bien-être émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span className="text-green-600 dark:text-green-300">✓</span>
                      </div>
                      Réduction du stress
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      Les études ont montré que les expériences de VR dans la nature peuvent réduire 
                      significativement les niveaux de cortisol et diminuer les sensations d'anxiété.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span className="text-green-600 dark:text-green-300">✓</span>
                      </div>
                      Amélioration de l'humeur
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      L'immersion dans des environnements positifs stimule la production de sérotonine 
                      et favorise un état émotionnel plus équilibré et joyeux.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span className="text-green-600 dark:text-green-300">✓</span>
                      </div>
                      Gestion de la douleur
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      La VR est utilisée comme technique de distraction dans la gestion de la douleur, 
                      avec des résultats prouvés dans la réduction de la perception de la douleur chronique.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span className="text-green-600 dark:text-green-300">✓</span>
                      </div>
                      Pleine conscience
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      Les exercices de pleine conscience en VR offrent un environnement contrôlé 
                      pour pratiquer la méditation et développer une plus grande conscience de soi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VRPage;
