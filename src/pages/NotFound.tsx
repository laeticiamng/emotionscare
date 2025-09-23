import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      aria-labelledby="not-found-title"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted px-6 py-24 text-center"
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Sparkles aria-hidden className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
            EmotionsCare
          </p>
          <h1 id="not-found-title" className="text-3xl font-bold text-foreground sm:text-4xl">
            Cette page s'est échappée
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Le lien que vous cherchez semble avoir changé de chemin. Revenez à l'accueil pour continuer votre expérience émotionnelle.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
            <ArrowLeft aria-hidden className="mr-2 h-5 w-5" />
            Retour
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/">
              <Home aria-hidden className="mr-2 h-5 w-5" />
              Accueil EmotionsCare
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
