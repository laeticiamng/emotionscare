import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
  exists?: boolean;
}

const defaultSkipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Aller au contenu principal' },
  { href: '#primary-navigation', label: 'Aller à la navigation principale' },
  { href: '#global-navigation', label: 'Aller au menu global' },
  { href: '#dashboard-actions', label: 'Aller aux actions rapides' },
];

const AccessibilitySkipLinks: React.FC = () => {
  const [activeLinks, setActiveLinks] = useState<SkipLink[]>(defaultSkipLinks);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Check which elements actually exist on the page
  useEffect(() => {
    const checkElements = () => {
      const updatedLinks = defaultSkipLinks.map(link => ({
        ...link,
        exists: !!document.querySelector(link.href)
      }));
      setActiveLinks(updatedLinks.filter(link => link.exists));
    };

    // Check on mount and after a short delay (for dynamic content)
    checkElements();
    const timeout = setTimeout(checkElements, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (activeLinks.length === 0) return null;

  return (
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
              className={cn(
                'inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background',
                'transition-transform duration-200',
                focusedIndex === index && 'scale-105'
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AccessibilitySkipLinks;
