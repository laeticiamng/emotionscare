
import { useState, useEffect } from 'react';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock implementation
    setLoading(true);
    try {
      // Simulate API call
      const mockUser: User = {
        id: '123',
        name: 'Test User',
        email: email,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Mock implementation
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    // Mock implementation
    setLoading(true);
    try {
      // Simulate API call
      const mockUser: User = {
        id: '123',
        name: name || email.split('@')[0],
        email: email,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser: User): Promise<void> => {
    // Mock implementation
    try {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser
  };
};

export default useAuth;
