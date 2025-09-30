// @ts-nocheck

import React from 'react';
import { Target, Sparkles } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { useGritChallenge } from '@/hooks/useGritChallenge';
import { toast } from 'sonner';

const GritChallengeButton: React.FC = () => {
  const { generateChallenge, isLoading } = useGritChallenge();

  const handleNewChallenge = async () => {
    const challenge = await generateChallenge();
    if (challenge) {
      toast.success(`Nouveau défi: ${challenge.title}`, {
        description: challenge.description,
        duration: 5000
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="grit-challenge-button">
      <ActionButton
        onClick={handleNewChallenge}
        icon={<Target className="w-5 h-5" />}
        variant="primary"
        size="lg"
        isLoading={isLoading}
      >
        Nouveau défi
      </ActionButton>
      <p className="text-sm text-muted-foreground text-center">
        <Sparkles className="w-4 h-4 inline mr-1" />
        Généré par IA selon votre humeur
      </p>
    </div>
  );
};

export default GritChallengeButton;
