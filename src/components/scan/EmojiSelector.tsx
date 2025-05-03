
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Smile, Heart, User, Coffee, Sun, Moon, Frown, BadgeCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmojiSelectorProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: string[];
}

const EmojiSelector = ({ emojis, onEmojiClick, onClear }: EmojiSelectorProps) => {
  const [activeTab, setActiveTab] = useState("sentiments");
  
  const categories: EmojiCategory[] = [
    {
      name: "sentiments",
      icon: <Smile className="h-4 w-4" />,
      emojis: ["😊", "😃", "😄", "🙂", "😐", "😕", "😢", "😡", "🥺", "😌", "🤔", "😴"]
    },
    {
      name: "emotions",
      icon: <Heart className="h-4 w-4" />,
      emojis: ["❤️", "💔", "💖", "💕", "💙", "💜", "💚", "💛", "🧡", "🖤", "💓", "💗"]
    },
    {
      name: "personnes",
      icon: <User className="h-4 w-4" />,
      emojis: ["🤗", "🤝", "👍", "👎", "🙌", "👏", "👋", "✌️", "🤞", "👊", "🤦", "🤷"]
    },
    {
      name: "activités",
      icon: <Coffee className="h-4 w-4" />,
      emojis: ["🏃", "🧘", "🚶", "🧠", "💪", "👨‍⚕️", "👩‍⚕️", "🧑‍💻", "👨‍🔬", "👩‍🔬", "🏥", "💊"]
    },
    {
      name: "autres",
      icon: <BadgeCheck className="h-4 w-4" />,
      emojis: ["✅", "❌", "⚠️", "⏰", "💯", "🔄", "🔍", "📊", "📈", "📉", "🎯", "🏆"]
    }
  ];
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const getActiveCategory = () => {
    return categories.find(cat => cat.name === activeTab) || categories[0];
  };

  const recentEmojis = emojis ? Array.from(new Set(emojis)).slice(0, 6) : [];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sentiments" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name} className="flex items-center gap-1">
              {cat.icon}
              <span className="hidden sm:inline-block">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="mt-2 p-1">
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-1">
              {cat.emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="outline"
                  className="text-xl h-10 w-full flex items-center justify-center p-0"
                  onClick={() => onEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {recentEmojis.length > 0 && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Sun className="h-3 w-3" /> Récemment utilisés
          </h4>
          <div className="flex flex-wrap gap-2">
            {recentEmojis.map((emoji, index) => (
              <Button
                key={`recent-${index}`}
                variant="outline"
                size="sm"
                className="text-lg"
                onClick={() => onEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center p-3 border rounded-md bg-muted/10">
        <div className="text-xl mr-2">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 text-xl min-h-[40px] break-words overflow-y-auto max-h-20">
          {emojis || <span className="text-muted-foreground">Sélectionnez des emojis...</span>}
        </div>
        {emojis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmojiSelector;
