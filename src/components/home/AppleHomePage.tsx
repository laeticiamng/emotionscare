/**
 * AppleHomePage - Homepage révolutionnaire style Apple
 * Minimaliste, impactante, avec animations fluides et storytelling visuel
 */

import React, { lazy, Suspense } from 'react';
import SharedHeader from '@/components/layout/SharedHeader';
import AppleHeroSection from '@/components/home/AppleHeroSection';
import AnnouncementBanner from '@/components/ui/announcement-banner';
import NyveeChat from '@/components/nyvee/NyveeChat';
import XPBar from '@/components/gamification/XPBar';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load below-the-fold sections for better FCP/LCP
const AppleFeatureSection = lazy(() => import('@/components/home/AppleFeatureSection'));
const AppleShowcaseSection = lazy(() => import('@/components/home/AppleShowcaseSection'));
const AppleStatsSection = lazy(() => import('@/components/home/AppleStatsSection'));
const AppleCTASection = lazy(() => import('@/components/home/AppleCTASection'));
const ModulesHighlightSection = lazy(() => import('@/components/home/ModulesHighlightSection'));
const SocialProofSection = lazy(() => import('@/components/home/SocialProofSection'));
const ProductScreenshots = lazy(() => import('@/components/marketing/ProductScreenshots'));
const GeoSummarySection = lazy(() => import('@/components/home/GeoSummarySection'));
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
        {/* Announcement pill */}
        <div className="pt-6 pb-2">
          <AnnouncementBanner
            message="Nouveau : Coach IA Nyvée disponible"
            href="/features"
            linkLabel="Découvrir"
            variant="pill"
            storageKey="home-announcement-v1"
          />
        </div>

        <AppleHeroSection />

        <Suspense fallback={<SectionSkeleton />}>
          <GeoSummarySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AppleFeatureSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AppleShowcaseSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AppleStatsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProductScreenshots />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ModulesHighlightSection />
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
