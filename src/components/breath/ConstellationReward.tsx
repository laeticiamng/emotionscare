import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConstellationRewardProps {
  onComplete: () => void;
  sessionType: string;
  className?: string;
}

export const ConstellationReward: React.FC<ConstellationRewardProps> = ({
  onComplete,
  sessionType,
  className = ""
}) => {
  const [phase, setPhase] = useState<'forming' | 'complete'>('forming');
  const [stars, setStars] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate constellation pattern
    const starPositions = [
      { x: 50, y: 20 },   // Top
      { x: 30, y: 40 },   // Left
      { x: 70, y: 40 },   // Right
      { x: 40, y: 65 },   // Bottom left
      { x: 60, y: 65 },   // Bottom right
      { x: 50, y: 80 },   // Bottom center
    ];
    
    setStars(starPositions.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      delay: i * 0.3
    })));

    const timer = setTimeout(() => {
      setPhase('complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-radial from-indigo-900/20 via-purple-900/10 to-black p-8 ${className}`}>
      {/* Constellation formation */}
      <div className="relative w-96 h-96 mb-12">
        {/* Background stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main constellation */}
        <div className="relative w-full h-full">
          {stars.map((star, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: phase === 'forming' ? [0, 1.5, 1] : 1,
                opacity: 1 
              }}
              transition={{
                delay: star.delay,
                duration: 0.8,
                type: "spring"
              }}
            >
              <Star 
                className="w-8 h-8 text-yellow-300 fill-yellow-300" 
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.5))'
                }}
              />
            </motion.div>
          ))}

          {/* Connecting lines */}
          {phase === 'complete' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {stars.slice(0, -1).map((star, index) => {
                const nextStar = stars[index + 1];
                return (
                  <motion.line
                    key={index}
                    x1={`${star.x}%`}
                    y1={`${star.y}%`}
                    x2={`${nextStar.x}%`}
                    y2={`${nextStar.y}%`}
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ 
                      delay: 2 + index * 0.2,
                      duration: 0.8 
                    }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Central glow effect */}
        {phase === 'complete' && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 1.5], 
              opacity: [0, 0.8, 0.4] 
            }}
            transition={{ delay: 3, duration: 1.5 }}
          />
        )}
      </div>

      {/* Completion card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phase === 'complete' ? 0.5 : 2.5 }}
      >
        <Card className="bg-card/90 backdrop-blur-md border-0 shadow-elegant max-w-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.5, type: "spring" }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            </motion.div>
            
            <Badge 
              variant="secondary"
              className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
            >
              Cosmos Apaisé
            </Badge>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nouvelle constellation créée ✨
            </h3>
            
            <p className="text-sm text-muted-foreground mb-6">
              Tes étoiles personnelles brillent maintenant dans ta galaxie.
              Ton rythme respiratoire a donné naissance à cette beauté cosmique.
            </p>

            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
              >
                <Button 
                  onClick={onComplete}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Continuer le voyage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};