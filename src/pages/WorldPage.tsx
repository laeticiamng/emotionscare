
import React, { useState } from 'react';
import WorldMapView from '@/components/synthesis/WorldMapView';
import SynthesisHeader from '@/components/synthesis/SynthesisHeader';
import SynthesisOnboarding from '@/components/synthesis/SynthesisOnboarding';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const WorldPage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

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
        <WorldMapView />
      </motion.div>
      
      <SynthesisOnboarding 
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export default WorldPage;
