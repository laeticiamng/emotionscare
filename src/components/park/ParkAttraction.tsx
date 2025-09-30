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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={() => navigate(route)}
        className={`
          relative overflow-hidden cursor-pointer h-full
          bg-gradient-to-br ${gradient}
          backdrop-blur-sm border-2 border-border/50
          hover:border-primary/50 transition-all duration-300
          group
        `}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Sparkles decoration */}
        <motion.div
          className="absolute top-4 right-4 text-primary/30 group-hover:text-primary/60"
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
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

          {/* Collection badge */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary/60" />
              <span className="font-medium">{collection}</span>
            </div>
          </div>

          {/* Hover effect indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
