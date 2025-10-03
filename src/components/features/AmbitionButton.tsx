
import React from 'react';
import { Trophy, Plus } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { useAmbition } from '@/hooks/useAmbition';
import { toast } from 'sonner';

const AmbitionButton: React.FC = () => {
  const { createGoal, isCreating } = useAmbition();

  const handleAddGoal = async () => {
    const goal = await createGoal(
      "Améliorer mon bien-être quotidien",
      "Développer des habitudes saines et durables"
    );
    
    if (goal) {
      toast.success(`Objectif créé: ${goal.title}`, {
        description: `${goal.levels.length} niveaux à débloquer`,
        duration: 5000
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="ambition-button">
      <ActionButton
        onClick={handleAddGoal}
        icon={<Plus className="w-5 h-5" />}
        variant="success"
        size="lg"
        isLoading={isCreating}
      >
        Ajouter objectif
      </ActionButton>
      <p className="text-sm text-muted-foreground text-center">
        <Trophy className="w-4 h-4 inline mr-1" />
        Décomposé en niveaux gamifiés
      </p>
    </div>
  );
};

export default AmbitionButton;
