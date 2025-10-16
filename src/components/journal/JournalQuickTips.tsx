import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Clock, Heart, Sparkles } from 'lucide-react';

interface Tip {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  color: string;
}

const tips: Tip[] = [
  {
    icon: Clock,
    title: 'Routine quotidienne',
    description: 'Écrivez à la même heure chaque jour pour créer une habitude durable.',
    color: 'text-blue-500',
  },
  {
    icon: Heart,
    title: 'Authenticité',
    description: 'Votre journal est privé. Exprimez-vous librement sans jugement.',
    color: 'text-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Variété',
    description: 'Explorez différentes catégories de prompts pour éviter la monotonie.',
    color: 'text-purple-500',
  },
  {
    icon: Lightbulb,
    title: 'Commencez petit',
    description: '5 minutes par jour suffisent. La régularité prime sur la quantité.',
    color: 'text-amber-500',
  },
];

interface JournalQuickTipsProps {
  className?: string;
}

/**
 * Carte affichant des conseils rapides pour optimiser l'utilisation du journal
 */
export const JournalQuickTips = memo<JournalQuickTipsProps>(({ className = '' }) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Conseils pour bien démarrer
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Icon className={`h-5 w-5 ${tip.color} shrink-0 mt-0.5`} />
                <div>
                  <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

JournalQuickTips.displayName = 'JournalQuickTips';
