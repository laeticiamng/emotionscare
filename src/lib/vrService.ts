import { supabase } from '@/integrations/supabase/client';
import { VRSession } from '@/types/vr';

export const getVRTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('vr_session_templates')
      .select('*');
    
    if (error) {
      console.error('Error fetching VR session templates:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching VR session templates:', error);
    throw error;
  }
};

export const getVRTemplate = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vr_session_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching VR session template:', error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error fetching VR session template:', error);
    throw error;
  }
};

export const getUserVRSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('vr_sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user VR sessions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user VR sessions:', error);
    throw error;
  }
};

export const getVRSession = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vr_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching VR session:', error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error fetching VR session:', error);
    throw error;
  }
};

export const createVRSession = async (sessionData: Partial<VRSession>) => {
  try {
    const { data, error } = await supabase
      .from('vr_sessions')
      .insert([sessionData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating VR session:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating VR session:', error);
    throw error;
  }
};

export const updateVRSession = async (id: string, sessionData: Partial<VRSession>) => {
  try {
    const { data, error } = await supabase
      .from('vr_sessions')
      .update(sessionData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating VR session:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating VR session:', error);
    throw error;
  }
};

export const deleteVRSession = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vr_sessions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting VR session:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting VR session:', error);
    throw error;
  }
};

export const saveRelaxationSession = async (sessionData: Partial<VRSession>): Promise<boolean> => {
  try {
    // Mock implementation for now
    console.log('Saving relaxation session:', sessionData);
    
    // In a real implementation, this would save to the database
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error saving relaxation session:', error);
    return false;
  }
};
