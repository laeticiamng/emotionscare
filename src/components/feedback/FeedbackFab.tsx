// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';

/**
 * Floating Action Button pour ouvrir le feedback modal
 */
export const FeedbackFab: React.FC = () => {
  const { setOpen } = useFeedback();

  return (
    <Button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      size="icon"
      aria-label="Envoyer un feedback"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};