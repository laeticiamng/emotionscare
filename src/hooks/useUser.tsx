
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useUser = () => {
  const { user: authUser, updateUser: authUpdateUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser as User);
    }
    setIsLoading(false);
  }, [authUser]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Call the auth context update function
      const updatedUser = await authUpdateUser({
        ...user,
        ...userData
      } as User);
      
      // Update local user state
      setUser(prevUser => prevUser ? {
        ...prevUser,
        ...userData
      } : null);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées"
      });
      
      return updatedUser;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMsg);
      
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, authUpdateUser, toast]);

  return {
    user,
    isLoading,
    error,
    updateUser
  };
};

export default useUser;
