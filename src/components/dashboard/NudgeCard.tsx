// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { useDashboardStore } from '@/store/dashboard.store';
import { Nudge } from '@/store/dashboard.store';
import { logger } from '@/lib/logger';

interface NudgeCardProps {
  nudge: Nudge;
}

/**
 * Carte de suggestion contextuelle
 */
export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge }) => {
  const router = useRouter();
  const { setNudge } = useDashboardStore();

  const handleNudgeClick = () => {
    router.push(nudge.deeplink);
    
    // Analytics tracking
    logger.info('Nudge clicked:', { deeplink: nudge.deeplink });
    
    // Hide nudge after click
    setNudge(null);
  };

  const handleDismiss = () => {
    setNudge(null);
    
    // Analytics tracking
    logger.info('Nudge dismissed');
  };

  return (
    <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Emoji */}
          {nudge.emoji && (
            <div className="text-2xl flex-shrink-0">
              {nudge.emoji}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-muted-foreground mb-1">
              Suggestion
            </div>
            <p className="text-sm font-medium">
              {nudge.text}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNudgeClick}
              className="hover:bg-warning/20"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="sr-only">Accepter la suggestion</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="hover:bg-warning/20 text-muted-foreground"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Ignorer la suggestion</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};