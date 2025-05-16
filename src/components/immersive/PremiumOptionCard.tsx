
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface PremiumOptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  buttonText: string;
  buttonVariant?: "primary" | "secondary";
  delay?: number;
  initialX?: number;
}

const PremiumOptionCard: React.FC<PremiumOptionCardProps> = ({
  title,
  description,
  icon: Icon,
  linkTo,
  buttonText,
  buttonVariant = "primary",
  delay = 1,
  initialX = 0
}) => {
  return (
    <motion.div 
      className="premium-option-card"
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="option-icon-container">
        <Icon className="h-7 w-7 text-blue-500" />
      </div>
      <h2 className="option-title">{title}</h2>
      <p className="option-description">
        {description}
      </p>
      <Link to={linkTo}>
        <Button className={`premium-button ${buttonVariant === "secondary" ? "premium-button-secondary" : ""}`}>
          {buttonText}
        </Button>
      </Link>
    </motion.div>
  );
};

export default PremiumOptionCard;
