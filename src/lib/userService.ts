// @ts-nocheck
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export const updateUser = async (updatedUserData: Partial<User>): Promise<User> => {
  if (!updatedUserData.id) {
    throw new Error('User ID is required for update');
  }

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    throw new Error('User not authenticated');
  }

  // Update profile in Supabase
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updatedUserData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', updatedUserData.id)
    .select('*')
    .single();

  if (error) {
    logger.error('Failed to update user profile', error, 'SYSTEM');
    throw new Error(`Failed to update user: ${error.message}`);
  }

  if (!data) {
    throw new Error('User not found');
  }

  logger.info('User profile updated', { userId: updatedUserData.id }, 'SYSTEM');
  return data as User;
};
