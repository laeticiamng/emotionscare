
import { VRSessionTemplate } from '@/types';

const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: "vr1",
    name: "Calm Beach Meditation",
    title: "Calm Beach Meditation",
    description: "Relax to the sound of waves on a peaceful beach",
    duration: 5 * 60, // 5 minutes in seconds
    emotion: "calm",
    is_audio_only: true,
    audio_url: "/audio/beach-meditation.mp3",
    benefits: [
      "Stress reduction",
      "Mental clarity",
      "Improved focus"
    ],
    difficulty: "easy",
    theme: "nature",
    tags: ["relaxation", "beach", "beginner"]
  },
  {
    id: "vr2",
    name: "Energizing Forest Walk",
    title: "Energizing Forest Walk",
    description: "A virtual walk through a vibrant forest",
    duration: 10 * 60, // 10 minutes in seconds
    emotion: "energetic",
    is_audio_only: false,
    preview_url: "/images/forest-preview.jpg",
    benefits: [
      "Energy boost",
      "Mood elevation",
      "Creativity enhancement"
    ],
    difficulty: "medium",
    theme: "nature",
    tags: ["energy", "forest", "walking"]
  },
  {
    id: "vr3",
    name: "Mindful Breathing",
    title: "Mindful Breathing",
    description: "Guided breathing exercise for focused attention",
    duration: 3 * 60, // 3 minutes in seconds
    emotion: "focused",
    is_audio_only: true,
    audio_url: "/audio/breathing-exercise.mp3",
    benefits: [
      "Improved concentration",
      "Stress reduction",
      "Present moment awareness"
    ],
    difficulty: "easy",
    theme: "mindfulness",
    tags: ["breathing", "focus", "beginner"]
  },
  {
    id: "vr4",
    name: "Evening Wind Down",
    title: "Evening Wind Down",
    description: "A calming session to help you relax before sleep",
    duration: 15 * 60, // 15 minutes in seconds
    emotion: "calm",
    is_audio_only: true,
    audio_url: "/audio/evening-relaxation.mp3",
    benefits: [
      "Better sleep",
      "Anxiety reduction",
      "Mental decompression"
    ],
    difficulty: "easy",
    theme: "relaxation",
    tags: ["sleep", "evening", "relaxation"]
  },
  {
    id: "vr5",
    name: "Mountain Visualization",
    title: "Mountain Visualization",
    description: "Visualize yourself standing strong like a mountain",
    duration: 8 * 60, // 8 minutes in seconds
    emotion: "strong",
    is_audio_only: false,
    preview_url: "/images/mountain-visualization.jpg",
    benefits: [
      "Inner strength",
      "Emotional resilience",
      "Self-confidence"
    ],
    difficulty: "medium",
    theme: "visualization",
    tags: ["strength", "confidence", "resilience"]
  }
];

export default mockVRTemplates;
