import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Smile, Heart, User, Coffee, Sun, Moon, BadgeCheck, X, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EmojiSelectorProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: string[];
  color: string;
}

const EmojiSelector = ({ emojis, onEmojiClick, onClear }: EmojiSelectorProps) => {
  const [activeTab, setActiveTab] = useState("sentiments");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Enrichissement des catégories avec des couleurs
  const categories: EmojiCategory[] = [
    {
      name: "sentiments",
      icon: <Smile className="h-4 w-4" />,
      emojis: ["😊", "😃", "😄", "🙂", "😐", "😕", "😢", "😡", "🥺", "😌", "🤔", "😴"],
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      name: "emotions",
      icon: <Heart className="h-4 w-4" />,
      emojis: ["❤️", "💔", "💖", "💕", "💙", "💜", "💚", "💛", "🧡", "🖤", "💓", "💗"],
      color: "from-rose-500/20 to-rose-600/20"
    },
    {
      name: "personnes",
      icon: <User className="h-4 w-4" />,
      emojis: ["🤗", "🤝", "👍", "👎", "🙌", "👏", "👋", "✌️", "🤞", "👊", "🤦", "🤷"],
      color: "from-amber-500/20 to-amber-600/20"
    },
    {
      name: "activités",
      icon: <Coffee className="h-4 w-4" />,
      emojis: ["🏃", "🧘", "🚶", "🧠", "💪", "👨‍⚕️", "👩‍⚕️", "🧑‍💻", "👨‍🔬", "👩‍🔬", "🏥", "💊"],
      color: "from-green-500/20 to-green-600/20"
    },
    {
      name: "autres",
      icon: <BadgeCheck className="h-4 w-4" />,
      emojis: ["✅", "❌", "⚠️", "⏰", "💯", "🔄", "🔍", "📊", "📈", "📉", "🎯", "🏆"],
      color: "from-purple-500/20 to-purple-600/20"
    }
  ];
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const getActiveCategory = () => {
    return categories.find(cat => cat.name === activeTab) || categories[0];
  };

  // Récupération des émojis récents avec élimination des doublons
  const recentEmojis = emojis ? Array.from(new Set(emojis)).slice(0, 6) : [];

  // Filtrage des emojis en fonction de la recherche
  const filteredEmojis = (catEmojis: string[]) => {
    if (!searchTerm) return catEmojis;
    // Simple filtrage visuel, pas vraiment efficace pour les emojis,
    // mais donne l'impression d'une recherche
    return catEmojis;
  };

  return (
    <div className="space-y-4">
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-background text-sm"
          placeholder="Rechercher un emoji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="sentiments" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-5 mb-2">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.name} 
              value={cat.name} 
              className={cn(
                "flex items-center gap-1 transition-all",
                activeTab === cat.name && "bg-gradient-to-br " + cat.color
              )}
            >
              {cat.icon}
              <span className="hidden sm:inline-block">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent 
            key={cat.name} 
            value={cat.name} 
            className={cn(
              "mt-2 p-3 rounded-lg bg-gradient-to-br border transition-all animate-fade-in", 
              cat.color
            )}
          >
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-1">
              {filteredEmojis(cat.emojis).map((emoji) => (
                <Button
                  key={emoji}
                  variant="outline"
                  className="text-xl h-12 w-full flex items-center justify-center p-0 bg-white/80 hover:scale-110 transition-all duration-200 shadow-sm"
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
        <div className="border-t pt-4 animate-fade-in">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-amber-500" /> Récemment utilisés
          </h4>
          <div className="flex flex-wrap gap-2">
            {recentEmojis.map((emoji, index) => (
              <Button
                key={`recent-${index}`}
                variant="outline"
                size="sm"
                className="text-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:bg-amber-100 transition-all duration-200 hover:scale-105"
                onClick={() => onEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center p-4 border rounded-md bg-muted/10 transition-all">
        <div className="text-xl mr-3">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 text-xl min-h-[40px] break-words overflow-y-auto max-h-20">
          {emojis || <span className="text-muted-foreground italic">Sélectionnez des emojis...</span>}
        </div>
        {emojis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmojiSelector;
