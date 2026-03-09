/**
 * AppleHomePage - Homepage style Apple
 * Parcours simplifié : Hero > En bref > Features > Modules > Social Proof > CTA
 * Réduit de 10 à 7 sections pour éviter la fatigue de scroll
 */

import React, { lazy, Suspense } from 'react';
import SharedHeader from '@/components/layout/SharedHeader';
import AppleHeroSection from '@/components/home/AppleHeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import NyveeChat from '@/components/nyvee/NyveeChat';
import XPBar from '@/components/gamification/XPBar';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load below-the-fold sections for better FCP/LCP
const AppleFeatureSection = lazy(() => import('@/components/home/AppleFeatureSection'));
const AppleShowcaseSection = lazy(() => import('@/components/home/AppleShowcaseSection'));
const ModulesHighlightSection = lazy(() => import('@/components/home/ModulesHighlightSection'));
const InstitutionalFeaturesSection = lazy(() => import('@/components/home/InstitutionalFeaturesSection'));
const SocialProofSection = lazy(() => import('@/components/home/SocialProofSection'));
const AppleCTASection = lazy(() => import('@/components/home/AppleCTASection'));
const Footer = lazy(() => import('@/components/home/Footer'));

const SectionSkeleton = () => (
  <div className="py-16 bg-background">
    <div className="container">
      <div className="h-48 bg-muted/30 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const AppleHomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none"
      >
        Aller au contenu principal
      </a>

      <SharedHeader extraDesktopCTA={isAuthenticated ? <XPBar /> : undefined} />

      <main id="main-content" role="main" className="pt-16">
        {/* Announcement pill — opens Coach Chat on click */}
        <div className="pt-6 pb-2">
          <AnnouncementBanner
            message="Nouveau : Essayez un exercice de respiration en 2 minutes"
            href={isAuthenticated ? '/app/breathing' : '/signup'}
            linkLabel={isAuthenticated ? 'Commencer' : 'Essayer'}
            variant="pill"
            storageKey="home-announcement-v2"
            dismissible
          />
        </div>

        <AppleHeroSection />

        <HowItWorksSection />
        <GeoSummarySection />
        <Suspense fallback={<SectionSkeleton />}>
          <AppleFeatureSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AppleShowcaseSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ModulesHighlightSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <InstitutionalFeaturesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <SocialProofSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AppleCTASection />
        </Suspense>
      </main>

      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      <NyveeChat />
    </div>
  );
};

export default AppleHomePage;
