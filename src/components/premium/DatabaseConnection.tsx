import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DatabaseContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  retryConnection: () => void;
  executeQuery: (query: string, params?: any[]) => Promise<any>;
  subscribeToTable: (table: string, callback: (payload: any) => void) => () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseConnection = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseConnection must be used within DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test de connexion avec une requête simple
      const { data, error: connectionError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (connectionError) {
        throw connectionError;
      }

      setIsConnected(true);
      console.log('✅ Base de données connectée');
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
      console.error('❌ Erreur de connexion base de données:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    checkConnection();
  };

  const executeQuery = async (query: string, params: any[] = []) => {
    try {
      // Cette fonction peut être étendue pour des requêtes plus complexes
      console.log('Executing query:', query, params);
      return { success: true, data: null };
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  };

  const subscribeToTable = (table: string, callback: (payload: any) => void) => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe();

    // Retourner une fonction de désabonnement
    return () => {
      subscription.unsubscribe();
    };
  };

  useEffect(() => {
    checkConnection();

    // Écouter les changements de statut de connexion
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkConnection();
      } else if (event === 'SIGNED_OUT') {
        setIsConnected(false);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value: DatabaseContextType = {
    isConnected,
    isLoading,
    error,
    retryConnection,
    executeQuery,
    subscribeToTable
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook pour les opérations de base de données courantes
export const useDatabase = () => {
  const { executeQuery, subscribeToTable } = useDatabaseConnection();
  const { user } = useAuth();

  const createUserProfile = async (profileData: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user?.id,
            ...profileData
          }
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const getUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user?.id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const saveUserActivity = async (activity: {
    activity_type: string;
    data: any;
    emotion_before?: string;
    emotion_after?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert([
          {
            user_id: user?.id,
            ...activity,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  };

  const getUserActivities = async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  };

  const incrementUserXP = async (xpAmount: number, source: string) => {
    try {
      // D'abord récupérer le profil actuel
      const profile = await getUserProfile();
      
      const newXP = (profile?.xp || 0) + xpAmount;
      const newLevel = Math.floor(newXP / 1000) + 1;

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          xp: newXP,
          level: newLevel
        })
        .eq('user_id', user?.id)
        .select();

      if (error) throw error;

      // Enregistrer l'activité XP
      await saveUserActivity({
        activity_type: 'xp_gained',
        data: { amount: xpAmount, source, new_total: newXP }
      });

      return { newXP, newLevel, levelUp: newLevel > (profile?.level || 1) };
    } catch (error) {
      console.error('Error incrementing XP:', error);
      throw error;
    }
  };

  return {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    saveUserActivity,
    getUserActivities,
    incrementUserXP
  };
};

export default DatabaseProvider;