/**
 * Music Tabs - Organisateur des différentes sections de l'app musicale
 * Divise l'interface en: Découverte, Playlists, Analyse, Paramètres
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Compass,
  Music,
  TrendingUp,
  Settings,
  Sparkles,
  Radio,
  Zap,
} from 'lucide-react';

interface MusicTabsProps {
  children: {
    discovery: React.ReactNode;
    playlists: React.ReactNode;
    analytics: React.ReactNode;
    settings: React.ReactNode;
  };
  defaultTab?: 'discovery' | 'playlists' | 'analytics' | 'settings';
}

const tabConfig = [
  {
    id: 'discovery',
    label: 'Découverte',
    icon: Compass,
    description: 'Explore et découvre de nouvelles musiques',
    color: 'text-blue-500',
  },
  {
    id: 'playlists',
    label: 'Playlists',
    icon: Music,
    description: 'Crée et gère tes playlists',
    color: 'text-purple-500',
  },
  {
    id: 'analytics',
    label: 'Analyse',
    icon: TrendingUp,
    description: 'Consulte tes statistiques musicales',
    color: 'text-green-500',
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configure tes préférences',
    color: 'text-amber-500',
  },
];

export const MusicTabs: React.FC<MusicTabsProps> = ({
  children,
  defaultTab = 'discovery',
}) => {
  const [activeTab, setActiveTab] = useState<keyof typeof children>(defaultTab);

  const currentConfig = tabConfig.find((tab) => tab.id === activeTab);
  const CurrentIcon = currentConfig?.icon || Compass;

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation with Enhanced Styling */}
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-6">
          {/* Tab List */}
          <TabsList className="grid w-full max-w-2xl grid-cols-4 gap-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative data-[state=active]:text-accent"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
                    <span className="hidden sm:inline text-xs">{tab.label}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Section Info Badge */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm"
          >
            <CurrentIcon className="h-4 w-4" />
            <span>{currentConfig?.description}</span>
          </motion.div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Discovery Tab */}
            <TabsContent value="discovery" className="space-y-6">
              {children.discovery}
            </TabsContent>

            {/* Playlists Tab */}
            <TabsContent value="playlists" className="space-y-6">
              {children.playlists}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {children.analytics}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {children.settings}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default MusicTabs;
