
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { faker } from '@faker-js/faker';

export function useAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [assistant, setAssistant] = useState<any>(null);
  const [threadId, setThreadId] = useState<string>('');
  const { toast } = useToast();

  // Initialize an assistant
  const initializeAssistant = async (instructions?: string) => {
    setIsLoading(true);
    try {
      // Check if an assistant already exists in localStorage
      const storedAssistant = localStorage.getItem('emotionscare_assistant');
      if (storedAssistant) {
        setAssistant(JSON.parse(storedAssistant));
      } else {
        // Create a new assistant
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
      
      // Initialize a thread (new for each session)
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

  // Send a message to the assistant and get a response
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
      
      // Get messages
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
