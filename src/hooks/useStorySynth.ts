
import { useState } from 'react';
import useOpenAI from './api/useOpenAI';
import { logger } from '@/lib/logger';

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  imagePrompt?: string;
  choices?: { text: string; nextChapter: string }[];
}

interface Story {
  id: string;
  title: string;
  chapters: StoryChapter[];
  currentChapterIndex: number;
}

export const useStorySynth = () => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateText, isLoading } = useOpenAI();

  const createStory = async (imageFile?: File, prompt?: string): Promise<Story | null> => {
    setIsGenerating(true);

    const basePrompt = prompt || "Crée une histoire interactive courte et inspirante";
    const fullPrompt = `
Crée une histoire interactive en 3 chapitres avec des choix.
Thème: ${basePrompt}

Réponds en JSON strict :
{
  "title": "Titre de l'histoire",
  "chapters": [
    {
      "id": "ch1",
      "title": "Titre chapitre 1",
      "content": "Contenu narratif engageant (2-3 phrases)",
      "imagePrompt": "Description visuelle pour génération d'image",
      "choices": [
        {"text": "Choix A", "nextChapter": "ch2a"},
        {"text": "Choix B", "nextChapter": "ch2b"}
      ]
    }
  ]
}

Histoire positive, interactive, sans violence.
`;

    try {
      const response = await generateText({ prompt: fullPrompt });
      if (!response) return null;

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format JSON invalide');

      const storyData = JSON.parse(jsonMatch[0]);
      const story: Story = {
        id: `story-${Date.now()}`,
        title: storyData.title,
        chapters: storyData.chapters,
        currentChapterIndex: 0
      };

      setCurrentStory(story);
      return story;
    } catch (error) {
      logger.error('Story creation failed', error, 'SYSTEM');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const navigateToChapter = (chapterIndex: number) => {
    if (currentStory && chapterIndex < currentStory.chapters.length) {
      setCurrentStory({
        ...currentStory,
        currentChapterIndex: chapterIndex
      });
    }
  };

  const resetStory = () => {
    setCurrentStory(null);
  };

  return {
    currentStory,
    createStory,
    navigateToChapter,
    resetStory,
    isGenerating: isGenerating || isLoading
  };
};
