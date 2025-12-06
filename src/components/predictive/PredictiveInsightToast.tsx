// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  route?: string;
}

interface PredictiveInsightToastProps {
  recommendation: Recommendation;
  onClose: () => void;
}

const PredictiveInsightToast: React.FC<PredictiveInsightToastProps> = ({
  recommendation,
  onClose
}) => {
  return (
    <div className="flex flex-col p-4 bg-background border rounded-lg shadow-md max-w-md">
      <div className="flex items-center mb-2">
        <Sparkles className="h-5 w-5 text-primary mr-2" />
        <h4 className="font-semibold">{recommendation.title}</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Ignorer
        </Button>
        <Button size="sm" onClick={onClose}>
          Voir
        </Button>
      </div>
    </div>
  );
};

export default PredictiveInsightToast;
