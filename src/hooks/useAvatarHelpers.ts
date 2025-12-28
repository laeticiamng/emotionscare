/**
 * useAvatarHelpers Hook
 * Wrapper autour du module profile pour la gestion des avatars
 * Maintient la compatibilité avec le code existant
 */

import { useProfile } from '@/modules/profile';
import { useAuth } from '@/contexts/AuthContext';

export function useAvatarHelpers() {
  const { user } = useAuth();
  const { 
    profile, 
    uploadAvatar: profileUploadAvatar, 
    removeAvatar: profileRemoveAvatar,
    isSaving: uploading,
  } = useProfile();

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  const uploadAvatar = async (file: File) => {
    await profileUploadAvatar(file);
  };

  const removeAvatar = async () => {
    await profileRemoveAvatar();
  };

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return {
    avatarUrl,
    uploading,
    uploadAvatar,
    removeAvatar,
    getInitials,
  };
}

export default useAvatarHelpers;
