
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
}

export default function useChat({ initialMessages = [], onSendMessage }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = useCallback(
    (messageText: string) => {
      if (!messageText.trim()) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      // Si une fonction de callback externe est fournie, l'appeler
      if (onSendMessage) {
        onSendMessage(messageText);
      } else {
        // Sinon, simuler une réponse automatique après un court délai
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            text: `Réponse à: ${messageText}`,
            sender: 'assistant',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }, 1000);
      }
    },
    [onSendMessage]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    sendMessage,
    handleSubmit,
  };
}
