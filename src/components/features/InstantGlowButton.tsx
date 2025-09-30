// @ts-nocheck

import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { toast } from 'sonner';

const InstantGlowButton: React.FC = () => {
  const [isGlowing, setIsGlowing] = React.useState(false);

  const handleInstantGlow = async () => {
    setIsGlowing(true);
    
    toast.success('Instant Glow activé !', {
      description: 'Respirez profondément pendant 20 secondes',
      duration: 3000
    });

    // Simulation de la session Glow de 20 secondes
    setTimeout(() => {
      setIsGlowing(false);
      toast.success('Session terminée !', {
        description: 'Vous ressentez déjà les bienfaits ✨',
        duration: 3000
      });
    }, 20000);
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="instant-glow-button">
      <ActionButton
        onClick={handleInstantGlow}
        icon={<Sparkles className="w-5 h-5" />}
        variant="warning"
        size="lg"
        isLoading={isGlowing}
      >
        Instant Glow
      </ActionButton>
      <p className="text-sm text-muted-foreground text-center">
        <Zap className="w-4 h-4 inline mr-1" />
        20s de respiration + couleurs
      </p>
    </div>
  );
};

export default InstantGlowButton;
