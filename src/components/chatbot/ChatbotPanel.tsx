/**
 * Chatbot Panel - Vue complète du chatbot avec historique
 */

import React, { useState } from 'react';
import { Star, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSupportChatbot, useConversationHistory } from '@/hooks/useSupportChatbot';
import { ChatbotMessageBubble } from './ChatbotMessageBubble';
import { cn } from '@/lib/utils';

interface ChatbotPanelProps {
  userId: string | undefined;
  className?: string;
}

export function ChatbotPanel({ userId, className }: ChatbotPanelProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const {
    conversation,
    messages,
    loading,
    sending,
    error,
  } = useSupportChatbot(userId);

  const { conversations, openConversations, closedConversations, escalatedConversations } =
    useConversationHistory(userId);

  const statusColors: Record<string, string> = {
    open: 'bg-blue-50 border-blue-200 text-blue-700',
    closed: 'bg-green-50 border-green-200 text-green-700',
    escalated: 'bg-red-50 border-red-200 text-red-700',
    waiting_user: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    open: <MessageSquare className="w-4 h-4" />,
    closed: <CheckCircle2 className="w-4 h-4" />,
    escalated: <AlertCircle className="w-4 h-4" />,
    waiting_user: <Star className="w-4 h-4" />,
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      {/* Historique des conversations */}
      <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
          <p className="text-xs text-gray-600 mt-1">{conversations.length} total</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={cn(
                  'w-full p-3 text-left transition-colors border-l-4',
                  selectedConversation === conv.id
                    ? 'bg-indigo-50 border-indigo-600'
                    : 'hover:bg-gray-50 border-transparent'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {conv.title}
                  </p>
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-semibold whitespace-nowrap',
                    statusColors[conv.status]
                  )}>
                    {statusIcons[conv.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {conv.message_count} messages
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(conv.created_at).toLocaleDateString('fr-FR')}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Résumé */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Ouvertes</span>
            <span className="font-semibold text-blue-600">{openConversations.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fermées</span>
            <span className="font-semibold text-green-600">{closedConversations.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Escaladées</span>
            <span className="font-semibold text-red-600">{escalatedConversations.length}</span>
          </div>
        </div>
      </div>

      {/* Conversation sélectionnée ou conversation actuelle */}
      <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        {conversation ? (
          <>
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{conversation.title}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {messages.length} messages
                  </p>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  'bg-white bg-opacity-20'
                )}>
                  {conversation.status === 'open' && '🔵 Ouvert'}
                  {conversation.status === 'closed' && '✓ Fermé'}
                  {conversation.status === 'escalated' && '🚨 Escaladé'}
                  {conversation.status === 'waiting_user' && '⏳ En attente'}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Chargement...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">Aucun message dans cette conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatbotMessageBubble key={msg.id} message={msg} />
                ))
              )}
            </div>

            {/* Info et actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              {conversation.status === 'closed' && conversation.user_satisfaction && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-green-900">
                      Note donnée: {conversation.user_satisfaction}/5
                    </span>
                  </div>
                </div>
              )}

              {conversation.status === 'escalated' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Un agent de support a été assigné. Vous recevrez une réponse bientôt.
                </div>
              )}

              <div className="text-xs text-gray-600">
                Créée: {new Date(conversation.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
