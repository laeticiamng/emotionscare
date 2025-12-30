/**
 * Sélecteur d'emojis simple
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Smile, Heart, ThumbsUp, Star, Coffee, Music, Gamepad2 } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
}

const EMOJI_CATEGORIES = {
  smileys: {
    icon: <Smile className="h-4 w-4" />,
    emojis: [
      '😊', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉',
      '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪',
      '😝', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶',
      '😏', '😒', '🙄', '😬', '😮', '😯', '😲', '😳', '🥺', '😢',
      '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩'
    ]
  },
  hearts: {
    icon: <Heart className="h-4 w-4" />,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
      '🫶', '🤟', '🤙', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌'
    ]
  },
  gestures: {
    icon: <ThumbsUp className="h-4 w-4" />,
    emojis: [
      '👍', '👎', '👏', '🙌', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘',
      '🤙', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✍️',
      '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀'
    ]
  },
  activities: {
    icon: <Star className="h-4 w-4" />,
    emojis: [
      '⭐', '🌟', '✨', '💫', '🔥', '💥', '⚡', '🌈', '☀️', '🌤️',
      '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎪', '🎭', '🎨',
      '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕'
    ]
  },
  food: {
    icon: <Coffee className="h-4 w-4" />,
    emojis: [
      '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷',
      '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑',
      '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥗', '🥘', '🍝'
    ]
  },
  games: {
    icon: <Gamepad2 className="h-4 w-4" />,
    emojis: [
      '🎮', '🕹️', '🎲', '🎯', '🎳', '🏓', '🏸', '🏒', '🏑', '🥍',
      '🏏', '🪃', '🥏', '🪀', '🪁', '⚽', '🏀', '🏈', '⚾', '🥎',
      '🧩', '♟️', '🃏', '🎴', '🀄', '👾', '🤖', '🎪', '🎰', '🎱'
    ]
  },
  wellness: {
    icon: <Music className="h-4 w-4" />,
    emojis: [
      '🧘', '🧘‍♀️', '🧘‍♂️', '🧖', '🧖‍♀️', '🧖‍♂️', '💆', '💆‍♀️', '💆‍♂️', '💇',
      '🛀', '🛌', '😴', '💤', '🌙', '⭐', '🌿', '🍃', '🌸', '🌺',
      '🌼', '🌻', '🌹', '🥀', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴'
    ]
  }
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, trigger }) => {
  const [open, setOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('buddy_recent_emojis');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    
    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(updated);
    localStorage.setItem('buddy_recent_emojis', JSON.stringify(updated));
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Tabs defaultValue="smileys" className="w-full">
          <TabsList className="w-full justify-start p-1 gap-1 bg-muted/50">
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-background px-2 py-1"
              >
                {category.icon}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Recent Emojis */}
          {recentEmojis.length > 0 && (
            <div className="p-2 border-b">
              <p className="text-xs text-muted-foreground mb-2">Récents</p>
              <div className="flex flex-wrap gap-1">
                {recentEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(emoji)}
                    className="text-xl hover:bg-muted rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <ScrollArea className="h-48">
                <div className="p-2 grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(emoji)}
                      className="text-xl hover:bg-muted rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
