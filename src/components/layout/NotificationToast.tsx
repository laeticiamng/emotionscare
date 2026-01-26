// @ts-nocheck

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationToast: React.FC = () => {
  // This component is mainly for rendering, the logic for displaying 
  // toasts will be handled by the useToast hook
  const { toast, toasts, dismiss } = useToast();

  // Demo function to display a toast
  const showExampleToast = () => {
    toast({
      title: "Notification",
      description: "Cette fonctionnalité sera bientôt disponible!",
      action: <ToastAction altText="Fermer">Fermer</ToastAction>,
    });
  };

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <AnimatePresence>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "mb-2 flex w-[350px] items-start gap-3 rounded-lg border p-4 shadow-lg",
              props.variant === "destructive" 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-background text-foreground"
            )}
          >
            {/* Icon based on variant */}
            <div className="flex-shrink-0">
              {props.variant === "destructive" ? (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              ) : props.variant === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Info className="h-5 w-5 text-blue-400" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              {title && <h5 className="font-medium mb-1">{title}</h5>}
              {description && <div className="text-sm">{description}</div>}
              {action && <div className="mt-2">{action}</div>}
            </div>
            
            {/* Close button */}
            <button 
              onClick={() => dismiss(id)}
              className={cn(
                "flex-shrink-0 rounded-full p-1 transition-colors",
                props.variant === "destructive"
                  ? "hover:bg-destructive-foreground/10"
                  : "hover:bg-muted"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
