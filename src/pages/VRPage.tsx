
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Headphones, 
  Play, 
  Pause, 
  Square,
  Settings,
  Star,
  Clock,
  Target,
  Zap,
  Mountain,
  Waves,
  TreePine,
  Sun,
  Moon,
  Brain,
  Heart,
  TrendingUp,
  Award,
  Volume2
} from 'lucide-react';
import VRActiveSession from '@/components/vr/VRActiveSession';
import { VRSessionTemplate, VRSession } from '@/types';

const VRPage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<VRSessionTemplate | null>(null);
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [isVRAvailable, setIsVRAvailable] = useState(true);
  const [sessionProgress, setSessionProgress] = useState(0);

  const vrTemplates: VRSessionTemplate[] = [
    {
      id: 'beach-calm',
      name: 'Plage Relaxante',
      title: 'Sérénité au Bord de l\'Océan',
      description: 'Détendez-vous sur une plage paradisiaque avec le bruit des vagues apaisantes',
      duration: 900,
      category: 'relaxation',
      intensity: 2,
      difficulty: 'easy',
      immersionLevel: 'high',
      goalType: 'relaxation',
      interactive: false,
      tags: ['océan', 'détente', 'méditation'],
      recommendedMood: 'stressed',
      thumbnailUrl: '/images/vr/beach.jpg'
    },
    {
      id: 'forest-adventure',
      name: 'Forêt Mystique',
      title: 'Exploration de la Forêt Enchantée',
      description: 'Explorez une forêt magique remplie de sons naturels et d\'animaux sauvages',
      duration: 1200,
      category: 'exploration',
      intensity: 4,
      difficulty: 'medium',
      immersionLevel: 'high',
      goalType: 'mindfulness',
      interactive: true,
      tags: ['nature', 'aventure', 'animaux'],
      recommendedMood: 'curious',
      thumbnailUrl: '/images/vr/forest.jpg'
    },
    {
      id: 'mountain-meditation',
      name: 'Sommet de Montagne',
      title: 'Méditation au Sommet du Monde',
      description: 'Méditez au sommet d\'une montagne avec une vue panoramique époustouflante',
      duration: 600,
      category: 'meditation',
      intensity: 1,
      difficulty: 'easy',
      immersionLevel: 'medium',
      goalType: 'mindfulness',
      interactive: false,
      tags: ['montagne', 'méditation', 'altitude'],
      recommendedMood: 'contemplative',
      thumbnailUrl: '/images/vr/mountain.jpg'
    },
    {
      id: 'space-journey',
      name: 'Voyage Spatial',
      title: 'Odyssée dans l\'Espace',
      description: 'Voyagez à travers l\'univers et découvrez des galaxies lointaines',
      duration: 1500,
      category: 'adventure',
      intensity: 5,
      difficulty: 'hard',
      immersionLevel: 'extreme',
      goalType: 'stimulation',
      interactive: true,
      tags: ['espace', 'science-fiction', 'exploration'],
      recommendedMood: 'adventurous',
      thumbnailUrl: '/images/vr/space.jpg'
    },
    {
      id: 'underwater-garden',
      name: 'Jardin Sous-Marin',
      title: 'Paradis Aquatique',
      description: 'Nagez parmi les coraux colorés et les poissons tropicaux',
      duration: 800,
      category: 'relaxation',
      intensity: 3,
      difficulty: 'medium',
      immersionLevel: 'high',
      goalType: 'relaxation',
      interactive: true,
      tags: ['océan', 'poissons', 'coraux'],
      recommendedMood: 'peaceful',
      thumbnailUrl: '/images/vr/underwater.jpg'
    },
    {
      id: 'aurora-borealis',
      name: 'Aurores Boréales',
      title: 'Spectacle Lumineux Arctique',
      description: 'Admirez les aurores boréales dans un paysage arctique magique',
      duration: 700,
      category: 'contemplation',
      intensity: 2,
      difficulty: 'easy',
      immersionLevel: 'high',
      goalType: 'inspiration',
      interactive: false,
      tags: ['aurores', 'arctique', 'lumières'],
      recommendedMood: 'wonder',
      thumbnailUrl: '/images/vr/aurora.jpg'
    }
  ];

  const getIntensityIcon = (intensity: number) => {
    if (intensity <= 2) return <Waves className="h-4 w-4" />;
    if (intensity <= 4) return <TreePine className="h-4 w-4" />;
    return <Mountain className="h-4 w-4" />;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-blue-500';
    if (intensity <= 4) return 'text-green-500';
    return 'text-red-500';
  };

  const startSession = (template: VRSessionTemplate) => {
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      templateId: template.id,
      userId: 'current-user',
      startTime: new Date().toISOString(),
      duration: 0,
      completed: false,
      progress: 0
    };

    setActiveSession(newSession);
    setSelectedTemplate(template);
    
    // Simulation du progrès de session
    const interval = setInterval(() => {
      setSessionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, (template.duration * 1000) / 100);
  };

  const endSession = () => {
    if (activeSession) {
      const completedSession: VRSession = {
        ...activeSession,
        endTime: new Date().toISOString(),
        duration: Date.now() - new Date(activeSession.startTime).getTime(),
        completed: true,
        progress: 1
      };

      setSessions([completedSession, ...sessions]);
      setActiveSession(null);
      setSelectedTemplate(null);
      setSessionProgress(0);
    }
  };

  const pauseSession = () => {
    // Logique de pause
    console.log('Session mise en pause');
  };

  const resumeSession = () => {
    // Logique de reprise
    console.log('Session reprise');
  };

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Headphones className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Réalité Virtuelle Thérapeutique</h1>
            <p className="text-muted-foreground">Explorez des environnements immersifs pour votre bien-être</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isVRAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isVRAvailable ? 'VR Disponible' : 'VR Non Disponible'}
          </span>
        </div>
      </motion.div>

      {activeSession && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-purple/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" />
                  <span>Session Active: {selectedTemplate.title}</span>
                </CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  En cours
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={sessionProgress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>{sessionProgress.toFixed(0)}% complété</span>
                  <span>
                    {Math.floor((selectedTemplate.duration * sessionProgress) / 100 / 60)}:
                    {String(Math.floor(((selectedTemplate.duration * sessionProgress) / 100) % 60)).padStart(2, '0')} / 
                    {Math.floor(selectedTemplate.duration / 60)}:
                    {String(selectedTemplate.duration % 60).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={pauseSession} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={endSession} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explorer</TabsTrigger>
          <TabsTrigger value="sessions">Mes Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progrès</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Environnements Disponibles</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="meditation">Méditation</SelectItem>
                <SelectItem value="adventure">Aventure</SelectItem>
                <SelectItem value="exploration">Exploration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vrTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < template.intensity ? 'text-yellow-400 fill-current' : 'text-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-lg">{template.title}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor(template.duration / 60)} min</span>
                          <div className={`flex items-center space-x-1 ${getIntensityColor(template.intensity)}`}>
                            {getIntensityIcon(template.intensity)}
                            <span>Niveau {template.intensity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {template.interactive && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Interactif
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => startSession(template)}
                        disabled={!!activeSession}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
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

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Historique des Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Headphones className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Aucune session VR complétée</p>
                  <p className="text-sm text-muted-foreground">Commencez votre première expérience immersive !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const template = vrTemplates.find(t => t.id === session.templateId);
                    return (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{template?.title || 'Session inconnue'}</h3>
                          <Badge variant={session.completed ? 'default' : 'secondary'}>
                            {session.completed ? 'Complétée' : 'Interrompue'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(session.startTime).toLocaleDateString('fr-FR')}</span>
                          <span>{Math.floor((session.duration || 0) / 60000)} min</span>
                          <Progress value={(session.progress || 0) * 100} className="flex-1 h-2" />
                          <span>{Math.round((session.progress || 0) * 100)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Sessions Totales</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sessions.length}</div>
                <p className="text-sm text-muted-foreground">Depuis le début</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Temps Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60000)}
                </div>
                <p className="text-sm text-muted-foreground">Minutes d'immersion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Taux de Complétion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {sessions.length > 0 
                    ? Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Sessions terminées</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environnements Préférés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vrTemplates.slice(0, 3).map((template, index) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {sessions.filter(s => s.templateId === template.id).length} sessions
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Paramètres VR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Qualité Graphique</label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Volume Audio</label>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-4 w-4" />
                  <Progress value={75} className="flex-1" />
                  <span className="text-sm">75%</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Mode Confort</label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Réduction du mal des transports</h4>
                    <p className="text-sm text-muted-foreground">Active des options pour réduire la nausée</p>
                  </div>
                  <Button variant="outline" size="sm">Activé</Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Environnement Préféré</label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatique</SelectItem>
                    <SelectItem value="day">Jour</SelectItem>
                    <SelectItem value="night">Nuit</SelectItem>
                    <SelectItem value="sunset">Coucher de soleil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VRPage;
