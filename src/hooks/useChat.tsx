
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from '@faker-js/faker';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialiser la session au chargement
  useEffect(() => {
    // Générer un ID de session unique ou restaurer depuis le localStorage
    const storedSessionId = localStorage.getItem('emotionscare_chat_session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('emotionscare_chat_session', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addBotMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const processMessage = useCallback(async (text: string, useStream = false) => {
    setIsLoading(true);
    
    try {
      // Récupérer le contexte émotionnel de l'utilisateur
      const userContext = await getUserContext(user?.id);
      
      // Préparer les options pour l'appel à l'API
      const options = {
        message: text,
        userContext,
        sessionId,
        stream: useStream
      };

      // Appel à la fonction Edge Supabase
      if (useStream) {
        // Mise en place pour le streaming (à implémenter si nécessaire)
        console.log("Streaming not fully implemented yet");
      }
      
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: options
      });
      
      if (error) throw error;
      
      const response = data.response;
      
      return {
        response,
        intent: determineIntent(text, response),
        sessionId: data.sessionId
      };
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter l'assistant IA pour le moment.",
        variant: "destructive"
      });
      
      return {
        response: "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre demande. Veuillez réessayer plus tard.",
        intent: "error"
      };
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, user, toast]);

  // Fonction pour déterminer l'intention de l'utilisateur
  const determineIntent = (userText: string, aiResponse: string) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('vr') || lowerText.includes('pause') || aiResponse.toLowerCase().includes('session vr')) {
      return "vr_session";
    } else if (lowerText.includes('musique') || lowerText.includes('playlist') || aiResponse.toLowerCase().includes('playlist')) {
      return "music_playlist";
    } else if (lowerText.includes('merci') || lowerText.includes('thanks')) {
      return "gratitude";
    } else if (lowerText.includes('stress') || lowerText.includes('anxiété')) {
      return "stress_management";
    } else {
      return "general";
    }
  };

  // Récupérer le contexte émotionnel de l'utilisateur
  const getUserContext = async (userId?: string) => {
    if (!userId) return null;
    
    try {
      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(3);
      
      if (!emotions || emotions.length === 0) return null;
      
      // Calculer un score moyen
      const avgScore = emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / emotions.length;
      
      // Récupérer les émotions récentes
      const recentEmotions = emotions.map(e => e.emojis || '').join(', ');
      
      return {
        recentEmotions,
        currentScore: Math.round(avgScore),
        lastEmotionDate: emotions[0].date
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  };

  const clearMessages = () => {
    setMessages([{
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  // Fonction pour charger l'historique des messages
  const loadMessageHistory = useCallback(async () => {
    // Cette fonction pourrait être développée pour charger l'historique des messages
    // depuis Supabase si on souhaite persister les conversations
    console.log('Chargement de l\'historique des messages pour la session:', sessionId);
    
    // Pour l'instant, nous gardons la conversation en mémoire uniquement
    return messages;
  }, [sessionId, messages]);

  return {
    messages,
    isLoading,
    sessionId,
    addUserMessage,
    addBotMessage,
    processMessage,
    clearMessages,
    loadMessageHistory
  };
}

// Ajouter un hook pour utiliser l'API des assistants OpenAI
export function useAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [assistant, setAssistant] = useState<any>(null);
  const [threadId, setThreadId] = useState<string>('');
  const { toast } = useToast();

  // Initialiser un assistant
  const initializeAssistant = async (instructions?: string) => {
    setIsLoading(true);
    try {
      // Vérifier si un assistant existe déjà en local storage
      const storedAssistant = localStorage.getItem('emotionscare_assistant');
      if (storedAssistant) {
        setAssistant(JSON.parse(storedAssistant));
      } else {
        // Créer un nouvel assistant
        const { data, error } = await supabase.functions.invoke('assistant-api', {
          body: { 
            action: 'create_assistant',
            instructions
          }
        });
        
        if (error) throw error;
        
        localStorage.setItem('emotionscare_assistant', JSON.stringify(data.assistant));
        setAssistant(data.assistant);
      }
      
      // Initialiser un thread (nouveau pour chaque session)
      const { data: threadData, error: threadError } = await supabase.functions.invoke('assistant-api', {
        body: { action: 'create_thread' }
      });
      
      if (threadError) throw threadError;
      
      setThreadId(threadData.thread.id);
      
    } catch (error) {
      console.error('Error initializing assistant:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible de créer un assistant IA pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer un message à l'assistant et obtenir une réponse
  const sendMessage = async (content: string) => {
    if (!assistant || !threadId) {
      toast({
        title: "Assistant non initialisé",
        description: "Veuillez initialiser l'assistant avant d'envoyer un message.",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      // Ajouter le message au thread
      const { error: msgError } = await supabase.functions.invoke('assistant-api', {
        body: { 
          action: 'create_message',
          threadId,
          content 
        }
      });
      
      if (msgError) throw msgError;
      
      // Faire fonctionner l'assistant
      const { data: runData, error: runError } = await supabase.functions.invoke('assistant-api', {
        body: { 
          action: 'run_assistant',
          threadId,
          assistantId: assistant.id
        }
      });
      
      if (runError) throw runError;
      
      // Attendre que l'exécution soit terminée (polling)
      let runStatus = runData.run.status;
      let runId = runData.run.id;
      
      while (runStatus === 'queued' || runStatus === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: checkData, error: checkError } = await supabase.functions.invoke('assistant-api', {
          body: { 
            action: 'check_run',
            threadId,
            content: runId
          }
        });
        
        if (checkError) throw checkError;
        runStatus = checkData.run.status;
      }
      
      // Récupérer les messages
      const { data: messagesData, error: messagesError } = await supabase.functions.invoke('assistant-api', {
        body: { 
          action: 'get_messages',
          threadId
        }
      });
      
      if (messagesError) throw messagesError;
      
      return messagesData.messages.data;
      
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de communiquer avec l'assistant IA.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assistant,
    threadId,
    isLoading,
    initializeAssistant,
    sendMessage
  };
}
