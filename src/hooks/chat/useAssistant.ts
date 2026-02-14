import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Assistant {
  id: string;
  name?: string;
  model?: string;
  instructions?: string;
}

interface AssistantMessage {
  id: string;
  role: string;
  content: Array<{ type: string; text?: { value: string } }>;
  created_at: number;
}

interface AssistantRun {
  id: string;
  status: string;
}

export function useAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [threadId, setThreadId] = useState<string>('');
  const { toast } = useToast();

  // Initialize an assistant
  const initializeAssistant = useCallback(async (instructions?: string) => {
    setIsLoading(true);
    try {
      // Check if an assistant already exists in localStorage
      const storedAssistant = localStorage.getItem('emotionscare_assistant');
      if (storedAssistant) {
        try {
          setAssistant(JSON.parse(storedAssistant) as Assistant);
        } catch {
          // Invalid JSON — remove corrupted data
          localStorage.removeItem('emotionscare_assistant');
        }
      }

      if (!assistant && !storedAssistant) {
        // Create a new assistant
        const { data, error } = await supabase.functions.invoke('assistant-api', {
          body: {
            action: 'create_assistant',
            instructions
          }
        });

        if (error) throw error;

        localStorage.setItem('emotionscare_assistant', JSON.stringify(data.assistant));
        setAssistant(data.assistant as Assistant);
      }

      // Initialize a thread (new for each session)
      const { data: threadData, error: threadError } = await supabase.functions.invoke('assistant-api', {
        body: { action: 'create_thread' }
      });

      if (threadError) throw threadError;

      setThreadId(threadData.thread.id);

    } catch (error) {
      logger.error('Error initializing assistant', error as Error, 'UI');
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible de créer un assistant IA pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [assistant, toast]);

  // Send a message to the assistant and get a response
  const sendMessage = useCallback(async (content: string): Promise<AssistantMessage[] | null> => {
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
      // Add message to thread
      const { error: msgError } = await supabase.functions.invoke('assistant-api', {
        body: {
          action: 'create_message',
          threadId,
          content
        }
      });

      if (msgError) throw msgError;

      // Run the assistant
      const { data: runData, error: runError } = await supabase.functions.invoke('assistant-api', {
        body: {
          action: 'run_assistant',
          threadId,
          assistantId: assistant.id
        }
      });

      if (runError) throw runError;

      // Wait for the run to complete (polling)
      let runStatus = (runData.run as AssistantRun).status;
      const runId = (runData.run as AssistantRun).id;

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
        runStatus = (checkData.run as AssistantRun).status;
      }

      // Get messages
      const { data: messagesData, error: messagesError } = await supabase.functions.invoke('assistant-api', {
        body: {
          action: 'get_messages',
          threadId
        }
      });

      if (messagesError) throw messagesError;

      return messagesData.messages.data as AssistantMessage[];

    } catch (error) {
      logger.error('Error sending message to assistant', error as Error, 'UI');
      toast({
        title: "Erreur de communication",
        description: "Impossible de communiquer avec l'assistant IA.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [assistant, threadId, toast]);

  return {
    assistant,
    threadId,
    isLoading,
    initializeAssistant,
    sendMessage
  };
}
