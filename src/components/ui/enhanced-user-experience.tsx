import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Star, Heart, Sparkles, Zap, ArrowUp, Bookmark, Share2, AlertCircle, CheckCircle,
  Info, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Enhanced Toast System
export const useEnhancedToast = () => {
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, description?: string) => {
    const icons = {
      success: <CheckCircle className="h-4 w-4" />,
      error: <XCircle className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />
    };

    toast(message, {
      description,
      icon: icons[type],
      duration: type === 'error' ? 5000 : 3000,
      action: type === 'error' ? {
        label: 'Réessayer',
        onClick: () => {} // Retry action should be provided by caller
      } : undefined
    });
  };

  return { showToast };
};

// Floating Action Button with context menu
interface FloatingActionButtonProps {
  actions: Array<{
    icon: React.ComponentType<any>;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'secondary';
  }>;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 whitespace-nowrap shadow-lg"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-purple-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
      </Button>
    </div>
  );
};

// Enhanced Card with interactions
interface InteractiveCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onBookmark?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  isBookmarked?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  children,
  onBookmark,
  onShare,
  onLike,
  isBookmarked = false,
  isLiked = false,
  likesCount = 0,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className={cn(
        "group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onBookmark && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBookmark}
                  className={cn(
                    "hover:bg-primary/10",
                    isBookmarked && "text-primary"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                </Button>
              )}
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="hover:bg-primary/10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {children && (
          <CardContent className="relative z-10">
            {children}
          </CardContent>
        )}

        {onLike && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={cn(
                "flex items-center space-x-2 hover:bg-primary/10",
                isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-sm">{likesCount}</span>
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Progress Indicator with steps
interface ProgressStepsProps {
  steps: Array<{
    label: string;
    description?: string;
    completed: boolean;
    current?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  steps, 
  orientation = 'horizontal' 
}) => {
  return (
    <div className={cn(
      "flex",
      orientation === 'horizontal' ? "items-center space-x-4" : "flex-col space-y-4"
    )}>
      {steps.map((step, index) => (
        <div key={index} className={cn(
          "flex items-center",
          orientation === 'vertical' && "flex-col text-center"
        )}>
          <div className="relative">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300",
                step.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : step.current
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-muted-foreground/30 text-muted-foreground"
              )}
              animate={{
                scale: step.current ? 1.1 : 1,
              }}
            >
              {step.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>
            
            {step.current && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className={cn(
            "ml-3",
            orientation === 'vertical' && "ml-0 mt-2"
          )}>
            <p className={cn(
              "font-medium",
              step.current && "text-primary",
              step.completed && "text-green-600"
            )}>
              {step.label}
            </p>
            {step.description && (
              <p className="text-sm text-muted-foreground">{step.description}</p>
            )}
          </div>
          
          {index < steps.length - 1 && orientation === 'horizontal' && (
            <div className={cn(
              "flex-1 h-0.5 mx-4",
              step.completed ? "bg-green-500" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};

// Enhanced Search with suggestions
interface EnhancedSearchProps {
  placeholder?: string;
  suggestions?: string[];
  onSearch: (query: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = "Rechercher...",
  suggestions = [],
  onSearch,
  onSuggestionClick
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
    }
  }, [query, suggestions]);

  const handleSearch = () => {
    onSearch(query);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearch}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2"
        >
          <Zap className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  onSuggestionClick?.(suggestion);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Scroll to top button
export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsVisible(latest > 300);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Rating Component
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={cn(
              "transition-colors",
              !readonly && "hover:scale-110 cursor-pointer"
            )}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
          >
            <Star
              className={cn(
                sizeClasses[size],
                (hoverValue || value) >= star
                  ? "text-yellow-400 fill-current"
                  : "text-muted-foreground"
              )}
            />
          </motion.button>
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {value}/5
        </span>
      )}
    </div>
  );
};

export default {
  FloatingActionButton,
  InteractiveCard,
  ProgressSteps,
  EnhancedSearch,
  ScrollToTop,
  Rating,
  useEnhancedToast
};