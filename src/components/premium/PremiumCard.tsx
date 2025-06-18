
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PremiumCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  onClick?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
        onClick={onClick}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-muted-foreground group-hover:text-foreground transition-colors">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-purple-600 font-medium">Découvrir</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-600"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PremiumCard;
