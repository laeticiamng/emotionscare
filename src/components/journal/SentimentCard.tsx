import React from 'react';
import { Sun, CloudSun, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodBucket } from '@/store/journal.store';
import { cn } from '@/lib/utils';

interface SentimentCardProps {
  moodBucket: MoodBucket;
  summary: string;
  className?: string;
}

const moodConfig = {
  clear: {
    icon: Sun,
    label: 'Lucide',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    badgeVariant: 'default' as const,
  },
  mixed: {
    icon: CloudSun,
    label: 'Nuancé', 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    badgeVariant: 'secondary' as const,
  },
  pressured: {
    icon: Zap,
    label: 'Sous pression',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    badgeVariant: 'destructive' as const,
  },
};

export const SentimentCard: React.FC<SentimentCardProps> = ({
  moodBucket,
  summary,
  className,
}) => {
  const config = moodConfig[moodBucket];
  const Icon = config.icon;

  return (
    <Card 
      className={cn(config.bgColor, className)}
      role="status"
      aria-live="polite"
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full bg-white", config.color)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={config.badgeVariant}>
                {config.label}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};