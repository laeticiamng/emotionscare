import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { ContinueItem } from '@/store/dashboard.store';

interface ContinueCardProps {
  item: ContinueItem;
}

/**
 * Carte pour reprendre une session interrompue
 */
export const ContinueCard: React.FC<ContinueCardProps> = ({ item }) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push(item.deeplink);
    
    // Analytics tracking
    console.log('Continue clicked:', item.module);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Play icon */}
          <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
            <Play className="w-5 h-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-muted-foreground mb-1">
              Reprendre
            </div>
            <h3 className="font-medium text-sm mb-1 truncate">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {item.subtitle}
              </p>
            )}
          </div>

          {/* Action button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleContinue}
            className="flex-shrink-0 hover:bg-primary/10"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="sr-only">Reprendre la session</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};