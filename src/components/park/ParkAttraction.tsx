import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Sparkles } from 'lucide-react';

interface ParkAttractionProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradient: string;
  collection: string;
  delay?: number;
}

export const ParkAttraction: React.FC<ParkAttractionProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  route,
  gradient,
  collection,
  delay = 0
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        rotateX: 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      className="perspective-1000"
    >
      <Card
        onClick={() => navigate(route)}
        className={`
          relative overflow-hidden cursor-pointer h-full
          bg-gradient-to-br ${gradient}
          backdrop-blur-sm border-2 border-border/50
          hover:border-primary/60 hover:shadow-2xl
          transition-all duration-300
          group
        `}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.5 }}
        />
        
        {/* Sparkles decoration */}
        <motion.div
          className="absolute top-4 right-4 text-primary/40 group-hover:text-primary"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {subtitle}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Collection badge with animation */}
          <motion.div 
            className="pt-3 mt-3 border-t border-border/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            <div className="flex items-center gap-2 text-xs">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-3 w-3 text-primary" />
              </motion.div>
              <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {collection}
              </span>
            </div>
          </motion.div>

          {/* Interactive progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </CardContent>

        {/* Pulse effect on hover */}
        <motion.div
          className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-lg pointer-events-none"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </Card>
    </motion.div>
  );
};
