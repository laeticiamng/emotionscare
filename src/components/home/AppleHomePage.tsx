// @ts-nocheck
/**
 * AppleHomePage - Homepage style Apple
 * Parcours simplifié : Hero > Comment ça marche > Features > Showcase > Modules > Social Proof > CTA
 * 6 sections + footer pour éviter la fatigue de scroll
 */

import React, { lazy, Suspense } from 'react';
import SharedHeader from '@/components/layout/SharedHeader';
import AppleHeroSection from '@/components/home/AppleHeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import AnimatedPresentationSection from '@/components/home/AnimatedPresentationSection';
import AtAGlanceSection from '@/components/home/AtAGlanceSection';
import NyveeChat from '@/components/nyvee/NyveeChat';
import XPBar from '@/components/gamification/XPBar';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load below-the-fold sections for better FCP/LCP
const AppleFeatureSection = lazy(() => import('@/components/home/AppleFeatureSection'));
const AppleShowcaseSection = lazy(() => import('@/components/home/AppleShowcaseSection'));
const ModulesHighlightSection = lazy(() => import('@/components/home/ModulesHighlightSection'));

const SocialProofSection = lazy(() => import('@/components/home/SocialProofSection'));
const FAQSection = lazy(() => import('@/components/home/FAQSection'));
const SecurityTrustSection = lazy(() => import('@/components/home/SecurityTrustSection'));
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
        <AppleHeroSection />

        <HowItWorksSection />
        <AtAGlanceSection />
        <AnimatedPresentationSection />
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
          <SocialProofSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <SecurityTrustSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection />
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
