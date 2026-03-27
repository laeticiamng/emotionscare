// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageRoot from '@/components/common/PageRoot';
import MusicQueueMetricsDashboard from '@/components/admin/MusicQueueMetricsDashboard';

export default function MusicQueueMetricsPage() {
  const navigate = useNavigate();

  return (
    <PageRoot>
      <div className="container mx-auto p-6 max-w-6xl">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Retour à la page précédente"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
              Métriques - File musicale
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Consultez les statistiques et métriques de la file musicale.
          </p>
        </header>

        <main aria-label="Métriques de la file musicale">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Chargement...
              </div>
            }
          >
            <MusicQueueMetricsDashboard />
          </React.Suspense>
        </main>
      </div>
    </PageRoot>
  );
}
