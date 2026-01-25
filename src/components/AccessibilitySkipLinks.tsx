import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings2, ArrowRight, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SkipLink {
  href: string;
  label: string;
  exists?: boolean;
  shortcut?: string;
}

interface SkipLinkStats {
  totalUses: number;
  mostUsed: string | null;
  linkUsage: Record<string, number>;
}

const defaultSkipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Aller au contenu principal', shortcut: '1' },
  { href: '#primary-navigation', label: 'Aller à la navigation principale', shortcut: '2' },
  { href: '#global-navigation', label: 'Aller au menu global', shortcut: '3' },
  { href: '#dashboard-actions', label: 'Aller aux actions rapides', shortcut: '4' },
  { href: '#search-input', label: 'Aller à la recherche', shortcut: '5' },
  { href: '#footer', label: 'Aller au pied de page', shortcut: '6' },
];

const STORAGE_KEY = 'accessibility-skiplinks-settings';
const STATS_KEY = 'accessibility-skiplinks-stats';

const AccessibilitySkipLinks: React.FC = () => {
  const {  } = useToast();
  const [activeLinks, setActiveLinks] = useState<SkipLink[]>(defaultSkipLinks);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledLinks, setEnabledLinks] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<SkipLinkStats>({
    totalUses: 0,
    mostUsed: null,
    linkUsage: {},
  });
  const [showVisualIndicator, setShowVisualIndicator] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      setEnabledLinks(settings.enabledLinks || {});
      setShowVisualIndicator(settings.showVisualIndicator || false);
    } else {
      // Enable all by default
      const defaultEnabled = defaultSkipLinks.reduce((acc, link) => {
        acc[link.href] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setEnabledLinks(defaultEnabled);
    }

    const storedStats = localStorage.getItem(STATS_KEY);
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  // Check which elements actually exist on the page
  useEffect(() => {
    const checkElements = () => {
      const updatedLinks = defaultSkipLinks.map(link => ({
        ...link,
        exists: !!document.querySelector(link.href)
      }));
      setActiveLinks(updatedLinks.filter(link => link.exists && enabledLinks[link.href] !== false));
    };

    // Check on mount and after a short delay (for dynamic content)
    checkElements();
    const timeout = setTimeout(checkElements, 1000);
    
    // Re-check on navigation
    const observer = new MutationObserver(checkElements);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [enabledLinks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Alt+Number shortcuts
      if (!e.altKey) return;
      
      const num = parseInt(e.key);
      if (num >= 1 && num <= activeLinks.length) {
        e.preventDefault();
        const link = activeLinks[num - 1];
        if (link) {
          handleLinkClick(link);
          const element = document.querySelector(link.href);
          if (element instanceof HTMLElement) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLinks]);

  // Track link usage
  const handleLinkClick = (link: SkipLink) => {
    const newStats: SkipLinkStats = {
      totalUses: stats.totalUses + 1,
      linkUsage: {
        ...stats.linkUsage,
        [link.href]: (stats.linkUsage[link.href] || 0) + 1,
      },
      mostUsed: null,
    };

    // Find most used
    let maxUsage = 0;
    Object.entries(newStats.linkUsage).forEach(([href, count]) => {
      if (count > maxUsage) {
        maxUsage = count;
        newStats.mostUsed = href;
      }
    });

    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  // Save settings
  const saveSettings = (newEnabledLinks: Record<string, boolean>, newShowVisual: boolean) => {
    setEnabledLinks(newEnabledLinks);
    setShowVisualIndicator(newShowVisual);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enabledLinks: newEnabledLinks,
      showVisualIndicator: newShowVisual,
    }));
  };

  // Toggle link
  const toggleLink = (href: string) => {
    const newEnabled = {
      ...enabledLinks,
      [href]: !enabledLinks[href],
    };
    saveSettings(newEnabled, showVisualIndicator);
  };

  // Toggle visual indicator
  const toggleVisualIndicator = () => {
    saveSettings(enabledLinks, !showVisualIndicator);
  };

  // Get most used link name
  const getMostUsedLabel = () => {
    if (!stats.mostUsed) return null;
    const link = defaultSkipLinks.find(l => l.href === stats.mostUsed);
    return link?.label;
  };

  if (activeLinks.length === 0) return null;

  return (
    <>
      {/* Skip links navigation */}
      <nav
        aria-label="Liens d'évitement"
        className="sr-only focus-within:not-sr-only"
      >
        <ul className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
          {activeLinks.map((link, index) => (
            <li key={link.href}>
              <a
                href={link.href}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onClick={() => handleLinkClick(link)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background',
                  'transition-transform duration-200',
                  focusedIndex === index && 'scale-105'
                )}
              >
                {link.label}
                {link.shortcut && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    Alt+{link.shortcut}
                  </Badge>
                )}
                <ArrowRight className="h-4 w-4" />
              </a>
            </li>
          ))}
          
          {/* Settings button */}
          <li>
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground shadow-lg',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background',
                    'hover:bg-muted/80 transition-colors'
                  )}
                >
                  <Settings2 className="h-4 w-4" />
                  Paramètres
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium">Configuration des liens d'évitement</h4>
                  
                  {/* Visual indicator toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Indicateur visuel</span>
                    <Button
                      variant={showVisualIndicator ? 'default' : 'outline'}
                      size="sm"
                      onClick={toggleVisualIndicator}
                    >
                      {showVisualIndicator ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Links toggles */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Liens actifs</span>
                    {defaultSkipLinks.map((link) => (
                      <div
                        key={link.href}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-xs">{link.label}</span>
                        <Button
                          variant={enabledLinks[link.href] !== false ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => toggleLink(link.href)}
                        >
                          {enabledLinks[link.href] !== false ? 'Actif' : 'Inactif'}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  {stats.totalUses > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Statistiques d'utilisation
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-muted rounded p-2">
                          <div className="text-lg font-bold text-primary">{stats.totalUses}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="bg-muted rounded p-2">
                          <div className="text-xs font-medium text-primary truncate">
                            {getMostUsedLabel() || '-'}
                          </div>
                          <div className="text-xs text-muted-foreground">Plus utilisé</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keyboard shortcuts info */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Utilisez Alt+1 à Alt+6 pour accéder rapidement aux sections
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </li>
        </ul>
      </nav>

      {/* Visual indicators for skip link targets */}
      {showVisualIndicator && (
        <style>{`
          [id="main-content"]:target,
          [id="primary-navigation"]:target,
          [id="global-navigation"]:target,
          [id="dashboard-actions"]:target,
          [id="search-input"]:target,
          [id="footer"]:target {
            outline: 3px solid hsl(var(--primary));
            outline-offset: 4px;
            animation: skiplink-highlight 2s ease-out;
          }
          
          @keyframes skiplink-highlight {
            0% {
              outline-color: hsl(var(--primary));
              outline-offset: 4px;
            }
            100% {
              outline-color: transparent;
              outline-offset: 8px;
            }
          }
        `}</style>
      )}
    </>
  );
};

export default AccessibilitySkipLinks;
