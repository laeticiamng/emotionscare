/**
 * AnnouncementBanner - Composant de bannière d'annonce style 21st.dev
 * Pill animée, dismissable, avec support lien + icône
 */

import React, { memo, useState } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnnouncementBannerProps {
  /** Text content of the announcement */
  message: string;
  /** Optional link URL */
  href?: string;
  /** Link label (defaults to "En savoir plus") */
  linkLabel?: string;
  /** Visual variant */
  variant?: 'pill' | 'bar' | 'floating';
  /** Icon to display */
  icon?: React.ReactNode;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Storage key for persisting dismissal */
  storageKey?: string;
  /** Additional class names */
  className?: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message,
  href,
  linkLabel = 'En savoir plus',
  variant = 'pill',
  icon,
  dismissible = true,
  storageKey = 'announcement-dismissed',
  className,
}) => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {
      // Ignore storage errors
    }
  };

  if (dismissed) return null;

  const content = (
    <>
      {icon ?? <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span className="text-sm font-medium truncate">{message}</span>
      {href && (
        <span className="inline-flex items-center gap-1 text-sm font-semibold whitespace-nowrap">
          {linkLabel}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </>
  );

  if (variant === 'bar') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            'relative bg-primary text-primary-foreground',
            className
          )}
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3">
            {href ? (
              <a href={href} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                {content}
              </a>
            ) : (
              <div className="flex items-center gap-2">{content}</div>
            )}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity rounded-full"
                aria-label="Fermer l'annonce"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
            'bg-foreground text-background rounded-full px-5 py-2.5',
            'shadow-lg flex items-center gap-3',
            className
          )}
        >
          {href ? (
            <a href={href} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              {content}
            </a>
          ) : (
            <div className="flex items-center gap-2">{content}</div>
          )}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:opacity-70 transition-opacity rounded-full"
              aria-label="Fermer l'annonce"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default: pill variant (centered, rounded-full)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className={cn('flex justify-center', className)}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          {href ? (
            <a href={href} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {content}
            </a>
          ) : (
            <div className="flex items-center gap-2">{content}</div>
          )}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="p-0.5 hover:opacity-70 transition-opacity rounded-full text-muted-foreground"
              aria-label="Fermer l'annonce"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(AnnouncementBanner);
