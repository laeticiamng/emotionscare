import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        default: "py-12 px-4",
        card: "p-8",
        minimal: "py-8 px-4",
        dashed: "p-8 rounded-lg border border-dashed"
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        full: "w-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon | React.ComponentType<any> | React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  illustration?: React.ReactNode;
  animated?: boolean;
}

const UnifiedEmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  illustration,
  variant,
  size,
  animated = true
}) => {
  const content = (
    <div className={cn(emptyStateVariants({ variant, size }), className)}>
      {/* Illustration ou icône */}
      <div className="mb-6">
        {illustration ? (
          illustration
        ) : (
          <div className={cn(
            "mx-auto mb-4 rounded-full flex items-center justify-center",
            variant === "minimal" ? "w-12 h-12 bg-muted" : "w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20"
          )}>
            {React.isValidElement(IconComponent) ? (
              IconComponent
            ) : typeof IconComponent === 'function' ? (
              <IconComponent className={cn(
                "text-primary",
                variant === "minimal" ? "w-6 h-6" : "w-10 h-10"
              )} />
            ) : (
              <Inbox className={cn(
                "text-primary",
                variant === "minimal" ? "w-6 h-6" : "w-10 h-10"
              )} />
            )}
          </div>
        )}
      </div>

      {/* Contenu textuel */}
      <div className="max-w-md mx-auto mb-6">
        <h3 className={cn(
          "font-semibold text-foreground mb-2",
          variant === "minimal" ? "text-lg" : "text-xl"
        )}>
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              size={variant === "minimal" ? "default" : "lg"}
              className="min-w-[140px]"
            >
              {actionLabel}
            </Button>
          )}
          
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              size={variant === "minimal" ? "default" : "lg"}
              className="min-w-[140px]"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "card") {
    const cardContent = (
      <Card className="max-w-md w-full mx-auto">
        <CardContent className="p-8">
          {content}
        </CardContent>
      </Card>
    );

    return animated ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center p-8"
      >
        {cardContent}
      </motion.div>
    ) : (
      <div className="flex items-center justify-center p-8">
        {cardContent}
      </div>
    );
  }

  return animated ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
};

export { UnifiedEmptyState, emptyStateVariants };
export type { EmptyStateProps };