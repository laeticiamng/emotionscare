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
import { useHomePageAnalytics } from '@/hooks/useHomePageAnalytics';
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
  Building2,
} from 'lucide-react';
import EnrichedHeroSection from '@/components/home/EnrichedHeroSection';
import OnboardingGuide from '@/components/home/OnboardingGuide';
import QuickStartModules from '@/components/home/QuickStartModules';
import CommunityEngagement from '@/components/home/CommunityEngagement';
import AcademySection from '@/components/home/AcademySection';
import ParkPreviewCard from '@/components/home/ParkPreviewCard';
import TrustBadges from '@/components/home/TrustBadges';
import LiveCounter from '@/components/home/LiveCounter';
import NewsletterSection from '@/components/home/NewsletterSection';
import SocialProofBar from '@/components/home/SocialProofBar';
import CookieConsent from '@/components/home/CookieConsent';
import FloatingCTA from '@/components/home/FloatingCTA';
import PressLogos from '@/components/home/PressLogos';
import ScrollProgress from '@/components/home/ScrollProgress';

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

  // Hooks analytics
  const { trackCTAClick, trackCTAView } = useHomePageAnalytics();

  // Tracker les vues CTA au chargement de la page
  React.useEffect(() => {
    trackCTAView('hero-cta');
    trackCTAView('header-signup');
    trackCTAView('final-cta');
  }, [trackCTAView]);

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
      {/* Skip to main content - Accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none"
      >
        Aller au contenu principal
      </a>

      {/* Scroll Progress Indicator */}
      <ScrollProgress variant="bar" />

      {/* Header avec nom de la plateforme */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-bold text-xl text-primary hover:text-primary/80 transition-colors focus-enhanced"
            aria-label="EmotionsCare - Accueil"
          >
            EmotionsCare
          </Link>
          
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Navigation principale">
            {/* Lien vers toutes les pages */}
            <Link to="/navigation">
              <Button variant="ghost" size="sm" className="gap-2">
                <Map className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Explorer</span>
              </Button>
            </Link>
            
            {/* Bouton Entreprise B2B - toujours visible */}
            <Link to="/b2b">
              <Button variant="outline" size="sm" className="gap-2 border-blue-500/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Entreprise</span>
              </Button>
            </Link>
            
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
                <Link to="/signup" onClick={() => trackCTAClick('header-signup')}>
                  <Button size="sm">Commencer</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Bannière utilisateur connecté - version interventionnelle */}
      {isAuthenticated && user && (
        <div className="bg-muted/50 border-b border-border py-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href} onClick={() => trackCTAClick(`quick-action-${action.title}`)}>
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

      <main id="main-content" role="main">
        {/* SECTION 1: Hero interventionnel */}
        <EnrichedHeroSection />

        {/* SECTION 2: Trust Badges - Badges de confiance */}
        <TrustBadges variant="inline" className="container mx-auto" />

        {/* SECTION 3: Live Counter - Stats temps réel */}
        {!isAuthenticated && (
          <div className="py-8 bg-muted/10">
            <div className="container mx-auto px-4">
              <LiveCounter variant="horizontal" />
            </div>
          </div>
        )}

        {/* SECTION 4: Carte du Parc - Accès direct */}
        <ParkPreviewCard />

        {/* SECTION 5: Onboarding ultra-court */}
        <OnboardingGuide />

        {/* SECTION 6: Protocoles d'activation */}
        <QuickStartModules />


        {/* SECTION 7: Logos Presse - Social Proof */}
        <PressLogos variant="scroll" />

        {/* SECTION 8: Academy - Comprendre pour reprendre la main */}
        <AcademySection />

        {/* SECTION 9: Engagement communautaire */}
        <CommunityEngagement />

        {/* SECTION 10: Témoignages (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>

        {/* SECTION 11: Newsletter */}
        <NewsletterSection variant="full" />

        {/* SECTION 12: FAQ (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection />
        </Suspense>

        {/* CTA Final */}
        <section className="bg-muted/30 py-12" aria-labelledby="cta-final-title">
          <div className="container mx-auto px-4 text-center">
            <h3 id="cta-final-title" className="text-2xl font-bold mb-4">Prêt à reprendre le contrôle ?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Rejoins les {onlineCount > 0 ? onlineCount.toLocaleString() : '2 500+'} personnes en ligne qui prennent soin d'elles en ce moment.
            </p>
            <Button size="lg" asChild onClick={() => trackCTAClick('final-cta')}>
              <Link to="/signup">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* SECTION 13: Footer (lazy loaded) */}
      <Suspense fallback={<div className="h-48 bg-muted/30" />}>
        <Footer />
      </Suspense>

      {/* Floating elements - Social Proof, CTA, Cookie Consent */}
      <SocialProofBar position="bottom" interval={10000} showOnMobile />
      {!isAuthenticated && (
        <FloatingCTA 
          showAfterScroll={800} 
          onView={() => trackCTAView('floating-cta')}
          onClick={() => trackCTAClick('floating-cta')}
        />
      )}
      <CookieConsent />
    </div>
  );
};

export default ModernHomePage;
