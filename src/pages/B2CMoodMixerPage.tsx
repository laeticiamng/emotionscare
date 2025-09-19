import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { FadeIn, SeoHead } from '@/COMPONENTS.reg';
import { MoodMixerView } from '@/modules/mood-mixer/MoodMixerView';

const B2CMoodMixerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <FadeIn className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <SeoHead title="Mood Mixer" description="Composez des ambiances émotionnelles sur mesure." />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2"
            aria-label="Revenir à la page précédente"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Mood Mixer</h1>
          <p className="max-w-2xl text-muted-foreground">
            Ajustez l’énergie, le calme, le focus et la lumière pour créer vos ambiances personnelles. Sauvegardez-les
            et profitez d’une pré-écoute immédiate de trente secondes.
          </p>
        </header>
        <MoodMixerView />
      </div>
    </FadeIn>
  );
};

export default B2CMoodMixerPage;
