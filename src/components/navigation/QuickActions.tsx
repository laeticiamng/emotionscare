// @ts-nocheck
import React, { useState } from 'react';
import { Plus, Zap, Wind, Heart, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      icon: Brain,
      label: 'Scan Express',
      description: 'État émotionnel en 30s',
      action: () => {
        window.location.href = '/app/scan';
        toast.success('Scan émotionnel lancé');
      },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'Flash Glow',
      description: 'Boost instantané',
      action: () => {
        window.location.href = '/app/flash-glow';
        toast.success('Flash Glow activé');
      },
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Wind,
      label: 'Respiration',
      description: 'Calme immédiat',
      action: () => {
        window.location.href = '/app/breathing';
        toast.success('Session respiration démarrée');
      },
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      label: 'Journal',
      description: 'Exprimer ses pensées',
      action: () => {
        window.location.href = '/app/journal';
        toast.success('Journal ouvert');
      },
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Actions Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 w-64"
            >
              <Card className="p-4 bg-card/95 backdrop-blur-sm border shadow-xl">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-center">Actions Rapides</h3>
                  
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={action.action}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {action.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Accès rapide depuis n'importe où
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleMenu}
          size="icon"
          className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Tooltip when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Actions rapides
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { QuickActions };