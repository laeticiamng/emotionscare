// @ts-nocheck

import { VRSession, VRSessionTemplate, VREnvironment } from '@/types/vr';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { buildEndpoint, VR_ENDPOINTS } from '@/services/api/apiEndpoints';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// Fallback templates for offline/error scenarios
const FALLBACK_TEMPLATES: VRSessionTemplate[] = [
  {
    id: 'template-1',
    name: 'Calm Beach',
    title: 'Calm Beach Meditation',
    description: 'Relax on a serene beach with gentle waves and soothing sounds',
    duration: 600,
    thumbnailUrl: '/images/vr/beach-thumb.jpg',
    environmentId: 'env-beach',
    category: 'relaxation',
    intensity: 2,
    difficulty: 'easy',
    immersionLevel: 'medium',
    goalType: 'relaxation',
    interactive: false,
    tags: ['calm', 'beach', 'nature'],
    recommendedMood: 'calm'
  },
  {
    id: 'template-2',
    name: 'Forest Adventure',
    title: 'Forest Adventure',
    description: 'Explore a lush forest with ambient sounds and wildlife',
    duration: 900,
    thumbnailUrl: '/images/vr/forest-thumb.jpg',
    environmentId: 'env-forest',
    category: 'exploration',
    intensity: 4,
    difficulty: 'medium',
    immersionLevel: 'high',
    goalType: 'mindfulness',
    interactive: true,
    tags: ['forest', 'nature', 'adventure'],
    recommendedMood: 'curious'
  }
];

const VRService = {
  // Get available VR session templates
  getTemplates: async (): Promise<VRSessionTemplate[]> => {
    try {
      const res = await GlobalInterceptor.secureFetch(`${API_BASE}${VR_ENDPOINTS.LIST_TEMPLATES}`);
      if (!res || !res.ok) {
        return FALLBACK_TEMPLATES;
      }
      const { data } = await res.json();
      return data || FALLBACK_TEMPLATES;
    } catch {
      return FALLBACK_TEMPLATES;
    }
  },

  // Get user's VR session history
  getUserSessions: async (userId: string): Promise<VRSession[]> => {
    try {
      const res = await GlobalInterceptor.secureFetch(
        `${API_BASE}${VR_ENDPOINTS.LIST_SESSIONS}?user_id=${userId}`
      );
      if (!res || !res.ok) {
        return [];
      }
      const { data } = await res.json();
      return data || [];
    } catch {
      return [];
    }
  },

  // Start a new VR session
  startSession: async (userId: string, templateId: string): Promise<VRSession> => {
    const res = await GlobalInterceptor.secureFetch(`${API_BASE}${VR_ENDPOINTS.CREATE_SESSION}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        template_id: templateId,
        started_at: new Date().toISOString()
      })
    });

    if (!res || !res.ok) {
      throw new Error('Failed to start VR session');
    }

    const { data } = await res.json();
    return data;
  },

  // End an active VR session
  endSession: async (sessionId: string, feedback?: any): Promise<VRSession> => {
    const endpoint = buildEndpoint(VR_ENDPOINTS.COMPLETE_SESSION, { id: sessionId });
    const res = await GlobalInterceptor.secureFetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ended_at: new Date().toISOString(),
        completed: true,
        feedback: feedback || null
      })
    });

    if (!res || !res.ok) {
      throw new Error('Failed to end VR session');
    }

    const { data } = await res.json();
    return data;
  },

  // Get session by ID
  getSession: async (sessionId: string): Promise<VRSession | null> => {
    try {
      const endpoint = buildEndpoint(VR_ENDPOINTS.GET_SESSION, { id: sessionId });
      const res = await GlobalInterceptor.secureFetch(`${API_BASE}${endpoint}`);
      if (!res || !res.ok) {
        return null;
      }
      const { data } = await res.json();
      return data;
    } catch {
      return null;
    }
  },

  // Update session progress
  updateSession: async (sessionId: string, updates: Partial<VRSession>): Promise<VRSession | null> => {
    try {
      const endpoint = buildEndpoint(VR_ENDPOINTS.UPDATE_SESSION, { id: sessionId });
      const res = await GlobalInterceptor.secureFetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res || !res.ok) {
        return null;
      }
      const { data } = await res.json();
      return data;
    } catch {
      return null;
    }
  },

  // Delete session
  deleteSession: async (sessionId: string): Promise<boolean> => {
    try {
      const endpoint = buildEndpoint(VR_ENDPOINTS.DELETE_SESSION, { id: sessionId });
      const res = await GlobalInterceptor.secureFetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE'
      });
      return res?.ok ?? false;
    } catch {
      return false;
    }
  },

  // Get VR stats for user
  getStats: async (userId: string): Promise<any> => {
    try {
      const res = await GlobalInterceptor.secureFetch(
        `${API_BASE}/vr/stats?user_id=${userId}`
      );
      if (!res || !res.ok) {
        return { total_sessions: 0, total_duration: 0 };
      }
      const { data } = await res.json();
      return data;
    } catch {
      return { total_sessions: 0, total_duration: 0 };
    }
  }
};

export default VRService;
