import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  showBack?: boolean;
  backPath?: string;
  actions?: React.ReactNode;
  className?: string;
  gradient?: boolean;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'default',
  showBack = true,
  backPath,
  actions,
  className,
  gradient = true,
  icon
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 mb-8",
        gradient && "bg-gradient-to-r from-primary/10 via-primary/5 to-background",
        !gradient && "bg-background border",
        className
      )}
    >
      {/* Background decoration */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 rounded-lg bg-primary/10">
                  {icon}
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    {title}
                  </h1>
                  {badge && (
                    <Badge variant={badgeVariant} className="text-xs">
                      {badge}
                    </Badge>
                  )}
                </div>
                {subtitle && (
                  <p className="text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Heart className="h-3 w-3 mr-1" />
            Favoris
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Share2 className="h-3 w-3 mr-1" />
            Partager
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Noter
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;