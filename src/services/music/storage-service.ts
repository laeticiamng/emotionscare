/**
 * Music Storage Service
 * Gestion des fichiers audio dans Supabase Storage
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const BUCKET_NAME = 'music-tracks';
const PUBLIC_FOLDER = 'public';

/**
 * Générer une signed URL pour un fichier audio
 */
export async function getMusicSignedUrl(
  storagePath: string,
  expiresIn: number = 3600 // 1 heure par défaut
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    logger.error('Failed to generate signed URL', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Obtenir l'URL publique d'un fichier (pour le dossier public/)
 */
export function getPublicMusicUrl(filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${PUBLIC_FOLDER}/${filename}`);

  return data.publicUrl;
}

/**
 * Uploader un fichier audio
 */
export async function uploadMusicFile(
  file: File,
  path: string,
  options?: {
    cacheControl?: string;
    contentType?: string;
  }
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Construire le chemin avec user_id
    const fullPath = `${user.id}/${path}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || file.type,
        upsert: false,
      });

    if (error) throw error;

    logger.info('Music file uploaded', { path: data.path }, 'MUSIC');

    // Enregistrer dans music_uploads
    await supabase.from('music_uploads').insert({
      user_id: user.id,
      storage_path: data.path,
      original_filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      status: 'completed',
      processed_at: new Date().toISOString(),
    });

    return { success: true, path: data.path };
  } catch (error) {
    logger.error('Failed to upload music file', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Supprimer un fichier audio
 */
export async function deleteMusicFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    // Supprimer de music_uploads
    await supabase
      .from('music_uploads')
      .delete()
      .eq('user_id', user.id)
      .eq('storage_path', path);

    logger.info('Music file deleted', { path }, 'MUSIC');
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete music file', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Lister les fichiers audio de l'utilisateur
 */
export async function listUserMusicFiles(): Promise<Array<{
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(user.id);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to list music files', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les stats de stockage utilisateur
 */
export async function getUserStorageUsage(): Promise<{
  total_files: number;
  total_size_bytes: number;
  total_size_mb: number;
} | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .rpc('get_user_music_storage_usage', { p_user_id: user.id })
      .single();

    if (error) throw error;

    return data as {
      total_files: number;
      total_size_bytes: number;
      total_size_mb: number;
    };
  } catch (error) {
    logger.error('Failed to get storage usage', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * URLs des tracks par défaut (public)
 */
export const DEFAULT_TRACKS_URLS = {
  'vinyl-1': () => getPublicMusicUrl('serenite-fluide.mp3'),
  'vinyl-2': () => getPublicMusicUrl('energie-vibrante.mp3'),
  'vinyl-3': () => getPublicMusicUrl('focus-mental.mp3'),
  'vinyl-4': () => getPublicMusicUrl('guerison-douce.mp3'),
  'vinyl-5': () => getPublicMusicUrl('creative-spark.mp3'),
};
