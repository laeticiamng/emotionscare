import React from 'react';
import { ComingSoon } from '@/components/coming-soon/ComingSoon';
import { MessageCircle } from 'lucide-react';

/**
 * Page Coming Soon pour le module Messages
 */
export const MessagesComingSoon: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Messages"
      description="Système de messagerie instantanée pour échanger avec votre équipe et vos contacts"
      icon={<MessageCircle className="h-16 w-16 text-primary" />}
      features={[
        'Messagerie instantanée en temps réel',
        'Conversations individuelles et groupes',
        'Partage de fichiers et médias',
        'Notifications push intelligentes',
        'Intégration avec les autres modules',
      ]}
      estimatedRelease="Q2 2025"
      notifyEnabled
    />
  );
};

export default MessagesComingSoon;
