// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageRoot from '@/components/common/PageRoot';
import MusicQueueAdmin from '@/components/admin/MusicQueueAdmin';

export default function MusicQueueAdminPage() {
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
              <Music className="h-6 w-6 text-primary" aria-hidden="true" />
              Administration - File musicale
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Gérez la file d'attente musicale et les paramètres associés.
          </p>
        </header>

        <main aria-label="Administration de la file musicale">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Chargement...
              </div>
            }
          >
            <MusicQueueAdmin />
          </React.Suspense>
        </main>
      </div>
    </PageRoot>
  );
}
