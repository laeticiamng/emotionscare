import React from 'react';
import { BookOpen, Wand2 } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { toast } from 'sonner';

const StorySynthButton: React.FC = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleCreateStory = async () => {
    setIsGenerating(true);
    try {
      toast.success('Histoire en cours de génération...', {
        description: 'Veuillez patienter',
        duration: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="story-synth-button">
      <ActionButton
        onClick={handleCreateStory}
        icon={<BookOpen className="w-5 h-5" />}
        variant="secondary"
        size="lg"
        isLoading={isGenerating}
      >
        Créer une histoire
      </ActionButton>
      <p className="text-sm text-muted-foreground text-center">
        <Wand2 className="w-4 h-4 inline mr-1" />
        Histoire interactive personnalisée
      </p>
    </div>
  );
};

export default StorySynthButton;
