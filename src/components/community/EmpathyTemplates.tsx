/**
 * EmpathyTemplates - Modèles de réponses empathiques
 * Aide les utilisateurs à répondre avec bienveillance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const EMPATHY_TEMPLATES = [
  {
    category: 'Soutien',
    emoji: '🤗',
    templates: [
      'Je comprends ce que tu ressens...',
      'C\'est courageux de partager ça avec nous.',
      'Tu n\'es pas seul(e) dans cette situation.',
      'Merci d\'avoir partagé, ça demande du courage.'
    ]
  },
  {
    category: 'Encouragement',
    emoji: '💪',
    templates: [
      'Tu as fait du chemin, c\'est inspirant !',
      'Chaque petit pas compte, continue !',
      'Tu as toutes les ressources en toi.',
      'Je crois en toi et en ta capacité à surmonter ça.'
    ]
  },
  {
    category: 'Compassion',
    emoji: '💕',
    templates: [
      'C\'est normal de se sentir ainsi.',
      'Prends soin de toi, tu le mérites.',
      'Tes émotions sont valides.',
      'Je t\'envoie beaucoup de bienveillance.'
    ]
  },
  {
    category: 'Partage',
    emoji: '🌟',
    templates: [
      'J\'ai vécu quelque chose de similaire...',
      'Ce qui m\'a aidé dans ce cas...',
      'Une chose qui pourrait t\'aider...',
      'Personnellement, je fais/j\'ai fait...'
    ]
  }
];

interface EmpathyTemplatesProps {
  onSelect: (template: string) => void;
  className?: string;
}

export function EmpathyTemplates({ onSelect, className }: EmpathyTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (template: string) => {
    onSelect(template);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        aria-expanded={isOpen}
        aria-label="Suggestions de réponses bienveillantes"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Réponses bienveillantes</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 z-50 w-72 rounded-lg border bg-background shadow-lg"
          >
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-1 mb-1">
                Choisis une suggestion pour commencer
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {EMPATHY_TEMPLATES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(
                      selectedCategory === cat.category ? null : cat.category
                    )}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors',
                      selectedCategory === cat.category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.category}</span>
                  </button>
                ))}
              </div>

              {/* Templates */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {EMPATHY_TEMPLATES
                  .filter(cat => !selectedCategory || cat.category === selectedCategory)
                  .flatMap(cat => cat.templates.map((template, idx) => (
                    <button
                      key={`${cat.category}-${idx}`}
                      onClick={() => handleSelect(template)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors flex items-start gap-2"
                    >
                      <Heart className="h-3 w-3 mt-1 text-pink-500 shrink-0" />
                      <span>{template}</span>
                    </button>
                  )))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmpathyTemplates;
