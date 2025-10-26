// @ts-nocheck
/**
 * ModernHomePage - Version améliorée de la page d'accueil
 * Conserve l'apparence existante tout en ajoutant des fonctionnalités modernes
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedHomePage from '@/pages/unified/UnifiedHomePage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  User, 
  Bell, 
  Bookmark,
  TrendingUp,
  Zap,
  Shield,
  Star,
  Clock,
  Activity
} from 'lucide-react';

const ModernHomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState(3);
  const [userProgress, setUserProgress] = useState(75);
  const [onlineUsers, setOnlineUsers] = useState(1247);

  // Simulation d'activité en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const userStats = {
    weeklyGoals: 4,
    completedSessions: 12,
    totalPoints: 2450,
    currentStreak: 7
  };

  const recentAchievements = [
    { name: 'Semaine productive', icon: '🎯', date: 'Aujourd\'hui' },
    { name: 'Premier badge', icon: '🏆', date: 'Hier' },
    { name: 'Connexion quotidienne', icon: '🔥', date: 'Il y a 2 jours' }
  ];

  const quickActions = [
    { 
      title: 'Musique émotionnelle', 
      desc: 'Génération musicale par IA',
      icon: <Activity className="h-5 w-5" />,
      href: '/app/emotion-music',
      color: 'bg-pink-500'
    },
    { 
      title: 'Démarrer une session', 
      desc: 'Commencer votre parcours bien-être',
      icon: <Zap className="h-5 w-5" />,
      href: '/app/sessions/new',
      color: 'bg-blue-500'
    },
    { 
      title: 'Voir mes statistiques', 
      desc: 'Analyser vos progrès',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/app/analytics',
      color: 'bg-green-500'
    },
    { 
      title: 'Gérer mon profil', 
      desc: 'Personnaliser votre expérience',
      icon: <User className="h-5 w-5" />,
      href: '/app/profile',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="relative">
      {/* Bannière utilisateur connecté améliorée */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b border-primary/20 py-4">
          <div className="container mx-auto px-4">
            {/* Barre de statut */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <User className="h-8 w-8 p-1 bg-primary/20 rounded-full" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Bonjour <strong>{user.email?.split('@')[0] || 'Utilisateur'}</strong></span>
                    <Badge variant="secondary" className="text-xs">Pro</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dernière connexion: Aujourd'hui • {onlineUsers.toLocaleString()} utilisateurs en ligne
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Accès rapide */}
                <Link to="/app/home">
                  <Button variant="default" size="sm" className="gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Accéder à votre espace
                  </Button>
                </Link>
              </div>
            </div>

            {/* Progression et stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Progression</div>
                      <div className="text-xs text-muted-foreground">Cette semaine</div>
                    </div>
                    <div className="text-lg font-bold text-primary">{userProgress}%</div>
                  </div>
                  <Progress value={userProgress} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Sessions</div>
                      <div className="text-xs text-muted-foreground">Ce mois-ci</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{userStats.completedSessions}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Points</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{userStats.totalPoints.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Série</div>
                      <div className="text-xs text-muted-foreground">Jours consécutifs</div>
                    </div>
                    <div className="text-lg font-bold text-orange-600">{userStats.currentStreak}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Actions rapides</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="bg-white/30 backdrop-blur-sm border-white/20 hover:bg-white/40 transition-all cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            {action.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{action.title}</div>
                            <div className="text-xs text-muted-foreground">{action.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Derniers succès */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Derniers succès</div>
              <div className="flex gap-2">
                {recentAchievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <span>{achievement.icon}</span>
                    <span className="text-xs">{achievement.name}</span>
                    <span className="text-xs text-muted-foreground">• {achievement.date}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Page d'accueil unifiée originale */}
      <UnifiedHomePage variant="full" />

      {/* Section fonctionnalités modernes (pour tous les utilisateurs) */}
      <div className="bg-gradient-to-b from-muted/20 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Découvrez nos fonctionnalités</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une expérience complète pour votre bien-être émotionnel avec des outils modernes et intuitifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fonctionnalité 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Suivi en temps réel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Moniteur vos émotions et votre bien-être avec des analyses en temps réel et des insights personnalisés.
                </p>
                <div className="mt-4">
                  <Progress value={85} className="h-2" />
                  <div className="text-sm text-muted-foreground mt-1">85% de satisfaction utilisateur</div>
                </div>
              </CardContent>
            </Card>

            {/* Fonctionnalité 2 */}
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Données sécurisées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vos données sont protégées par un chiffrement de niveau bancaire et une conformité RGPD totale.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Certifié
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Fonctionnalité 3 */}
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Expérience premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interface moderne, responsive et accessible, conçue pour une expérience utilisateur exceptionnelle.
                </p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9/5)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="bg-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{onlineUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">98.7%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">Support disponible</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">150k+</div>
              <div className="text-sm text-muted-foreground">Sessions complétées</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHomePage;