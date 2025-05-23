
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserModeType, UserModeContextType } from '@/types/userMode';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  isLoading: true,
  changeUserMode: () => {},
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  // Load user mode from local storage or user metadata
  useEffect(() => {
    // Skip if still loading auth data
    if (authLoading) {
      return;
    }

    const initUserMode = async () => {
      setIsLoading(true);
      
      try {
        // First check local storage for remembered mode
        const storedMode = localStorage.getItem('userMode') as UserModeType | null;
        
        // If user is logged in, get mode from user metadata
        if (user) {
          const userRole = user.user_metadata?.role;
          
          if (userRole) {
            // Normalize role to user mode
            let modeFromRole: UserModeType = 'b2c';
            
            if (userRole === 'b2b_admin' || userRole === 'admin') {
              modeFromRole = 'b2b_admin';
            } else if (userRole === 'b2b_user' || userRole === 'b2b-user') {
              modeFromRole = 'b2b_user';
            }
            
            setUserMode(modeFromRole);
            localStorage.setItem('userMode', modeFromRole);
            setIsLoading(false);
            return;
          }
        }
        
        // If no user or no role, use stored mode or default to b2c
        if (storedMode) {
          setUserMode(storedMode);
        } else {
          setUserMode('b2c');
          localStorage.setItem('userMode', 'b2c');
        }
      } catch (error) {
        console.error('Error initializing user mode:', error);
        setUserMode('b2c');
      } finally {
        setIsLoading(false);
      }
    };
    
    initUserMode();
  }, [user, authLoading]);

  // Function to change user mode and update user metadata if logged in
  const changeUserMode = async (mode: UserModeType) => {
    setIsLoading(true);
    
    try {
      // Update local storage
      localStorage.setItem('userMode', mode);
      
      // Update user metadata if logged in
      if (user) {
        // Map user mode to role
        let role = mode;
        
        // Update user metadata
        const { error } = await supabase.auth.updateUser({
          data: { role }
        });
        
        if (error) {
          throw error;
        }
      }
      
      // Update state
      setUserMode(mode);
      toast.success(`Mode ${getUserModeDisplayName(mode)} activé`);
    } catch (error) {
      console.error('Error changing user mode:', error);
      toast.error('Erreur lors du changement de mode');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear user mode
  const clearUserMode = () => {
    localStorage.removeItem('userMode');
    setUserMode(null);
  };
  
  return (
    <UserModeContext.Provider
      value={{ userMode, setUserMode, isLoading, changeUserMode, clearUserMode }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);

export default UserModeContext;
