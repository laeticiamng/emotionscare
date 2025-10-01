// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, Globe, Sun, ArrowLeft } from 'lucide-react';

interface SynthesisRoute {
  path: string;
  label: string;
  icon: React.ElementType;
}

const routes: SynthesisRoute[] = [
  { path: '/timeline', label: 'Timeline', icon: BarChart2 },
  { path: '/world', label: 'Monde', icon: Globe },
  { path: '/sanctuary', label: 'Sanctuaire', icon: Sun }
];

const SynthesisHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Synthèse 360°</h1>
          <p className="text-muted-foreground">
            Explorez votre parcours émotionnel sous différents angles
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2">
        {routes.map((route) => {
          const isActive = location.pathname === route.path;
          const Icon = route.icon;
          
          return (
            <Button
              key={route.path}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(route.path)}
              className={`gap-1 rounded-full px-4 ${isActive ? 'animate-pulse' : ''}`}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SynthesisHeader;
