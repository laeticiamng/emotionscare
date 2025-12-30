/**
 * ModernHomePage - Version interventionnelle de la page d'accueil
 * Vision: EmotionsCare n'est pas une plateforme, c'est un réflexe émotionnel
 */

import React, { useState, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useUserStatsQuery, useUserStatsRealtime } from '@/hooks/useUserStatsQuery';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useStatsNotifications } from '@/hooks/useStatsNotifications';
import { StatsCard, StatsGrid } from '@/components/common/StatsCard';
import {
  ArrowRight,
  User,
  Bell,
  Zap,
  Target,
  Flame,
  StopCircle,
  Moon,
  Map,
} from 'lucide-react';
import EnrichedHeroSection from '@/components/home/EnrichedHeroSection';
import OnboardingGuide from '@/components/home/OnboardingGuide';
import QuickStartModules from '@/components/home/QuickStartModules';
import CommunityEngagement from '@/components/home/CommunityEngagement';
import AcademySection from '@/components/home/AcademySection';
import ParkPreviewCard from '@/components/home/ParkPreviewCard';

// Code splitting : lazy load des sections non critiques
const FAQSection = lazy(() => import('@/components/home/FAQSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const Footer = lazy(() => import('@/components/home/Footer'));

// Skeleton de chargement pour sections lazy
const SectionSkeleton = () => (
  <div className="py-16 bg-background">
    <div className="container">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
        <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
  
  // Activer les notifications automatiques pour les changements de stats
  useStatsNotifications(userStats, statsLoading);

  // Actions rapides reframées - interventions, pas fonctionnalités
  const quickActions: QuickAction[] = [
    { 
      title: 'Stop urgence', 
      desc: 'Interrompre une montée anxieuse',
      icon: <StopCircle className="h-5 w-5" />,
      href: '/app/scan?mode=stop',
      color: 'bg-red-500'
    },
    { 
      title: 'Reset rapide', 
      desc: 'Récupérer en 3 minutes',
      icon: <Zap className="h-5 w-5" />,
      href: '/app/scan?mode=reset',
      color: 'bg-amber-500'
    },
    { 
      title: 'Arrêt nocturne', 
      desc: 'Forcer le cerveau à couper',
      icon: <Moon className="h-5 w-5" />,
      href: '/app/scan?mode=mental-stop',
      color: 'bg-indigo-500'
    },
  ];

  return (
    <div className="relative">
      {/* Header avec nom de la plateforme */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-bold text-xl text-primary hover:text-primary/80 transition-colors focus-enhanced"
            aria-label="EmotionsCare - Accueil"
          >
            EmotionsCare
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/app/home">
                <Button variant="ghost" size="sm" className="gap-2">
                  Mon espace
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Se connecter</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Commencer</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {/* Bannière utilisateur connecté - version interventionnelle */}
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
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {onlineCount > 0 ? `${onlineCount} personnes en ligne en ce moment` : 'Chargement...'}
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
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Accès rapide */}
                <Link to="/app/home">
                  <Button variant="default" size="sm" className="gap-2">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Mon espace
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats rapides - reframées */}
            <StatsGrid columns={4}>
              <StatsCard
                label="Sessions"
                subtitle="Cette semaine"
                value={userStats.completedSessions}
                icon={Target}
                iconColor="text-blue-500"
                valueColor="text-blue-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={0}
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
                delay={1}
              />

              <StatsCard
                label="Stop"
                subtitle="Crises interrompues"
                value={userStats.weeklyGoals}
                icon={StopCircle}
                iconColor="text-red-500"
                valueColor="text-red-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={2}
              />

              <StatsCard
                label="Resets"
                subtitle="Ce mois"
                value={userStats.totalPoints}
                icon={Zap}
                iconColor="text-amber-500"
                valueColor="text-amber-600"
                loading={statsLoading}
                variant="gradient"
                size="sm"
                delay={3}
              />
            </StatsGrid>

            {/* Actions rapides - interventions */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Besoin d'intervenir maintenant ?</div>
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
          </div>
        </div>
      )}

      {/* SECTION 1: Hero interventionnel */}
      <EnrichedHeroSection />

      {/* SECTION 2: Carte du Parc - Accès direct */}
      <ParkPreviewCard />

      {/* SECTION 3: Onboarding ultra-court */}
      <OnboardingGuide />

      {/* SECTION 4: Protocoles d'activation */}
      <QuickStartModules />

      {/* SECTION 5: Academy - Comprendre pour reprendre la main */}
      <AcademySection />

      {/* SECTION 6: Engagement communautaire */}
      <CommunityEngagement />

      {/* SECTION 6: Témoignages (lazy loaded) */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      {/* SECTION 7: FAQ (lazy loaded) */}
      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Prêt à reprendre le contrôle ?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Rejoins les {onlineCount > 0 ? onlineCount.toLocaleString() : '...'} personnes en ligne qui prennent soin d'elles en ce moment.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* SECTION 8: Footer (lazy loaded) */}
      <Suspense fallback={<div className="h-48 bg-muted/30" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default ModernHomePage;
