import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'outlined';
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const premiumVariants = {
  default: 'bg-card text-card-foreground',
  glass: 'bg-background/60 backdrop-blur-xl border-white/20',
  gradient: 'bg-gradient-to-br from-card via-card/95 to-primary/5',
  elevated: 'bg-card shadow-premium-lg',
  outlined: 'bg-card border-2 border-primary/20'
};

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(({
  className,
  variant = 'default',
  hover = true,
  glow = false,
  children,
  ...props
}, ref) => {
  return (
    <Card
      className={cn(
        'rounded-xl border transition-all duration-300',
        premiumVariants[variant],
        hover && 'hover:shadow-premium-lg hover:-translate-y-0.5',
        glow && 'hover:shadow-glow',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Card>
  );
});

PremiumCard.displayName = 'PremiumCard';

// Subcomponents with premium styling
const PremiumCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));

const PremiumCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));

const PremiumCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
));

const PremiumCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
));

const PremiumCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
));

PremiumCardHeader.displayName = 'PremiumCardHeader';
PremiumCardTitle.displayName = 'PremiumCardTitle';
PremiumCardDescription.displayName = 'PremiumCardDescription';
PremiumCardContent.displayName = 'PremiumCardContent';
PremiumCardFooter.displayName = 'PremiumCardFooter';

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
  PremiumCardFooter
};