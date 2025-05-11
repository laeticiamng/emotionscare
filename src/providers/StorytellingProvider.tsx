
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';

// Define story types
type StoryType = 'welcome' | 'onboarding' | 'achievement' | 'insight' | 'milestone' | 'feature';
type StoryVoice = 'supportive' | 'motivational' | 'analytical' | 'inspirational' | 'friendly';

interface Story {
  id: string;
  type: StoryType;
  title: string;
  content: string;
  voice: StoryVoice;
  emotion?: string;
  cta?: {
    text: string;
    action: string;
  };
  image?: string;
  seen?: boolean;
  timestamp: number;
}

interface StorytellingContextType {
  stories: Story[];
  activeStory: Story | null;
  hasUnreadStories: boolean;
  storyVoice: StoryVoice;
  setStoryVoice: (voice: StoryVoice) => void;
  showStory: (storyId: string) => void;
  markStorySeen: (storyId: string) => void;
  addStory: (story: Omit<Story, 'id' | 'timestamp'>) => void;
  dismissAllStories: () => void;
}

// Create default welcome stories
const createDefaultStories = (userMode: string): Story[] => [
  {
    id: '1',
    type: 'welcome',
    title: "Bienvenue sur EmotionsCare",
    content: "Découvrez comment notre plateforme peut vous accompagner dans votre bien-être émotionnel quotidien.",
    voice: 'friendly',
    emotion: 'neutral',
    cta: {
      text: "Explorer",
      action: "/dashboard"
    },
    image: "/assets/welcome.jpg",
    seen: false,
    timestamp: Date.now()
  },
  {
    id: '2',
    type: 'feature',
    title: "Musique adaptative",
    content: "Notre technologie adapte les ambiances musicales à vos émotions en temps réel.",
    voice: 'inspirational',
    emotion: 'calm',
    cta: {
      text: "Essayer",
      action: "/music"
    },
    seen: false,
    timestamp: Date.now()
  },
  {
    id: '3',
    type: 'feature',
    title: userMode === 'b2b-admin' ? 
      "Analysez le bien-être de votre équipe" : 
      "Protection avancée des données",
    content: userMode === 'b2b-admin' ? 
      "Accédez à des statistiques anonymisées pour comprendre les émotions collectives." : 
      "Vos données sont protégées par un chiffrement de niveau militaire et des protocoles d'anonymisation.",
    voice: userMode === 'b2b-admin' ? 'analytical' : 'supportive',
    emotion: userMode === 'b2b-admin' ? 'focused' : 'calm',
    cta: {
      text: userMode === 'b2b-admin' ? "Voir les analyses" : "En savoir plus",
      action: userMode === 'b2b-admin' ? "/analytics" : "/privacy"
    },
    seen: false,
    timestamp: Date.now()
  }
];

const StorytellingContext = createContext<StorytellingContextType>({
  stories: [],
  activeStory: null,
  hasUnreadStories: false,
  storyVoice: 'friendly',
  setStoryVoice: () => {},
  showStory: () => {},
  markStorySeen: () => {},
  addStory: () => {},
  dismissAllStories: () => {}
});

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { emotionalTone } = useBranding();
  const { userMode } = useUserMode();
  const { user } = useAuth();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyVoice, setStoryVoice] = useState<StoryVoice>('friendly');
  
  // Initialize stories based on user mode
  useEffect(() => {
    if (user) {
      // Load stories from local storage or create default ones
      const savedStories = localStorage.getItem(`${user.id}_stories`);
      if (savedStories) {
        try {
          setStories(JSON.parse(savedStories));
        } catch (e) {
          setStories(createDefaultStories(userMode));
        }
      } else {
        setStories(createDefaultStories(userMode));
      }
    }
  }, [user, userMode]);

  // Save stories to local storage when they change
  useEffect(() => {
    if (user && stories.length > 0) {
      localStorage.setItem(`${user.id}_stories`, JSON.stringify(stories));
    }
  }, [stories, user]);

  // Adapt story voice based on emotional tone
  useEffect(() => {
    const toneToVoice: Record<string, StoryVoice> = {
      neutral: 'friendly',
      energetic: 'motivational',
      calm: 'supportive',
      focused: 'analytical',
      joyful: 'inspirational',
      reflective: 'supportive'
    };
    
    setStoryVoice(toneToVoice[emotionalTone] || 'friendly');
  }, [emotionalTone]);

  const hasUnreadStories = stories.some(story => !story.seen);

  const showStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
    }
  };

  const markStorySeen = (storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
    if (activeStory?.id === storyId) {
      setActiveStory(null);
    }
  };

  const addStory = (newStory: Omit<Story, 'id' | 'timestamp'>) => {
    const story: Story = {
      ...newStory,
      id: `story_${Date.now()}`,
      timestamp: Date.now(),
      seen: false
    };
    
    setStories(prevStories => [story, ...prevStories]);
  };

  const dismissAllStories = () => {
    setStories(prevStories => 
      prevStories.map(story => ({ ...story, seen: true }))
    );
    setActiveStory(null);
  };

  return (
    <StorytellingContext.Provider value={{
      stories,
      activeStory,
      hasUnreadStories,
      storyVoice,
      setStoryVoice,
      showStory,
      markStorySeen,
      addStory,
      dismissAllStories
    }}>
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);

export default StorytellingContext;
