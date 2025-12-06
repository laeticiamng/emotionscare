// @ts-nocheck

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { chatCompletion, analyzeEmotion } from '@/services/openai';
import { logger } from '@/lib/logger';

// Responses for different emotions
const emotionResponses: Record<string, string[]> = {
  happy: [
    "Je suis ravi de vous voir de bonne humeur ! C'est important de savourer ces moments.",
    "Votre joie est contagieuse ! Comment pourriez-vous partager ce bonheur avec quelqu'un aujourd'hui ?",
    "Excellent ! La joie est une émotion précieuse. Qu'est-ce qui vous rend particulièrement heureux aujourd'hui ?"
  ],
  sad: [
    "Je comprends que vous vous sentiez triste. Voulez-vous en parler un peu plus ?",
    "La tristesse est une émotion naturelle. Prenez le temps de l'accueillir sans jugement.",
    "Je suis là pour vous écouter. Parfois, partager ce qui nous attriste peut aider à alléger le fardeau."
  ],
  angry: [
    "Je vois que vous ressentez de la colère. C'est une émotion qui nous signale souvent qu'une limite a été dépassée.",
    "Prenez un moment pour respirer profondément. La colère est légitime, mais il est important de l'exprimer sainement.",
    "Qu'est-ce qui a déclenché cette colère ? Parfois, identifier la source peut aider à la gérer."
  ],
  anxious: [
    "L'anxiété peut être difficile à gérer. Avez-vous essayé de prendre quelques respirations profondes ?",
    "Je suis là pour vous aider à traverser ce moment d'anxiété. Pouvons-nous explorer ce qui vous préoccupe ?",
    "L'anxiété nous parle souvent de nos inquiétudes pour le futur. Essayons de nous reconnecter au moment présent."
  ],
  calm: [
    "C'est merveilleux de vous savoir dans un état de calme. Comment pourriez-vous prolonger cette sensation ?",
    "Le calme est un excellent état pour pratiquer la pleine conscience. Profitez de ce moment.",
    "Être calme permet une meilleure réflexion. Y a-t-il quelque chose que vous aimeriez explorer dans cet état d'esprit ?"
  ],
  confused: [
    "La confusion peut être frustrante. Essayons de clarifier vos pensées ensemble.",
    "Prenez le temps de vous poser. Parfois, la confusion vient d'un trop-plein d'informations.",
    "Pouvons-nous décomposer ce qui vous semble confus ? Avançons pas à pas."
  ],
  neutral: [
    "Comment puis-je vous aider aujourd'hui ?",
    "Je suis là pour discuter de ce qui vous préoccupe ou vous intéresse.",
    "Y a-t-il quelque chose de particulier dont vous aimeriez parler ?"
  ]
};

// Activities for different emotions
const emotionActivities: Record<string, string[]> = {
  happy: [
    "Pourquoi ne pas écrire trois choses qui vous rendent reconnaissant aujourd'hui ?",
    "C'est un bon moment pour contacter un proche et partager votre joie.",
    "Votre créativité est probablement à son maximum - essayez une activité artistique !"
  ],
  sad: [
    "Une promenade de 10 minutes dans la nature pourrait vous faire du bien.",
    "Écoutez une musique qui résonne avec votre état d'esprit, puis progressivement passez à quelque chose de plus léger.",
    "S'accorder un moment de gentillesse envers soi-même est important : une tasse de thé, une couverture douillette..."
  ],
  angry: [
    "Essayez cet exercice de respiration : inspirez pendant 4 secondes, retenez pendant 4 secondes, expirez pendant 6 secondes.",
    "Écrire ce qui vous met en colère sans filtre peut être libérateur.",
    "Une activité physique, même brève comme 20 jumping jacks, peut aider à libérer la tension."
  ],
  anxious: [
    "Pratiquez l'exercice 5-4-3-2-1 : nommez 5 choses que vous voyez, 4 que vous pouvez toucher, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez.",
    "Essayez une méditation guidée de 5 minutes.",
    "Écrivez vos inquiétudes sur papier, puis à côté, notez une action concrète possible pour chacune."
  ],
  calm: [
    "C'est un excellent moment pour fixer des intentions ou planifier quelque chose d'important.",
    "Profitez de cet état pour pratiquer une méditation ou une visualisation positive.",
    "Notez ce qui a contribué à ce calme - cela pourra vous aider à recréer cet état plus tard."
  ],
  confused: [
    "Prenez un papier et notez le problème, puis divisez-le en plus petites parties.",
    "Parfois, expliquer sa confusion à voix haute (même à soi-même) aide à y voir plus clair.",
    "Accordez-vous une pause complète de 15 minutes avant de revenir à ce qui vous confond."
  ],
  neutral: [
    "C'est un bon moment pour faire un scan corporel et voir comment vous vous sentez physiquement.",
    "Pourquoi ne pas explorer une nouvelle activité ou approfondir un intérêt ?",
    "Prenez quelques minutes pour définir une intention pour le reste de votre journée."
  ]
};

export function useCoachHandlers() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  const { toast } = useToast();

  // Function to detect emotion from text - simple implementation
  const detectEmotionFromText = async (text: string): Promise<string> => {
    const lowerText = text.toLowerCase();
    
    // Simple keyword matching
    if (lowerText.includes('heureu') || lowerText.includes('content') || lowerText.includes('joie') || lowerText.includes('super')) {
      return 'happy';
    } else if (lowerText.includes('triste') || lowerText.includes('déprim') || lowerText.includes('mal')) {
      return 'sad';
    } else if (lowerText.includes('colère') || lowerText.includes('énervé') || lowerText.includes('frustré')) {
      return 'angry';
    } else if (lowerText.includes('anxi') || lowerText.includes('stress') || lowerText.includes('inquiet')) {
      return 'anxious';
    } else if (lowerText.includes('calm') || lowerText.includes('apaisé') || lowerText.includes('serein')) {
      return 'calm';
    } else if (lowerText.includes('confus') || lowerText.includes('perdu') || lowerText.includes('comprends pas')) {
      return 'confused';
    }
    
    // Default emotion if no keywords match
    return 'neutral';
  };
  
  // Function to detect emotion (public API)
  const detectEmotion = useCallback(async (text: string): Promise<string> => {
    try {
      return await detectEmotionFromText(text);
    } catch (error) {
      logger.error('Error in detectEmotion', error as Error, 'UI');
      return 'neutral';
    }
  }, []);
  
  // Function to suggest activity based on emotion
  const suggestActivity = useCallback(async (emotion: string): Promise<string> => {
    try {
      const activities = emotionActivities[emotion] || emotionActivities.neutral;
      return activities[Math.floor(Math.random() * activities.length)];
    } catch (error) {
      logger.error('Error suggesting activity', error as Error, 'UI');
      return "Je vous suggère de prendre un moment pour vous aujourd'hui.";
    }
  }, []);

  // Send a message with AI processing
  const sendMessage = useCallback(
    (
      text: string,
      sender: 'user' | 'assistant' | 'system' | 'coach'
    ) => {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content: text,
        sender,
        timestamp: new Date().toISOString()
      };

      const history = [...messages, newMessage];

      setMessages(prev => [...prev, newMessage]);

      if (sender === 'user') {
        setIsProcessing(true);

        const process = async () => {
          try {
            const emotionRes = await analyzeEmotion(text);
            setCurrentEmotion(emotionRes.primaryEmotion);

            const formatted = history.map(m => ({
              id: m.id,
              text: m.content,
              sender: m.sender === 'coach' ? 'assistant' : 'user'
            }));

            const aiText = await chatCompletion(formatted, {
              model: 'gpt-4o-mini',
              temperature: 0.7
            });

            const responseMessage: ChatMessage = {
              id: uuidv4(),
              content: aiText,
              sender: 'coach',
              timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, responseMessage]);
            setHasUnreadMessages(true);
          } catch (error) {
            logger.error('Error generating coach response', error as Error, 'UI');
            const responses =
              emotionResponses[currentEmotion || 'neutral'] || emotionResponses.neutral;
            const fallback = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [
              ...prev,
              {
                id: uuidv4(),
                content: fallback,
                sender: 'coach',
                timestamp: new Date().toISOString()
              }
            ]);
          } finally {
            setIsProcessing(false);
          }
        };

        process();
      }
    },
    [messages, currentEmotion]
  );
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('coachMessages');
  }, []);
  
  // Mark all messages as read
  const markAllAsRead = useCallback(() => {
    setHasUnreadMessages(false);
  }, []);
  
  return {
    messages,
    setMessages,
    isProcessing,
    currentEmotion,
    hasUnreadMessages,
    sendMessage,
    clearMessages,
    detectEmotion,
    suggestActivity,
    markAllAsRead
  };
}
