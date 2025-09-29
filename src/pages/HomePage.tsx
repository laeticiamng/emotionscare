import React, { useEffect } from 'react';

import PageSEO from '@/components/seo/PageSEO';
import { PrimaryCTA } from '@/features/dashboard/PrimaryCTA';
import { DashboardCards } from '@/features/dashboard/DashboardCards';
import { Who5InviteBanner } from '@/features/dashboard/Who5InviteBanner';
import { ZeroNumberBoundary } from '@/features/dashboard/ZeroNumberBoundary';
import { useWho5Orchestration } from '@/features/orchestration/useWho5Orchestration';
import { AssessmentWrapper } from '@/components/assess';
import { isAssessmentEnabled } from '@/lib/assess/features';

const HomePage: React.FC = () => {
  const who5 = useWho5Orchestration();

  useEffect(() => {
    who5.apply();
  }, [who5]);

  return (
    <ZeroNumberBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <PageSEO title="Plan du jour" description="Un plan du jour vivant, sans chiffres, guidé par votre ressenti." />
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8" aria-label="Plan du jour">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Plan du jour</p>
            <h1 className="text-3xl font-semibold text-slate-50">{who5.summaryLabel}</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Chaque proposition s’adapte à vos réponses récentes au mini questionnaire bien-être.
            </p>
          </header>

          {who5.due && (
            <Who5InviteBanner summary={who5.summaryLabel} tone={who5.tone} onStart={who5.start} onSnooze={() => who5.snooze()} />
          )}

          <AssessmentWrapper
            instrument="WHO5"
            title="Mini bien-être"
            description="5 questions courtes pour adapter votre plan du jour"
            context="weekly"
            estimatedTime={2}
            onComplete={(badges) => {
              // badges verbaux influencent l'ordre des cartes et le ton
              console.log('WHO5 badges:', badges);
            }}
            className="mb-6"
          />

          <PrimaryCTA kind={who5.primaryCta} tone={who5.tone} />

          <DashboardCards order={who5.cardOrder} tone={who5.tone} />
        </main>
      </div>
    </ZeroNumberBoundary>
  );
};

export default HomePage;
