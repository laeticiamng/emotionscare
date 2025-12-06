import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useAvatarHelpers() {
  const { user, updateUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour télécharger un avatar");
      }

      setUploading(true);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user's metadata to include the avatar URL
      await updateUser({
        data: { avatar_url: publicUrl }
      });

      // Update the local state
      setAvatarUrl(publicUrl);

      toast.success("Avatar mis à jour avec succès");

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || "Erreur lors du téléchargement de l'avatar");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour supprimer votre avatar");
      }

      setUploading(true);

      // Get the file path from the current avatar URL
      const currentAvatarUrl = user.user_metadata?.avatar_url;
      if (currentAvatarUrl) {
        const filePath = currentAvatarUrl.split('/').pop();
        if (filePath) {
          // Delete the file from Supabase storage (optional, you can keep old avatars)
          // await supabase.storage.from('avatars').remove([`avatars/${filePath}`]);
        }
      }

      // Update the user's metadata to remove the avatar URL
      await updateUser({
        data: { avatar_url: null }
      });

      // Update the local state
      setAvatarUrl(null);

      toast.success("Avatar supprimé avec succès");

    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast.error(error.message || "Erreur lors de la suppression de l'avatar");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return {
    avatarUrl,
    uploading,
    uploadAvatar,
    removeAvatar,
    getInitials
  };
}

export default useAvatarHelpers;
