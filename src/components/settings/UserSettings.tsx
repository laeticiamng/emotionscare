// @ts-nocheck

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ThemeSettingsTab from './ThemeSettingsTab';
import AccountSettingsTab from './AccountSettingsTab';
import NotificationsSettingsTab from './NotificationsSettingsTab';
import PrivacySettingsTab from './PrivacySettingsTab';
import { useTheme } from '@/providers/theme';
import { ThemeName } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Keyboard,
  History,
  Download,
  BarChart3,
  Clock,
  TrendingUp,
  Calendar,
  Settings2,
  Search,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsHistory {
  id: string;
  tab: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface SettingsStats {
  totalChanges: number;
  lastVisit: string;
  mostUsedTab: string;
  tabVisits: Record<string, number>;
}

const KEYBOARD_SHORTCUTS = [
  { keys: ['Alt', '1'], action: 'Thème', tab: 'theme' },
  { keys: ['Alt', '2'], action: 'Compte', tab: 'account' },
  { keys: ['Alt', '3'], action: 'Notifications', tab: 'notifications' },
  { keys: ['Alt', '4'], action: 'Confidentialité', tab: 'privacy' },
  { keys: ['Ctrl', 'S'], action: 'Sauvegarder', tab: null },
  { keys: ['Esc'], action: 'Fermer les dialogues', tab: null }
];

const TAB_CONFIG = [
  { value: 'theme', label: 'Thème', icon: Palette, color: 'text-purple-500' },
  { value: 'account', label: 'Compte', icon: User, color: 'text-blue-500' },
  { value: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500' },
  { value: 'privacy', label: 'Confidentialité', icon: Shield, color: 'text-green-500' }
];

const UserSettings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('settings_last_tab') || 'theme';
  });
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Settings history
  const [history, setHistory] = useState<SettingsHistory[]>(() => {
    const saved = localStorage.getItem('settings_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Settings stats
  const [stats, setStats] = useState<SettingsStats>(() => {
    const saved = localStorage.getItem('settings_stats');
    return saved ? JSON.parse(saved) : {
      totalChanges: 0,
      lastVisit: new Date().toISOString(),
      mostUsedTab: 'theme',
      tabVisits: { theme: 0, account: 0, notifications: 0, privacy: 0 }
    };
  });

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('settings_last_tab', activeTab);
    
    // Update stats
    setStats(prev => {
      const newTabVisits = { ...prev.tabVisits };
      newTabVisits[activeTab] = (newTabVisits[activeTab] || 0) + 1;
      
      const mostUsedTab = Object.entries(newTabVisits)
        .sort(([, a], [, b]) => b - a)[0][0];
      
      return {
        ...prev,
        lastVisit: new Date().toISOString(),
        tabVisits: newTabVisits,
        mostUsedTab
      };
    });
  }, [activeTab]);

  // Persist history and stats
  useEffect(() => {
    localStorage.setItem('settings_history', JSON.stringify(history.slice(-50)));
    localStorage.setItem('settings_stats', JSON.stringify(stats));
  }, [history, stats]);

  // Properly typed theme handler
  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    addToHistory('theme', `Thème changé vers "${newTheme}"`);
  };

  const addToHistory = useCallback((tab: string, action: string, details?: string) => {
    const entry: SettingsHistory = {
      id: Date.now().toString(),
      tab,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setHistory(prev => [...prev, entry]);
    setStats(prev => ({ ...prev, totalChanges: prev.totalChanges + 1 }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + number shortcuts
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          e.preventDefault();
          setActiveTab(TAB_CONFIG[num - 1].value);
        }
      }
      
      // Ctrl + S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        toast({
          title: "Paramètres sauvegardés",
          description: "Vos modifications ont été enregistrées automatiquement"
        });
      }
      
      // Ctrl + K for search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      
      // ? for keyboard help
      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        setShowKeyboardHelp(true);
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowKeyboardHelp(false);
        setShowHistory(false);
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  const exportSettings = () => {
    const settings = {
      theme,
      history,
      stats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Vos paramètres ont été exportés"
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTabs = searchQuery
    ? TAB_CONFIG.filter(tab => 
        tab.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TAB_CONFIG;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings2 className="h-8 w-8" />
            Paramètres utilisateur
          </h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Stats badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats.totalChanges} modifications
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total des changements effectués</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Search button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rechercher (Ctrl+K)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* History button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Historique</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Keyboard shortcuts button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKeyboardHelp(true)}
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Raccourcis clavier (?)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Export button */}
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Tab favori</span>
            </div>
            <p className="text-lg font-semibold capitalize mt-1">
              {TAB_CONFIG.find(t => t.value === stats.mostUsedTab)?.label || 'Thème'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Dernière visite</span>
            </div>
            <p className="text-lg font-semibold mt-1">
              {formatDate(stats.lastVisit)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Modifications</span>
            </div>
            <p className="text-lg font-semibold mt-1">{stats.totalChanges}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Historique</span>
            </div>
            <p className="text-lg font-semibold mt-1">{history.length} entrées</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid w-full grid-cols-4">
          {TAB_CONFIG.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="gap-2"
              >
                <Icon className={`h-4 w-4 ${activeTab === tab.value ? tab.color : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge variant="outline" className="text-[10px] px-1 py-0 hidden md:inline-flex">
                  Alt+{index + 1}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="theme" className="mt-0">
              <ThemeSettingsTab 
                currentTheme={theme}
                onThemeChange={handleThemeChange} 
              />
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <AccountSettingsTab />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <NotificationsSettingsTab />
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-0">
              <PrivacySettingsTab />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowKeyboardHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Raccourcis clavier
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowKeyboardHelp(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && <span className="text-muted-foreground">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des modifications
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune modification enregistrée
                  </p>
                ) : (
                  [...history].reverse().map((entry) => {
                    const tabConfig = TAB_CONFIG.find(t => t.value === entry.tab);
                    const Icon = tabConfig?.icon || Settings2;
                    return (
                      <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Icon className={`h-4 w-4 mt-0.5 ${tabConfig?.color || ''}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-card border rounded-lg shadow-lg w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les paramètres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-2">
                {filteredTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                      onClick={() => {
                        setActiveTab(tab.value);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                    >
                      <Icon className={`h-4 w-4 ${tab.color}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                
                {searchQuery && filteredTabs.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    Aucun résultat pour "{searchQuery}"
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSettings;
