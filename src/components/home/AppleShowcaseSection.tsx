/**
 * AppleShowcaseSection - Section showcase avec vidéo/démo style Apple
 * Grande image/vidéo centrée avec texte minimal
 */

import React, { memo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppleShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.3 });
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-foreground text-background overflow-hidden"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Une expérience{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                immersive
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-background/70 max-w-2xl mx-auto">
              Des protocoles conçus pour t'absorber totalement. 
              Quand le monde extérieur s'efface, la paix intérieure émerge.
            </p>
          </motion.div>

          {/* Showcase mockup */}
          <motion.div
            style={{ y, scale, opacity }}
            className="relative"
          >
            {/* Device frame */}
            <div className="relative mx-auto max-w-4xl">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-[3rem] blur-2xl opacity-30" />
              
              {/* Screen */}
              <div className="relative bg-gradient-to-br from-background to-muted rounded-[2.5rem] p-2 shadow-2xl">
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                  {/* Placeholder for app screenshot/video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      {/* Abstract UI representation */}
                      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className={cn(
                              "aspect-square rounded-2xl",
                              i === 0 && "bg-gradient-to-br from-red-500 to-rose-500",
                              i === 1 && "bg-gradient-to-br from-indigo-500 to-purple-500",
                              i === 2 && "bg-gradient-to-br from-amber-500 to-orange-500"
                            )}
                          />
                        ))}
                      </div>
                      
                      {/* Breathing circle animation */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                      >
                        <span className="text-white text-lg font-medium">Respire</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play demo"}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white ml-1" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features below showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-24"
          >
            {[
              { title: "Stop", desc: "Interromps une crise en cours" },
              { title: "Reset", desc: "Récupère en 3 minutes" },
              { title: "Night", desc: "Force ton cerveau à couper" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-background/60">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AppleShowcaseSection);
