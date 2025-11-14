/**
 * ModernHomePage - Version améliorée de la page d'accueil
 * Conserve l'apparence existante tout en ajoutant des fonctionnalités modernes
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedHomePage from '@/pages/unified/UnifiedHomePage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useUserStatsQuery, useUserStatsRealtime } from '@/hooks/useUserStatsQuery';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { StatsCard, StatsGrid } from '@/components/common/StatsCard';
import { 
  ArrowRight, 
  User, 
  Bell, 
  TrendingUp,
  Zap,
  Activity,
  Target,
  Flame,
  Trophy,
  ShoppingBag,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  name: string;
  icon: string;
  date: string;
}

interface QuickAction {
  title: string;
  desc: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const ModernHomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { stats: userStats, loading: statsLoading } = useUserStatsQuery();
  const { onlineCount } = useOnlineUsers();
  const [notifications] = useState<number>(3);
  
  // Écouter les changements en temps réel pour auto-refresh
  useUserStatsRealtime();

  const recentAchievements: Achievement[] = [
    { name: 'Semaine productive', icon: '🎯', date: 'Aujourd\'hui' },
    { name: 'Premier badge', icon: '🏆', date: 'Hier' },
    { name: 'Connexion quotidienne', icon: '🔥', date: 'Il y a 2 jours' }
  ];

  const quickActions: QuickAction[] = [
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
                  <User className="h-8 w-8 p-1 bg-primary/20 rounded-full" aria-hidden="true" />
                  <div 
                    className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                    aria-label="En ligne"
                  ></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Bonjour <strong>{user.email?.split('@')[0] || 'Utilisateur'}</strong></span>
                    <Badge variant="secondary" className="text-xs">Pro</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dernière connexion: Aujourd'hui • {onlineCount > 0 ? `${onlineCount} utilisateur${onlineCount > 1 ? 's' : ''} en ligne` : 'Chargement...'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  aria-label={`Notifications (${notifications} nouvelle${notifications > 1 ? 's' : ''})`}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                      aria-label={`${notifications} notification${notifications > 1 ? 's' : ''}`}
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Accès rapide */}
                <Link to="/app/home">
                  <Button variant="default" size="sm" className="gap-2">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Accéder à votre espace
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats rapides avec composants réutilisables */}
            <StatsGrid columns={4}>
              <StatsCard
                label="Objectifs"
                subtitle="Cette semaine"
                value={userStats.weeklyGoals}
                icon={Target}
                iconColor="text-blue-500"
                valueColor="text-blue-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={0}
              />
              
              <StatsCard
                label="Sessions"
                subtitle="Complétées"
                value={userStats.completedSessions}
                icon={Activity}
                iconColor="text-green-500"
                valueColor="text-green-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={1}
              />
              
              <StatsCard
                label="Points"
                subtitle={`Niveau ${userStats.level}`}
                value={userStats.totalPoints}
                icon={Trophy}
                iconColor="text-yellow-500"
                valueColor="text-yellow-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={2}
              />
              
              <StatsCard
                label="Série"
                subtitle="Jours consécutifs"
                value={userStats.currentStreak}
                icon={Flame}
                iconColor="text-orange-500"
                valueColor="text-orange-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={3}
              />
            </StatsGrid>

            {/* Actions rapides */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Actions rapides</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="bg-card/30 backdrop-blur-sm border-border/20 hover:bg-card/40 transition-all cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.color} text-primary-foreground`} aria-hidden="true">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Fonctionnalité Store - Mise en avant */}
            <Card className="text-center hover:shadow-xl transition-all border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <div className="h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg" aria-hidden="true">
                  <ShoppingBag className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">EmotionsCare Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Collection premium de produits bien-être : luminothérapie, relaxation, objets sensoriels. Chaque achat débloque l'accès aux modules digitaux correspondants.
                </p>
                <Link to="/store">
                  <Button className="w-full shadow-md hover:shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Découvrir la boutique
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Fonctionnalité 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">
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
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">
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
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">
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
              <div className="text-3xl font-bold text-primary">{onlineCount > 0 ? onlineCount.toLocaleString() : '...'}</div>
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