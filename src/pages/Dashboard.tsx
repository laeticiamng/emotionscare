
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Book, 
  Calendar, 
  ChevronRight, 
  Clock,
  Heart, 
  LineChart, 
  Music, 
  Plus, 
  Sparkles,
  Timer,
  Users
} from "lucide-react";
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Shell from '@/Shell';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace personnel EmotionsCare
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="progress">Progrès</TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings" className="flex items-center gap-1">
                Personnaliser
                <ChevronRight size={16} />
              </Link>
            </Button>
          </div>

          <TabsContent value="overview">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* État émotionnel du jour */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Comment vous sentez-vous aujourd'hui ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {["Calme", "Joyeux", "Fatigué", "Stressé", "Motivé"].map((mood, idx) => (
                        <Button key={idx} variant="outline" className="h-auto py-6 flex-col gap-2 hover:bg-background/60">
                          <EmotionIcon mood={mood} />
                          <span>{mood}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Modules récents */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4">Activités recommandées</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Music className="h-5 w-5 text-indigo-500" />
                        Musique thérapeutique
                      </CardTitle>
                      <CardDescription>Détente et bien-être</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Découvrez des compositions musicales adaptées à votre humeur actuelle
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to="/music">Découvrir</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Book className="h-5 w-5 text-emerald-500" />
                        Journal émotionnel
                      </CardTitle>
                      <CardDescription>Introspection guidée</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Notez vos pensées et suivez l'évolution de vos émotions
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to="/journal">Explorer</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-blue-500" />
                        Social Cocoon
                      </CardTitle>
                      <CardDescription>Communauté de soutien</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Échangez avec des personnes partageant des expériences similaires
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to="/social">Rejoindre</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>

              {/* Résumé des progrès et statistiques */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Aperçu de vos progrès</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/vr-analytics" className="flex items-center gap-1">
                      Détails
                      <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    title="Bien-être"
                    value="78%"
                    trend="+12%"
                    description="Depuis le mois dernier"
                    icon={<Heart className="h-4 w-4" />}
                    trendUp={true}
                  />
                  
                  <StatsCard
                    title="Sessions"
                    value="12"
                    trend="+3"
                    description="Cette semaine"
                    icon={<Calendar className="h-4 w-4" />}
                    trendUp={true}
                  />
                  
                  <StatsCard
                    title="Temps total"
                    value="4h 30m"
                    trend="+45m"
                    description="Par rapport à la semaine dernière"
                    icon={<Clock className="h-4 w-4" />}
                    trendUp={true}
                  />
                  
                  <StatsCard
                    title="Séquence"
                    value="8 jours"
                    trend="+2"
                    description="Utilisation continue"
                    icon={<Timer className="h-4 w-4" />}
                    trendUp={true}
                  />
                </div>
              </motion.div>

              {/* Entrées de journal récentes */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Journal récent</h2>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/journal" className="flex items-center gap-1">
                      Voir tout <ChevronRight size={16} />
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Journée productive</CardTitle>
                        <span className="text-sm text-muted-foreground">20/05/2025</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Aujourd'hui a été une journée exceptionnellement productive. J'ai commencé tôt le matin avec une séance de méditation qui m'a permis de me concentrer...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                        Heureux
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/journal/1">Lire</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Rencontre inspirante</CardTitle>
                        <span className="text-sm text-muted-foreground">18/05/2025</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        J'ai eu une conversation fascinante avec un mentor aujourd'hui. Ses conseils sur la gestion de carrière et le développement personnel ont vraiment résonné...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                        Inspiré
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/journal/2">Lire</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button asChild className="flex items-center gap-2">
                    <Link to="/journal/new">
                      <Plus size={16} />
                      Nouvelle entrée
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="activities">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Historique d'activités</CardTitle>
                <CardDescription>
                  Visualisez et suivez vos activités récentes sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Fonctionnalité à venir</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Nous travaillons à l'implémentation d'un historique d'activités détaillé pour suivre votre parcours émotionnel.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/coming-soon">En savoir plus</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Progrès et évolution</CardTitle>
                <CardDescription>
                  Suivez l'évolution de votre bien-être émotionnel au fil du temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analyses en développement</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Des graphiques détaillés de votre évolution émotionnelle seront bientôt disponibles pour vous aider à suivre vos progrès.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/coming-soon">En savoir plus</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

// Composant pour les cartes de statistiques
const StatsCard = ({ 
  title, 
  value, 
  trend, 
  description, 
  icon, 
  trendUp = true 
}: { 
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ReactNode;
  trendUp?: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-sm flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <Sparkles className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1 rotate-90" />}
            {trend}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// Composant pour les icônes d'émotions
const EmotionIcon = ({ mood }: { mood: string }) => {
  const getEmoji = () => {
    switch(mood.toLowerCase()) {
      case 'calme': return '😌';
      case 'joyeux': return '😊';
      case 'fatigué': return '😔';
      case 'stressé': return '😰';
      case 'motivé': return '💪';
      default: return '😐';
    }
  };
  
  return (
    <div className="text-2xl">
      {getEmoji()}
    </div>
  );
};

export default Dashboard;
