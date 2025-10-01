// @ts-nocheck
import React from 'react';
import { SessionResult } from '@/types/modules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionResultProps {
  result: SessionResult;
  onContinue?: () => void;
  onHome?: () => void;
}

export const SessionResultComponent: React.FC<SessionResultProps> = ({
  result,
  onContinue,
  onHome
}) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (result.cta?.action === 'continue' && onContinue) {
      onContinue();
    } else if (result.cta?.action && result.cta.action.startsWith('/')) {
      navigate(result.cta.action);
    } else {
      navigate('/app/home');
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate('/app/home');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Main Badge */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">
            {result.badge}
          </h2>
        </div>

        {/* Reward */}
        {result.reward && (
          <div className="mb-6 p-4 bg-card rounded-lg border border-border/10">
            <div className="flex items-center gap-3 justify-center mb-2">
              <Gift className="w-5 h-5 text-primary" />
              <Badge variant="secondary">{result.reward.name}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.reward.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {result.cta && (
            <Button 
              onClick={handleCTA}
              className="w-full"
              size="lg"
            >
              {result.cta.text}
              {result.cta.duration && (
                <span className="ml-2 opacity-75">({result.cta.duration})</span>
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleHome}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Plan du jour
          </Button>
        </div>

        {/* Soft encouragement */}
        <p className="text-sm text-muted-foreground mt-6">
          Tu gardes cette douceur 💚
        </p>
      </div>
    </div>
  );
};