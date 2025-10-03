import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCardsGrid from '@/components/dashboard/admin/KpiCardsGrid';
import { GlobalOverviewTabProps, KpiCardProps } from '@types/dashboard';
import { KpiCardStatus } from '@types/dashboard';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({
  data,
  isLoading = false
}) => {
  // First row of KPI cards - Performance metrics
  const performanceMetrics: KpiCardProps[] = [
    {
      id: "engagement",
      title: "Engagement",
      value: "87%",
      delta: {
        value: 12,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    },
    {
      id: "satisfaction",
      title: "Satisfaction",
      value: "92%",
      delta: {
        value: 4,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    },
    {
      id: "stress",
      title: "Stress Moyen",
      value: "31%",
      delta: {
        value: -7,
        trend: "down",
        direction: "down"
      },
      status: "success" as KpiCardStatus
    }
  ];

  // Second row - HR metrics
  const hrMetrics: KpiCardProps[] = [
    {
      id: "utilisateurs_actifs",
      title: "Utilisateurs Actifs",
      value: "219",
      delta: {
        value: 24,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    },
    {
      id: "sessions",
      title: "Sessions Hebdo.",
      value: "412",
      delta: {
        value: -18,
        trend: "down",
        direction: "down"
      },
      status: "warning" as KpiCardStatus
    },
    {
      id: "temps_moyen",
      title: "Temps Moyen",
      value: "18min",
      delta: {
        value: 3,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    }
  ];

  // Third row - Business metrics
  const businessMetrics: KpiCardProps[] = [
    {
      id: "roi",
      title: "ROI Bien-être",
      value: "214%",
      delta: {
        value: 22,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    },
    {
      id: "absences",
      title: "Absences",
      value: "-14%",
      delta: {
        value: -6,
        trend: "down",
        direction: "down"
      },
      status: "success" as KpiCardStatus
    },
    {
      id: "retention",
      title: "Rétention",
      value: "92%",
      delta: {
        value: 2,
        trend: "up",
        direction: "up"
      },
      status: "success" as KpiCardStatus
    }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCardsGrid cards={performanceMetrics} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Métriques RH</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCardsGrid cards={hrMetrics} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Métriques Business</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCardsGrid cards={businessMetrics} />
        </div>
      </section>
    </div>
  );
};

export default GlobalOverviewTab;
