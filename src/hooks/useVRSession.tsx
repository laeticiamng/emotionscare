
import { useState, useEffect } from 'react';
import { VRSessionTemplate, VRSession } from '@/types/vr';

// Demo VR sessions
const demoVRSessions: VRSessionTemplate[] = [
  {
    id: 'vr-session-1',
    title: 'Calm Beach Meditation',
    name: 'Calm Beach Meditation', // Include for backward compatibility
    description: 'Experience tranquility with gentle waves and sunshine.',
    thumbnailUrl: '/images/vr/beach-meditation.jpg',
    duration: 600, // 10 minutes
    difficulty: 'Beginner',
    category: 'Meditation',
    tags: ['relaxation', 'beach', 'meditation'],
  },
  {
    id: 'vr-session-2',
    title: 'Forest Focus',
    name: 'Forest Focus', // Include for backward compatibility
    description: 'Enhance concentration surrounded by peaceful forest.',
    thumbnailUrl: '/images/vr/forest-focus.jpg',
    duration: 900, // 15 minutes
    difficulty: 'Intermediate',
    category: 'Focus',
    tags: ['focus', 'forest', 'productivity'],
  },
];

export const useVRSession = () => {
  const [sessions, setSessions] = useState<VRSessionTemplate[]>([]);
  const [currentSession, setCurrentSession] = useState<VRSessionTemplate | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VRSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      // Simulate API request delay
      setTimeout(() => {
        setSessions(demoVRSessions);
        setLoading(false);
      }, 800);
    };

    loadSessions();
  }, []);

  return {
    sessions,
    currentSession,
    sessionHistory,
    loading,
    setCurrentSession,
  };
};
