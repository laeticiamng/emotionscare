/**
 * MyAuraCard - Carte de l'aura de l'utilisateur courant
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AuraEntry } from '../hooks/useAurasLeaderboard';

interface MyAuraCardProps {
  aura: AuraEntry | null;
}

export const MyAuraCard = memo(function MyAuraCard({ aura }: MyAuraCardProps) {
  if (!aura) {
    return (
      <Card className="border-border">
        <CardContent className="p-6 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Votre aura n'est pas encore visible
          </h3>
          <p className="text-sm text-muted-foreground">
            Complétez des séances de bien-être pour voir votre aura apparaître
            dans le ciel collectif.
          </p>
        </CardContent>
      </Card>
    );
  }

  const bgColor = `hsl(${aura.colorHue}, 70%, ${Math.round(aura.luminosity * 100)}%)`;
  const glowColor = `hsla(${aura.colorHue}, 80%, ${Math.min(Math.round(aura.luminosity * 100) + 15, 90)}%, 0.4)`;

  const getAuraDescription = () => {
    if (aura.colorHue >= 200 && aura.colorHue <= 270) {
      return 'Votre énergie est calme et apaisante';
    }
    if (aura.colorHue >= 30 && aura.colorHue <= 60) {
      return 'Votre énergie rayonne de vitalité';
    }
    return 'Votre énergie est équilibrée';
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-background to-primary/5 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Votre Aura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          {/* Aura visualization */}
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                backgroundColor: glowColor,
                transform: 'scale(1.5)',
              }}
            />
            {/* Core */}
            <div
              className="relative w-20 h-20 rounded-full shadow-xl ring-2 ring-primary/30"
              style={{ backgroundColor: bgColor }}
              role="img"
              aria-label="Votre aura personnelle"
            >
              {/* Inner shine */}
              <div
                className="absolute inset-2 rounded-full opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, white 0%, transparent 60%)',
                }}
              />
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <p className="font-medium text-foreground">{getAuraDescription()}</p>
            {aura.who5Badge && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {aura.who5Badge}
              </p>
            )}
            {aura.streakDays && aura.streakDays > 0 && (
              <p className="text-sm text-warning flex items-center gap-1">
                <Flame className="h-4 w-4" />
                Série de {aura.streakDays} jours
              </p>
            )}
          </div>
        </div>

        {/* Luminosity progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Luminosité</span>
            <span className="font-medium text-foreground">
              {Math.round(aura.luminosity * 100)}%
            </span>
          </div>
          <Progress
            value={aura.luminosity * 100}
            className="h-2"
            aria-label={`Luminosité de votre aura: ${Math.round(aura.luminosity * 100)}%`}
          />
        </div>

        {/* Size progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Présence (taille)</span>
            <span className="font-medium text-foreground">
              {Math.round(((aura.sizeScale - 0.5) / 1) * 100)}%
            </span>
          </div>
          <Progress
            value={((aura.sizeScale - 0.5) / 1) * 100}
            className="h-2"
            aria-label={`Taille de votre aura`}
          />
        </div>
      </CardContent>
    </Card>
  );
});
