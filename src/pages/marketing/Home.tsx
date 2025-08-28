import React from 'react';
import { useSegment } from '@/hooks/useSegment';
import { SegmentSwitch } from '@/components/landing/SegmentSwitch';
import { Hero } from '@/components/marketing/Hero';
import { FeatureCards } from '@/components/marketing/FeatureCards';
import { ScreensShowcase } from '@/components/marketing/ScreensShowcase';
import { TrustStrip } from '@/components/marketing/TrustStrip';
import { CTAStrip } from '@/components/marketing/CTAStrip';
import { Footer } from '@/components/marketing/Footer';

/**
 * Page d'accueil marketing avec switch B2C/B2B
 */
const MarketingHome: React.FC = () => {
  const { segment, setSegment } = useSegment();

  return (
    <div 
      className="min-h-screen bg-background"
      data-testid="page-root"
    >
      {/* Navigation with segment switch */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg" />
              <span className="text-xl font-bold">EmotionsCare</span>
            </div>

            {/* Segment Switch */}
            <SegmentSwitch value={segment} onChange={setSegment} />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section>
          <Hero segment={segment} />
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <FeatureCards segment={segment} />
        </section>

        {/* Screenshots Showcase */}
        <section className="py-16">
          <ScreensShowcase />
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-muted/30">
          <TrustStrip />
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <CTAStrip segment={segment} />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MarketingHome;