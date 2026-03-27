// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Brain,
  BookOpen,
  Wind,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'scan',
    label: 'Scanner',
    icon: Brain,
    href: '/scan',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'breathwork',
    label: 'Respiration',
    icon: Wind,
    href: '/breathwork',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: BookOpen,
    href: '/journal',
    color: 'from-green-500 to-emerald-500',
  },
];

const FloatingQuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Actions menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-56 bg-background border rounded-2xl shadow-2xl p-3 mb-2"
          >
            <div className="space-y-1">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={action.id}
                    to={action.href}
                    onClick={() => setIsOpen(false)}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        `bg-gradient-to-br ${action.color}`,
                      )}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{action.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleMenu}
          aria-label={isOpen ? "Fermer les actions rapides" : "Ouvrir les actions rapides"}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl",
            "bg-gradient-to-br from-primary to-primary/80",
            "hover:shadow-primary/25 transition-all duration-300",
            "border-2 border-background",
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingQuickActions;