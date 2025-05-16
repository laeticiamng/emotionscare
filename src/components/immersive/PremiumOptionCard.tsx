
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PremiumOptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  buttonText: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | 
                   "ghost" | "link" | null | undefined;
  delay?: number;
  initialX?: number;
}

const PremiumOptionCard: React.FC<PremiumOptionCardProps> = ({
  title,
  description,
  icon: Icon,
  linkTo,
  buttonText,
  buttonVariant = "default",
  delay = 0,
  initialX = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: "spring",
        stiffness: 100 
      }}
      className="bg-card/80 dark:bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 flex flex-col h-full shadow-lg border border-white/10"
    >
      <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary-foreground">{title}</h3>
      
      <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
      
      <Button asChild variant={buttonVariant} className="w-full mt-auto">
        <Link to={linkTo}>
          {buttonText}
        </Link>
      </Button>
    </motion.div>
  );
};

export default PremiumOptionCard;
