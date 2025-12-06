import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CardDeckProps {
  onDrawCard: () => void;
  isDrawing: boolean;
}

export const CardDeck = ({ onDrawCard, isDrawing }: CardDeckProps) => {
  return (
    <div className="relative flex items-center justify-center min-h-[400px]">
      {/* Halo cosmique de fond */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Deck de cartes empilées */}
      <div className="relative">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 h-72 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-2 border-primary/30 shadow-2xl"
            style={{
              zIndex: 5 - i,
              top: i * -4,
              left: i * 2,
              transform: `rotate(${(i - 2) * 2}deg)`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [(i - 2) * 2, (i - 2) * 2 + 2, (i - 2) * 2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Carte centrale interactive */}
        <motion.button
          onClick={onDrawCard}
          disabled={isDrawing}
          className="relative w-48 h-72 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-2xl border-2 border-background/20 overflow-hidden group"
          whileHover={{ scale: 1.05, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 20px 60px rgba(0,0,0,0.3)',
              '0 30px 80px rgba(var(--primary-rgb), 0.4)',
              '0 20px 60px rgba(0,0,0,0.3)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {/* Effet shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Contenu */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-background">
            <Sparkles className="w-16 h-16 mb-4 group-hover:animate-spin" />
            <p className="text-xl font-bold">Tire ta carte</p>
            <p className="text-sm opacity-80 mt-2">de la semaine ✨</p>
          </div>

          {/* Particules flottantes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-background/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.button>
      </div>

      {/* CTA text */}
      <motion.p
        className="absolute bottom-0 text-center text-muted-foreground text-sm"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        Swipe ou tap pour révéler ton énergie ✨
      </motion.p>
    </div>
  );
};
