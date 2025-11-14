/**
 * Page d'analytics avancées
 * Affiche le dashboard complet avec graphiques et quêtes
 */

import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard';
import { DailyQuestsPanel } from '@/components/quests/DailyQuestsPanel';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdvancedAnalyticsPage: React.FC = () => {
  usePageSEO({
    title: 'Analytics Avancées - Statistiques & Progression',
    description: 'Suivez votre progression détaillée avec des graphiques, comparaisons et prédictions IA. Complétez des quêtes quotidiennes pour gagner des récompenses.',
    keywords: 'analytics, statistiques, progression, quêtes, graphiques, prédictions IA'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/app/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Analytics Avancées</h1>
            <p className="text-muted-foreground">
              Suivez votre progression et complétez des quêtes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdvancedAnalyticsDashboard />
          </div>
          
          <div className="lg:col-span-1">
            <DailyQuestsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
