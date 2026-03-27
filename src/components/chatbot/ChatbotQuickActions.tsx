// @ts-nocheck
/**
 * Chatbot Quick Actions - Actions rapides sugérées
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ChatbotQuickActionsProps {
  onSelect: (action: string) => void;
  className?: string;
}

export function ChatbotQuickActions({
  onSelect,
  className,
}: ChatbotQuickActionsProps) {
  const quickActions = [
    {
      icon: '🚀',
      label: 'Comment commencer?',
      action: 'Je suis nouveau sur EmotionsCare, pouvez-vous m\'aider à démarrer?',
    },
    {
      icon: '❓',
      label: 'Fonctionnement features',
      action: 'Comment fonctionnent les features principales de l\'app?',
    },
    {
      icon: '🐛',
      label: 'Problème technique',
      action: 'J\'éprouve des problèmes techniques avec l\'app',
    },
    {
      icon: '💳',
      label: 'Abonnement',
      action: 'Quelles sont les options d\'abonnement disponibles?',
    },
  ];

  return (
    <div className={cn('space-y-2', className)}>
      {quickActions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(action.action)}
          className={cn(
            'w-full p-2 text-left text-xs rounded-lg border border-gray-300',
            'hover:bg-indigo-50 hover:border-indigo-300 transition-colors',
            'flex items-center gap-2'
          )}
        >
          <span className="text-lg">{action.icon}</span>
          <span className="text-gray-700 font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
