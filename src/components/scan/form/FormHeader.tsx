// @ts-nocheck

import React from 'react';
import { Button } from "@/components/ui/button";

interface FormHeaderProps {
  quickMode: boolean;
  setQuickMode: (quickMode: boolean) => void;
  skipDay: boolean;
  setSkipDay: (skipDay: boolean) => void;
  onClose?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  quickMode,
  setQuickMode,
  skipDay,
  setSkipDay,
  onClose
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Nouveau scan émotionnel</h2>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="quickMode"
            checked={quickMode}
            onChange={() => setQuickMode(!quickMode)}
            className="rounded border-gray-300"
          />
          <label htmlFor="quickMode" className="text-sm">Mode rapide</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="skipDay"
            checked={skipDay}
            onChange={() => setSkipDay(!skipDay)}
            className="rounded border-gray-300"
          />
          <label htmlFor="skipDay" className="text-sm">Sauter un jour</label>
        </div>
        
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormHeader;
