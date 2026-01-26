// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Clock, MoreHorizontal, BellOff, Pin, Archive, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_link?: string;
  action_text?: string;
  icon?: string;
  metadata?: Record<string, any>;
  pinned?: boolean;
  snoozed_until?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onSnooze?: (minutes: number) => void;
  onPin?: () => void;
  onArchive?: () => void;
  onReply?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'system': '⚙️',
  'achievement': '🏆',
  'reminder': '⏰',
  'social': '👥',
  'wellness': '💚',
  'coach': '🤖',
  'challenge': '🎯',
  'music': '🎵',
  'journal': '📔',
  'default': '🔔'
};

const SNOOZE_OPTIONS = [
  { label: '15 min', minutes: 15 },
  { label: '1 heure', minutes: 60 },
  { label: '3 heures', minutes: 180 },
  { label: 'Demain', minutes: 1440 }
];

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onSnooze,
  onPin,
  onArchive,
  onReply
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900';
      case 'high': return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  };

  const isSnoozed = notification.snoozed_until && new Date(notification.snoozed_until) > new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className="relative"
    >
      <Card className={cn(
        "transition-all duration-200 border-l-4",
        !notification.read && "ring-1 ring-primary/20 bg-accent/5",
        notification.pinned && "border-l-amber-500",
        !notification.pinned && getPriorityColor(notification.priority).replace('bg-', 'border-l-'),
        getPriorityBgColor(notification.priority),
        isSnoozed && "opacity-60"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Indicateur de priorité */}
            <motion.div 
              className={cn(
                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                getPriorityColor(notification.priority)
              )}
              animate={notification.priority === 'urgent' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            {/* Icône de catégorie */}
            <motion.div 
              className="text-2xl flex-shrink-0"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              {getCategoryIcon(notification.category)}
            </motion.div>
            
            {/* Contenu principal */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-medium truncate",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </h4>
                    {notification.pinned && (
                      <Pin className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className={cn(
                    "text-sm text-muted-foreground mt-1",
                    !isExpanded && "line-clamp-2"
                  )}>
                    {notification.message}
                  </p>

                  {notification.message.length > 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs mt-1"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <>Réduire <ChevronUp className="h-3 w-3 ml-1" /></>
                      ) : (
                        <>Voir plus <ChevronDown className="h-3 w-3 ml-1" /></>
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Badges de statut */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="capitalize text-xs">
                    {notification.category}
                  </Badge>
                  {!notification.read && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Badge className="bg-primary/20 text-primary text-xs">
                        Nouveau
                      </Badge>
                    </motion.div>
                  )}
                  {isSnoozed && (
                    <Badge variant="secondary" className="text-xs">
                      <BellOff className="h-3 w-3 mr-1" />
                      Snooze
                    </Badge>
                  )}
                </div>
              </div>

              {/* Métadonnées étendues */}
              <AnimatePresence>
                {isExpanded && notification.metadata && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground bg-muted/50 rounded p-2"
                  >
                    {Object.entries(notification.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-0.5">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timestamp et actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </div>

                {/* Actions principales */}
                <div className="flex items-center gap-1">
                  {notification.action_link && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7"
                            onClick={() => window.open(notification.action_link, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {notification.action_text || 'Voir'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ouvrir le lien</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  <AnimatePresence>
                    {(showActions || !notification.read) && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-1"
                      >
                        {!notification.read && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-green-600 hover:text-green-700"
                                  onClick={onMarkAsRead}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Marquer comme lu</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {/* Menu d'actions supplémentaires */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {onSnooze && (
                              <>
                                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                  Rappeler plus tard
                                </DropdownMenuItem>
                                {SNOOZE_OPTIONS.map((option) => (
                                  <DropdownMenuItem
                                    key={option.minutes}
                                    onClick={() => onSnooze(option.minutes)}
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    {option.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            {onPin && (
                              <DropdownMenuItem onClick={onPin}>
                                <Pin className="h-4 w-4 mr-2" />
                                {notification.pinned ? 'Désépingler' : 'Épingler'}
                              </DropdownMenuItem>
                            )}
                            
                            {onArchive && (
                              <DropdownMenuItem onClick={onArchive}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archiver
                              </DropdownMenuItem>
                            )}
                            
                            {onReply && (
                              <DropdownMenuItem onClick={onReply}>
                                <Reply className="h-4 w-4 mr-2" />
                                Répondre
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={onDelete}
                              className="text-red-600 focus:text-red-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationItem;
