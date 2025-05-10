
import { useState, useEffect } from 'react';
import { ChatConversation } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook composite pour la gestion des conversations de chat
 * Combine le chargement et la gestion des conversations
 */
export function useConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const { user } = useAuth();
  
  // État de chargement combiné
  const isLoadingState = isLoading || isProcessingAction;
  
  // Charger les conversations au montage ou lorsque l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadAndSetConversations();
    }
  }, [user?.id]);
  
  // Fonction simulée pour charger les conversations
  const loadConversations = async (): Promise<ChatConversation[]> => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données simulées
      const mockConversations: ChatConversation[] = [
        {
          id: 'conv-1',
          title: 'Discussion sur le bien-être',
          lastMessage: 'Comment puis-je améliorer mon sommeil ?',
          user_id: user?.id || '',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      return mockConversations;
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger les conversations et mettre à jour l'état
  const loadAndSetConversations = async () => {
    const userConversations = await loadConversations();
    setConversations(userConversations);
    
    // Si aucune conversation active n'est définie mais que nous avons des conversations, définir la première comme active
    if (!activeConversationId && userConversations.length > 0) {
      console.log('Définition de la première conversation comme active:', userConversations[0].id);
      setActiveConversationId(userConversations[0].id);
    }
  };
  
  // Créer une conversation (simulation)
  const createConversation = async (title?: string): Promise<string | null> => {
    setIsProcessingAction(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConversation: ChatConversation = {
        id: `conv-${Date.now()}`,
        title: title || 'Nouvelle conversation',
        user_id: user?.id || '',
        created_at: new Date(),
        updated_at: new Date(),
        lastMessage: ''
      };
      
      // Ajouter la conversation à notre état
      setConversations(prev => [...prev, newConversation]);
      
      // Définir la nouvelle conversation comme active
      setActiveConversationId(newConversation.id);
      
      return newConversation.id;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      return null;
    } finally {
      setIsProcessingAction(false);
    }
  };
  
  // Supprimer une conversation (simulation)
  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    setIsProcessingAction(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Supprimer la conversation de notre état
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // Effacer la conversation active si la supprimée était active
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  };
  
  // Mettre à jour une conversation (simulation)
  const updateConversation = async (
    conversationId: string, 
    updates: { title?: string, lastMessage?: string }
  ): Promise<boolean> => {
    setIsProcessingAction(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour la conversation dans notre état
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? {...conv, ...updates, updatedAt: new Date()} 
            : conv
        )
      );
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la conversation:', error);
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  };

  return {
    conversations,
    activeConversationId,
    isLoading: isLoadingState,
    setActiveConversationId,
    loadConversations: loadAndSetConversations,
    createConversation,
    deleteConversation,
    updateConversation
  };
}
