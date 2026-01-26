// @ts-nocheck

import { VRSession, VRSessionTemplate } from '@/types/vr';

// Simulated VR service
const VRService = {
  // Get available VR session templates
  getTemplates: async (): Promise<VRSessionTemplate[]> => {
    // This would fetch from an API in a real implementation
    const mockTemplates: VRSessionTemplate[] = [
      {
        id: 'template-1',
        name: 'Calm Beach',
        title: 'Calm Beach Meditation',
        description: 'Relax on a serene beach with gentle waves and soothing sounds',
        duration: 600, // 10 minutes
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
        duration: 900, // 15 minutes
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
    
    return mockTemplates;
  },
  
  // Get user's VR session history
  getUserSessions: async (userId: string): Promise<VRSession[]> => {
    // This would fetch from an API in a real implementation
    const mockSessions: VRSession[] = [
      {
        id: 'session-1',
        templateId: 'template-1',
        userId: userId,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 600000).toISOString(),
        duration: 600,
        completed: true,
        progress: 1,
        feedback: {
          id: 'feedback-1',
          sessionId: 'session-1',
          userId: userId,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 600000).toISOString(),
          rating: 4,
          emotionBefore: 'stressed',
          emotionAfter: 'calm',
          comment: 'Very relaxing experience'
        },
        metrics: {
          heartRate: [72, 70, 68, 65, 64],
          stressLevel: 0.3,
          focusLevel: 0.8
        }
      }
    ];
    
    return mockSessions;
  },
  
  // Start a new VR session
  startSession: async (userId: string, templateId: string): Promise<VRSession> => {
    // This would call an API to start a session in a real implementation
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      templateId: templateId,
      userId: userId,
      startTime: new Date().toISOString(),
      duration: 0,
      completed: false,
      progress: 0
    };
    
    return newSession;
  },
  
  // End an active VR session
  endSession: async (sessionId: string, feedback?: any): Promise<VRSession> => {
    // This would call an API to end a session in a real implementation
    const mockSession: VRSession = {
      id: sessionId,
      templateId: 'template-1',
      userId: 'user-1',
      startTime: new Date(Date.now() - 600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: 600,
      completed: true,
      progress: 1,
      feedback: feedback ? {
        id: `feedback-${Date.now()}`,
        sessionId: sessionId,
        userId: 'user-1',
        timestamp: new Date().toISOString(),
        rating: feedback.rating || 5,
        emotionBefore: feedback.emotionBefore || 'neutral',
        emotionAfter: feedback.emotionAfter || 'calm',
        comment: feedback.comment || ''
      } : undefined
    };
    
    return mockSession;
  }
};

export default VRService;
