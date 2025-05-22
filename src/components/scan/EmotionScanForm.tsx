
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import EmotionScanner from './EmotionScanner';
import { EmotionResult } from '@/types/emotion';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onClose: () => void;
  initialTab?: 'emoji' | 'text' | 'facial' | 'voice';
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onComplete,
  onClose,
  initialTab = 'emoji'
}) => {
  const handleScanComplete = (result: EmotionResult) => {
    onComplete(result);
  };
  
  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-2 top-2 z-10"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fermer</span>
      </Button>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-center">Comment vous sentez-vous ?</h3>
        <EmotionScanner
          onScanComplete={handleScanComplete}
          onCancel={onClose}
          initialTab={initialTab}
        />
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
