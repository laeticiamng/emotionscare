import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { WeeklyCard } from '@/types/card';

interface CardFloatProps {
  card: WeeklyCard;
}

export const CardFloat = ({ card }: CardFloatProps) => {
  // Si l'icon est un emoji, on ne cherche pas de Lucide icon
  const isEmoji = card.icon && card.icon.length <= 2;
  const IconComponent = !isEmoji && (LucideIcons as any)[card.icon] 
    ? (LucideIcons as any)[card.icon]
    : null;

  return (
    <motion.div
      className="fixed bottom-8 right-8 w-32 h-48 rounded-2xl shadow-xl cursor-pointer z-50 overflow-hidden"
      style={{
        background: card.color,
      }}
      animate={{
        y: [-5, 5, -5],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 0,
        transition: { duration: 0.2 }
      }}
    >
      {/* Contenu miniature */}
      <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
        {IconComponent ? (
          <IconComponent size={32} strokeWidth={1.5} className="mb-2" />
        ) : (
          <span className="text-4xl mb-2">{card.icon}</span>
        )}
        <p className="text-sm font-bold text-center">{card.badge}</p>
      </div>

      {/* Badge rareté si rare/epic/legendary */}
      {card.rarity !== 'common' && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <span className="text-xs">✨</span>
        </motion.div>
      )}
    </motion.div>
  );
};
