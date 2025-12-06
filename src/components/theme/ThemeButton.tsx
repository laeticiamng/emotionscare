
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';

const ThemeButton: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if theme is set in localStorage
    let savedTheme: 'light' | 'dark' | 'system' | null = null;

    if (typeof window !== 'undefined') {
      try {
        savedTheme = window.localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      } catch (error) {
        console.warn('[ThemeButton] Failed to read theme from localStorage', error);
      }
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        applyTheme('dark');
      } else {
        setTheme('light');
        applyTheme('light');
      }
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }, []);
  
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;

    const root = safeGetDocumentRoot();

    if (newTheme === 'system') {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      safeClassRemove(root, 'light', 'dark');
      safeClassAdd(root, systemTheme);
    } else {
      safeClassRemove(root, 'light', 'dark');
      safeClassAdd(root, newTheme);
    }
  };
  
  const toggleTheme = () => {
    let newTheme: 'light' | 'dark' | 'system';
    
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }
    
    setTheme(newTheme);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('theme', newTheme);
      }
    } catch (error) {
      console.warn('[ThemeButton] Failed to persist theme', error);
    }
    applyTheme(newTheme);
    
    toast({
      title: "Thème modifié",
      description: `Le thème a été changé pour "${newTheme === 'system' ? 'Auto' : newTheme}"`,
      variant: "default",
    });
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full"
      aria-label="Changer de thème"
    >
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
      ) : theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
      )}
    </Button>
  );
};

export default ThemeButton;
