/**
 * Chatbot Message Bubble - Affichage d'un message
 */

import React from 'react';
import { SupportMessage } from '@/services/supportChatbotService';
import { cn } from '@/lib/utils';

interface ChatbotMessageBubbleProps {
  message: SupportMessage;
  className?: string;
}

export function ChatbotMessageBubble({
  message,
  className,
}: ChatbotMessageBubbleProps) {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'admin';

  // System message (centré)
  if (isSystem) {
    return (
      <div className={cn('flex justify-center', className)}>
        <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full max-w-xs text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {/* Avatar chatbot */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          AI
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'px-3 py-2 rounded-lg max-w-xs break-words',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {/* Suggested actions si c'est un message du chatbot */}
        {!isUser && message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {message.suggested_actions.slice(0, 2).map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Trigger message send with action
                  // This would be connected to parent component
                }}
                className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors text-left"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            'text-xs mt-1',
            isUser ? 'text-indigo-100' : 'text-gray-600'
          )}
        >
          {new Date(message.created_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* Avatar utilisateur */}
      {isUser && (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          👤
        </div>
      )}
    </div>
  );
}
