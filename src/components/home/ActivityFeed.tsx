/**
 * ActivityFeed - Placeholder pour le flux d'activité réel
 * Affiche uniquement des informations factuelles sur les fonctionnalités disponibles
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Music, Heart, Shield } from 'lucide-react';

const FEATURES = [
  {
    id: '1',
    icon: <Brain className="h-4 w-4 text-primary" />,
    title: 'Scan émotionnel IA',
    description: 'Évaluez votre état en quelques questions',
    badge: 'Disponible',
  },
  {
    id: '2',
    icon: <Music className="h-4 w-4 text-primary" />,
    title: 'Musicothérapie',
    description: 'Ambiances sonores personnalisées',
    badge: 'Disponible',
  },
  {
    id: '3',
    icon: <Heart className="h-4 w-4 text-primary" />,
    title: 'Respiration guidée',
    description: 'Sessions de 3 minutes',
    badge: 'Disponible',
  },
  {
    id: '4',
    icon: <Shield className="h-4 w-4 text-primary" />,
    title: 'Journal émotionnel',
    description: 'Suivi privé et chiffré',
    badge: 'Disponible',
  },
];

const ActivityFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fonctionnalités disponibles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="p-2 rounded-full bg-background">
              {feature.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{feature.title}</span>
                <Badge variant="outline" className="text-xs">{feature.badge}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
