import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowUpRight } from "lucide-react";

const RhSelfCare: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState(72);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  
  // Function to simulate a breathing exercise for self-care
  const startBreathingExercise = () => {
    setShowBreathingExercise(true);
    
    // Simulate energy increase after exercise
    setTimeout(() => {
      setEnergyLevel(Math.min(energyLevel + 10, 100));
      setShowBreathingExercise(false);
    }, 5000);
  };
  
  if (showBreathingExercise) {
    return (
      <div className="p-2 text-center">
        <h4 className="text-sm mb-2">Respirez...</h4>
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-2 animate-pulse flex items-center justify-center">
          <Heart className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground">Inspirez... Expirez...</p>
      </div>
    );
  }
  
  return (
    <div className="p-2">
      <h3 className="text-sm font-medium mb-1 flex items-center">
        <Heart className="h-3.5 w-3.5 text-rose-500 mr-1.5" />
        Votre bien-être RH
      </h3>
      
      <div className="flex items-center gap-1 mb-1.5">
        <Progress value={energyLevel} className="h-2" />
        <span className="text-xs text-muted-foreground">{energyLevel}%</span>
      </div>
      
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 px-2 w-full"
          onClick={startBreathingExercise}
        >
          Respiration
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 px-2"
        >
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default RhSelfCare;
