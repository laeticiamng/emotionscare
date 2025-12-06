
import React from 'react';
import { BookOpen, Wand2 } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { useStorySynth } from '@/hooks/useStorySynth';
import { toast } from 'sonner';

const StorySynthButton: React.FC = () => {
  const { createStory, isGenerating } = useStorySynth();

  const handleCreateStory = async () => {
    const story = await createStory(undefined, "Une aventure inspirante de développement personnel");
    if (story) {
      toast.success(`Histoire créée: ${story.title}`, {
        description: `${story.chapters.length} chapitres générés`,
        duration: 5000
      });
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
