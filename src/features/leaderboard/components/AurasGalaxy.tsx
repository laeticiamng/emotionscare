/**
 * AurasGalaxy - Ciel d'auras visuelles (Leaderboard sans chiffres)
 * Affiche les auras comme un ciel cosmique où chaque utilisateur est une étoile
 */
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuraSphere } from './AuraSphere';
import { useAurasLeaderboard } from '../hooks/useAurasLeaderboard';

interface AurasGalaxyProps {
  /** Hauteur minimale du ciel */
  minHeight?: string;
  /** Afficher le header */
  showHeader?: boolean;
}

/** Génère des positions stables pour les étoiles de fond */
const generateStarPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: ((i * 17 + 13) % 100),
    top: ((i * 23 + 7) % 100),
    opacity: 0.3 + ((i * 11) % 50) / 100,
    size: 1 + ((i * 7) % 3),
  }));
};

export const AurasGalaxy = memo(function AurasGalaxy({
  minHeight = '400px',
  showHeader = true,
}: AurasGalaxyProps) {
  const { auras, myAura, loading, error, refresh } = useAurasLeaderboard();

  // Positions stables des étoiles de fond (ne change pas à chaque render)
  const starPositions = useMemo(() => generateStarPositions(50), []);

  return (
    <Card className="bg-gradient-to-br from-background via-secondary/10 to-primary/5 border-border overflow-hidden">
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Halo collectif sans chiffres</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={loading}
            aria-label="Actualiser les auras"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
          </Button>
        </CardHeader>
      )}
      <CardContent className="p-4">
        {loading && !auras.length ? (
          <div
            className="flex flex-col items-center justify-center gap-3 text-muted-foreground"
            style={{ minHeight }}
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <p>Chargement du ciel d'auras…</p>
          </div>
        ) : error && !auras.length ? (
          <div
            className="flex flex-col items-center justify-center gap-3 text-destructive"
            style={{ minHeight }}
            role="alert"
          >
            <p>Une erreur est survenue : {error}</p>
            <Button variant="outline" size="sm" onClick={refresh}>
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* My aura highlight */}
            {myAura && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-primary/10 border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full shadow-lg ring-2 ring-primary"
                    style={{
                      backgroundColor: `hsl(${myAura.colorHue}, 70%, ${Math.round(myAura.luminosity * 100)}%)`,
                    }}
                    role="img"
                    aria-label="Votre aura"
                  />
                  <div>
                    <p className="font-medium text-foreground">Votre aura</p>
                    <p className="text-sm text-muted-foreground">
                      {myAura.who5Badge || 'Continuez pour faire briller votre halo'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Galaxy container */}
            <div
              className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-violet-950"
              style={{ minHeight }}
              role="img"
              aria-label={`Ciel d'auras avec ${auras.length} participants`}
            >
              {/* Starfield background - positions stables */}
              <div className="absolute inset-0 opacity-30">
                {starPositions.map((star) => (
                  <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      width: star.size,
                      height: star.size,
                      opacity: star.opacity,
                    }}
                  />
                ))}
              </div>

              {/* Aura spheres */}
              <div className="relative w-full h-full p-8">
                {auras.map((aura, index) => (
                  <AuraSphere key={aura.id} aura={aura} index={index} />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span>Énergie calme</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Équilibre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Énergie vive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Taille = Régularité</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
