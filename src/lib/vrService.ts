
import { db } from '@/lib/db'; // Import your database client
import { VRSession, VRSessionTemplate } from '@/types/vr';

export async function getRecommendedVRSessions(): Promise<VRSessionTemplate[]> {
  try {
    // Mocking database fetch
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      {
        id: 'vr-1',
        name: 'Ocean Calm',
        title: 'Ocean Calm',
        description: 'Experience the gentle sounds and sights of the ocean',
        category: 'relaxation',
        duration: 10,
        intensity: 'low',
        tags: ['ocean', 'calm', 'beginner'],
        thumbnail: '/images/vr/ocean.jpg',
      },
      {
        id: 'vr-2',
        name: 'Forest Meditation',
        title: 'Forest Meditation',
        description: 'Deep meditation in a peaceful forest setting',
        category: 'meditation',
        duration: 15,
        intensity: 'medium',
        tags: ['forest', 'meditation', 'nature'],
        thumbnail: '/images/vr/forest.jpg',
      }
    ] as VRSessionTemplate[];
  } catch (error) {
    console.error("Error fetching VR sessions:", error);
    return [];
  }
}

export async function getUserVRHistory(userId: string): Promise<VRSession[]> {
  try {
    // Mocking database fetch
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      {
        id: 'session-1',
        user_id: userId,
        template_id: 'vr-1',
        start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        end_time: new Date(Date.now() - 86400000 + 600000).toISOString(), // +10 minutes
        duration_seconds: 600,
        completed: true,
      },
      {
        id: 'session-2',
        user_id: userId,
        template_id: 'vr-2',
        start_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        end_time: new Date(Date.now() - 172800000 + 900000).toISOString(), // +15 minutes
        duration_seconds: 900,
        completed: true,
      }
    ] as VRSession[];
  } catch (error) {
    console.error("Error fetching user VR history:", error);
    return [];
  }
}

export async function recordVRSession(
  userId: string, 
  templateId: string, 
  startTime: Date,
  endTime?: Date,
  completed: boolean = false
): Promise<VRSession | null> {
  try {
    // Mocking database insert
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const durationSeconds = endTime 
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) 
      : 0;
    
    const session: VRSession = {
      id: `session-${Date.now()}`,
      user_id: userId,
      template_id: templateId,
      start_time: startTime.toISOString(),
      end_time: endTime?.toISOString(),
      duration_seconds: durationSeconds,
      completed,
    };
    
    return session;
  } catch (error) {
    console.error("Error recording VR session:", error);
    return null;
  }
}
