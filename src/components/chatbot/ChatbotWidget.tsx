/**
 * Chatbot Widget - Widget flottant du chatbot support
 */

import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { useSupportChatbot } from '@/hooks/useSupportChatbot';
import { ChatbotMessageBubble } from './ChatbotMessageBubble';
import { ChatbotQuickActions } from './ChatbotQuickActions';
import { cn } from '@/lib/utils';

interface ChatbotWidgetProps {
  userId: string | undefined;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function ChatbotWidget({
  userId,
  position = 'bottom-right',
  className,
}: ChatbotWidgetProps) {
  const [input, setInput] = useState('');
  const {
    isOpen,
    messages,
    loading,
    sending,
    hasUnread,
    error,
    conversation,
    sendMessage,
    toggleChatbot,
    messagesEndRef,
  } = useSupportChatbot(userId);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4', // Décalé pour éviter chevauchement avec autres widgets
    'bottom-left': 'bottom-20 left-4',
  };

  return (
    <div className={cn('fixed z-40', positionClasses[position], className)}>
      {/* Widget ouvert */}
      {isOpen && (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-96 mb-4">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Support EmotionsCare</h3>
                <p className="text-xs opacity-90">Chat avec l'IA disponible</p>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm text-gray-600">Chargement...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Bonjour! 👋</p>
                  <p className="text-xs text-gray-500">
                    Comment puis-je vous aider aujourd'hui?
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatbotMessageBubble
                    key={message.id}
                    message={message}
                  />
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg flex gap-1">
                      <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Actions rapides (si pas de messages) */}
          {messages.length === 0 && !loading && (
            <div className="px-4 py-2 border-t border-gray-200">
              <ChatbotQuickActions onSelect={handleQuickAction} />
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !sending) {
                    handleSend();
                  }
                }}
                placeholder="Écrivez votre question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                disabled={sending || !conversation}
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim() || !conversation}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={toggleChatbot}
        className={cn(
          'relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center',
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-indigo-600 hover:bg-indigo-700'
        )}
        title={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
