import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { useToast } from '@/hooks/use-toast';

interface OnboardingButtonProps {
  className?: string;
}

const OnboardingButton: React.FC<OnboardingButtonProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenOnboarding = () => {
    setIsModalOpen(true);
    toast({
      title: "Formation disponible",
      description: "Suivez le guide pour découvrir toutes les fonctionnalités du dashboard RH.",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenOnboarding}
        className={`gap-1 rounded-full ${className}`}
        aria-label="Ouvrir la formation"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Formation</span>
      </Button>
      
      {isModalOpen && (
        <OnboardingModal 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OnboardingButton;
