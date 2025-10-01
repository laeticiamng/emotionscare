// @ts-nocheck
import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Brain, Leaf, Music, Sun, Moon, Wind } from 'lucide-react';

interface MoodCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface MoodCardsProps {
  value: string[];
  onChange: (cards: string[]) => void;
  maxCards?: number;
  className?: string;
}

const availableCards: MoodCard[] = [
  {
    id: 'joy',
    name: 'Joie',
    icon: <Sun className="h-5 w-5" />,
    color: 'from-yellow-400 to-orange-500',
    description: 'Optimisme et énergie positive'
  },
  {
    id: 'calm',
    name: 'Calme',
    icon: <Leaf className="h-5 w-5" />,
    color: 'from-green-400 to-blue-500',
    description: 'Sérénité et paix intérieure'
  },
  {
    id: 'energy',
    name: 'Énergie',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-red-400 to-pink-500',
    description: 'Vitalité et dynamisme'
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: <Brain className="h-5 w-5" />,
    color: 'from-purple-400 to-indigo-500',
    description: 'Concentration et clarté'
  },
  {
    id: 'love',
    name: 'Amour',
    icon: <Heart className="h-5 w-5" />,
    color: 'from-pink-400 to-red-500',
    description: 'Connexion et bienveillance'
  },
  {
    id: 'peace',
    name: 'Paix',
    icon: <Moon className="h-5 w-5" />,
    color: 'from-blue-400 to-purple-500',
    description: 'Tranquillité et harmonie'
  },
  {
    id: 'creativity',
    name: 'Créativité',
    icon: <Music className="h-5 w-5" />,
    color: 'from-orange-400 to-pink-500',
    description: 'Inspiration et imagination'
  },
  {
    id: 'freedom',
    name: 'Liberté',
    icon: <Wind className="h-5 w-5" />,
    color: 'from-teal-400 to-cyan-500',
    description: 'Légèreté et spontanéité'
  }
];

export const MoodCards: React.FC<MoodCardsProps> = ({
  value,
  onChange,
  maxCards = 3,
  className = ''
}) => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  const selectedCards = availableCards.filter(card => value.includes(card.id));
  const availableForSelection = availableCards.filter(card => !value.includes(card.id));

  const addCard = (cardId: string) => {
    if (value.length < maxCards && !value.includes(cardId)) {
      onChange([...value, cardId]);
    }
  };

  const removeCard = (cardId: string) => {
    onChange(value.filter(id => id !== cardId));
  };

  const reorderCards = (newOrder: string[]) => {
    onChange(newOrder);
  };

  // Keyboard support for drag and drop
  const handleKeyDown = (event: React.KeyboardEvent, cardId: string, isSelected: boolean) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isSelected) {
        removeCard(cardId);
      } else {
        addCard(cardId);
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Selected Cards Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Votre Mix ({value.length}/{maxCards})
          </h3>
          <Badge variant="secondary">
            Glissez pour organiser
          </Badge>
        </div>
        
        <div className="min-h-[120px] p-4 border-2 border-dashed border-muted rounded-lg bg-muted/20">
          {selectedCards.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Glissez {maxCards} cartes ici pour composer votre mix
            </div>
          ) : (
            <Reorder.Group
              axis="x"
              values={value}
              onReorder={reorderCards}
              className="flex gap-3 justify-center"
            >
              {selectedCards.map((card) => (
                <Reorder.Item
                  key={card.id}
                  value={card.id}
                  drag
                  className="cursor-grab active:cursor-grabbing"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, card.id, true)}
                  role="button"
                  aria-label={`Carte sélectionnée: ${card.name}. Appuyez sur Entrée pour retirer.`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileDrag={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    <Card className="w-24 h-24 cursor-grab active:cursor-grabbing relative group">
                      <CardContent className="p-0 h-full">
                        <div className={`h-full rounded-lg bg-gradient-to-br ${card.color} flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="relative z-10 text-center">
                            {card.icon}
                            <div className="text-xs font-medium mt-1">
                              {card.name}
                            </div>
                          </div>
                          
                          {/* Remove button */}
                          <Button
                            onClick={() => removeCard(card.id)}
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Retirer ${card.name}`}
                          >
                            ×
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>

      {/* Available Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Cartes Disponibles
        </h3>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {availableForSelection.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setDraggedCard(card.id)}
              onHoverEnd={() => setDraggedCard(null)}
            >
              <Card
                className={`w-full aspect-square cursor-pointer transition-all ${
                  value.length >= maxCards 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => addCard(card.id)}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, card.id, false)}
                role="button"
                aria-label={`${card.name}: ${card.description}. Appuyez sur Entrée pour ajouter.`}
              >
                <CardContent className="p-0 h-full">
                  <div className={`h-full rounded-lg bg-gradient-to-br ${card.color} flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center">
                      {card.icon}
                      <div className="text-xs font-medium mt-1">
                        {card.name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="text-center text-sm text-muted-foreground">
        💡 Glissez les cartes dans la zone de mix ou cliquez pour les sélectionner
      </div>
    </div>
  );
};

export default MoodCards;