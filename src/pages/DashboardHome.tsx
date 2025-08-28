import React from 'react';
import { useDashboardWeekly } from '@/hooks/useDashboardWeekly';
import { useContinue } from '@/hooks/useContinue';
import { useNudges } from '@/hooks/useNudges';
import { GlowGauge } from '@/components/dashboard/GlowGauge';
import { WeeklyBars } from '@/components/dashboard/WeeklyBars';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ContinueCard } from '@/components/dashboard/ContinueCard';
import { BubbleBeatMini } from '@/components/dashboard/BubbleBeatMini';
import { NudgeCard } from '@/components/dashboard/NudgeCard';
import { StatusStrip } from '@/components/dashboard/StatusStrip';

/**
 * Dashboard B2C - Page d'accueil personnalisée avec widgets
 */
const DashboardHome: React.FC = () => {
  const { data: weekly } = useDashboardWeekly();
  const { item: continueItem } = useContinue();
  const { nudge } = useNudges();

  return (
    <main 
      className="min-h-screen bg-background"
      data-testid="page-root"
    >
      {/* Status strip */}
      <StatusStrip />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome section */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Bonjour ! 👋
          </h1>
          <p className="text-muted-foreground">
            Votre espace bien-être vous attend
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Instant Glow gauge */}
            <section>
              <h2 className="sr-only">État du jour</h2>
              <GlowGauge data={weekly?.today} />
            </section>

            {/* Weekly bars */}
            <section>
              <h2 className="sr-only">Tendance 7 jours</h2>
              <WeeklyBars data={weekly?.days} />
            </section>

            {/* Continue card */}
            {continueItem && (
              <section>
                <h2 className="sr-only">Reprendre une session</h2>
                <ContinueCard item={continueItem} />
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <section>
              <h2 className="sr-only">Actions rapides</h2>
              <QuickActions />
            </section>

            {/* Bubble beat preview */}
            <section>
              <h2 className="sr-only">Rythme cardiaque</h2>
              <BubbleBeatMini />
            </section>

            {/* Nudge card */}
            {nudge && (
              <section>
                <h2 className="sr-only">Suggestion</h2>
                <NudgeCard nudge={nudge} />
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardHome;