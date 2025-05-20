
import React, { useState, useEffect } from 'react';
import TimelineView from '@/components/synthesis/TimelineView';
import SynthesisHeader from '@/components/synthesis/SynthesisHeader';
import SynthesisOnboarding from '@/components/synthesis/SynthesisOnboarding';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TimelinePage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenSynthesisOnboarding') === 'true';
  });
  const { toast } = useToast();

  // Show onboarding on first visit
  useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
        localStorage.setItem('hasSeenSynthesisOnboarding', 'true');
        setHasSeenOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]);

  // Close onboarding and mark as seen
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenSynthesisOnboarding', 'true');
    setHasSeenOnboarding(true);
    
    toast({
      title: "Guide terminé",
      description: "Vous pouvez le réouvrir à tout moment via le bouton d'aide.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <SynthesisHeader />
      
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowOnboarding(true)}
          className="gap-1 rounded-full"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Aide</span>
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TimelineView />
      </motion.div>
      
      <SynthesisOnboarding 
        open={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
};

export default TimelinePage;
