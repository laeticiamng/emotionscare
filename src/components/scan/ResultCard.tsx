import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smile, Frown, Meh, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type ScanBucket = 'positif' | 'calme' | 'neutre' | 'tendu';

export interface ScanResult {
  bucket: ScanBucket;
  label: string;
  advice?: string;
  confidence?: number;
}

interface ResultCardProps {
  loading: boolean;
  result: ScanResult | null;
}

const bucketConfig = {
  positif: {
    icon: Smile,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  calme: {
    icon: Smile,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    gradient: 'from-blue-500/10 to-cyan-500/10'
  },
  neutre: {
    icon: Meh,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    gradient: 'from-gray-500/10 to-slate-500/10'
  },
  tendu: {
    icon: Frown,
    color: 'text-amber-600 dark:text-amber-400', // Pas de rouge criard
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    gradient: 'from-amber-500/10 to-orange-500/10'
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({
  loading,
  result
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Analyse en cours...</h3>
              <p className="text-sm text-muted-foreground">
                L'IA analyse vos données émotionnelles
              </p>
            </div>
            <Progress value={75} className="w-full max-w-xs mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-8">
          <div className="text-center space-y-4 text-muted-foreground">
            <Zap className="w-16 h-16 mx-auto opacity-50" />
            <div>
              <h3 className="text-lg font-medium">En attente d'analyse</h3>
              <p className="text-sm">
                Sélectionnez une image ou activez la caméra pour commencer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = bucketConfig[result.bucket];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`bg-gradient-to-br ${config.gradient} border-2`}
        role="status"
        aria-live="polite"
      >
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-8 h-8 ${config.color}`} />
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {result.label}
            </h2>
            <p className="text-sm text-muted-foreground">
              État émotionnel détecté
            </p>
          </div>

          {result.confidence && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fiabilité</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress 
                value={result.confidence * 100} 
                className="h-2"
              />
            </div>
          )}

          <div className="pt-2">
            <Badge 
              variant="secondary" 
              className={`${config.color} bg-transparent border-current`}
            >
              Analyse terminée
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};