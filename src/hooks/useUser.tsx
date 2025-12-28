/**
 * useUser Hook - Wrapper autour du module profile
 * Maintient la compatibilité avec le code existant
 */

import { useProfile } from '@/modules/profile';
import { useAuth } from '@/contexts/AuthContext';

export interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
}

export const useUser = () => {
  const { user: authUser } = useAuth();
  const { 
    profile, 
    isLoading, 
    error, 
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useProfile();

  // Map profile to user format for compatibility
  const user: UserData | null = profile ? {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    location: profile.location,
  } : authUser ? {
    id: authUser.id,
    email: authUser.email || null,
    name: authUser.user_metadata?.name || null,
    role: 'b2c',
    avatar_url: authUser.user_metadata?.avatar_url || null,
    bio: null,
    phone: null,
    location: null,
  } : null;

  const updateUser = async (userData: Partial<UserData>) => {
    await updateProfile({
      name: userData.name || undefined,
      bio: userData.bio || undefined,
      phone: userData.phone || undefined,
      location: userData.location || undefined,
    });
    return user;
  };

  return {
    user,
    isLoading,
    error,
    updateUser,
    uploadAvatar,
    removeAvatar,
  };
};

export default useUser;
