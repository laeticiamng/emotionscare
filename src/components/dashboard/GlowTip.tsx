// @ts-nocheck
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GlowTipProps {
  text?: string;
}

export const GlowTip: React.FC<GlowTipProps> = ({ text }) => {
  const { t } = useTranslation();
  
  if (!text) return null;

  // Track analytics when tip is shown
  React.useEffect(() => {
    // dashboard.glow.tip.shown analytics would go here
  }, [text]);

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md max-w-sm">
      <Lightbulb className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};