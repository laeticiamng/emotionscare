
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building, Smile, Mail, Bell, User, Settings } from 'lucide-react';
import { trackPageView } from '@/utils/analytics';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUserAvatar, getUserFirstName } from '@/utils/userHelpers';

const B2BUserPremiumDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teamMood, setTeamMood] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [notifications, setNotifications] = useState<{id: number; title: string; content: string; isNew: boolean}[]>([]);
  
  useEffect(() => {
    trackPageView({ title: 'Dashboard Collaborateur B2B' });
    
    // Simulation de chargement des données
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer une humeur aléatoire pour la démo
        const moods = ['positive', 'neutral', 'negative'] as const;
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setTeamMood(randomMood);
        
        // Générer des notifications fictives
        setNotifications([
          { 
            id: 1, 
            title: 'Nouveau module disponible', 
            content: 'Découvrez notre nouveau module de gestion du stress!', 
            isNew: true 
          },
          { 
            id: 2, 
            title: 'Rappel bien-être', 
            content: 'N\'oubliez pas de prendre une pause de 5 minutes toutes les heures.', 
            isNew: true 
          },
          { 
            id: 3, 
            title: 'Mise à jour du profil', 
            content: 'Votre profil a été mis à jour avec succès.', 
            isNew: false 
          }
        ]);
        
        toast({
          title: 'Bienvenue sur votre dashboard',
          description: 'Vos données ont été chargées avec succès.',
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: 'Erreur de chargement',
          description: 'Impossible de charger vos données. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const getMoodEmoji = () => {
    switch (teamMood) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😔';
    }
  };
  
  const getMoodColor = () => {
    switch (teamMood) {
      case 'positive': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'neutral': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'negative': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    }
  };
  
  const getMoodText = () => {
    switch (teamMood) {
      case 'positive': return 'L\'ambiance de l\'équipe est très positive aujourd\'hui!';
      case 'neutral': return 'L\'ambiance de l\'équipe est stable aujourd\'hui.';
      case 'negative': return 'L\'ambiance de l\'équipe semble tendue aujourd\'hui.';
    }
  };
  
  const handleNotificationRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isNew: false } : notif
      )
    );
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/30 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="mr-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
              Espace Collaborateur
            </h1>
            <p className="text-muted-foreground">
              Bonjour {getUserFirstName(user)}, voici l'ambiance de votre équipe aujourd'hui !
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar(user)} alt={user?.name} />
                <AvatarFallback>{getUserFirstName(user).substring(0,2)}</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1" variant="info">
                {user?.role === 'b2b_admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Paramètres</span>
            </Button>
          </motion.div>
        </div>
        
        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte météo émotionnelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle>Météo émotionnelle de l'équipe</CardTitle>
                <CardDescription>
                  Aperçu en temps réel de l'ambiance de votre équipe
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className={`h-24 w-24 rounded-full ${getMoodColor()} flex items-center justify-center text-4xl`}>
                      {getMoodEmoji()}
                    </div>
                    
                    <div className="space-y-4 text-center md:text-left">
                      <h3 className="text-xl font-semibold">{getMoodText()}</h3>
                      <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                        <div className="text-xs rounded-full px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          65% Calme
                        </div>
                        <div className="text-xs rounded-full px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          25% Concentré
                        </div>
                        <div className="text-xs rounded-full px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          10% Enthousiaste
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                        <motion.div 
                          className="bg-blue-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          transition={{ delay: 0.5, duration: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Carte de profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mon profil</CardTitle>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                      <User className="h-10 w-10" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{user?.name || 'Collaborateur'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{user?.email || 'collaborateur@example.com'}</p>
                    
                    <div className="flex gap-2 mb-4">
                      <div className="text-xs rounded-full px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Collaborateur
                      </div>
                      <div className="text-xs rounded-full px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        Premium
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Éditer mon profil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Vos dernières alertes et mises à jour
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 rounded-lg border ${notification.isNew ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-card border-border'}`}
                          onClick={() => handleNotificationRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 h-8 w-8 rounded-full ${notification.isNew ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} flex items-center justify-center`}>
                              {notification.isNew ? <Bell className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                  {notification.title}
                                  {notification.isNew && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                      Nouveau
                                    </span>
                                  )}
                                </h4>
                                <span className="text-xs text-muted-foreground">aujourd'hui</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Modules rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Modules rapides</CardTitle>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Smile className="h-4 w-4 mr-2" />
                      Journal émotionnel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Rappels bien-être
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter le support
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default B2BUserPremiumDashboard;
