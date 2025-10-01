// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Story } from '@/types/Story';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StoryCardProps {
  story: Story;
  onSelect?: (story: Story) => void;
  className?: string;
  compact?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onSelect,
  className = '',
  compact = false
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(story);
    }
  };

  // Helper function to get emotion color
  const getEmotionColor = () => {
    if (!story.emotion) return 'bg-primary/10';

    switch (story.emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'sad':
      case 'sadness':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'angry':
      case 'anger':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'calm':
        return 'bg-green-100 dark:bg-green-900/30';
      default:
        return 'bg-primary/10';
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'Date inconnue';
    
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${className} ${getEmotionColor()}`}
      onClick={handleClick}
    >
      {story.image && (
        <div className="relative w-full h-32 overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className={`p-4 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        <h3 className={`font-medium ${compact ? 'text-sm' : 'text-lg'}`}>{story.title}</h3>
        <p className={`text-muted-foreground ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
          {story.content}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{story.created_at ? formatDate(story.created_at) : 'Date inconnue'}</span>
          {story.emotion && <span className="capitalize">{story.emotion}</span>}
        </div>
      </CardContent>
      
      {story.cta && !compact && (
        <CardFooter className="p-4 pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (story.cta?.route) {
                // Handle navigation or action
              }
            }}
            className="w-full"
          >
            {story.cta.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StoryCard;
