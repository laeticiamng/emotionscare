// @ts-nocheck
import React from 'react';

const skipLinks = [
  { href: '#main-content', label: 'Aller au contenu principal' },
  { href: '#primary-navigation', label: 'Aller à la navigation principale' },
  { href: '#global-navigation', label: 'Aller au menu global' },
  { href: '#dashboard-actions', label: 'Aller aux actions rapides' },
];

const AccessibilitySkipLinks: React.FC = () => {
  return (
    <nav
      aria-label="Liens d'évitement"
      className="sr-only focus-within:not-sr-only"
    >
      <ul className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
        {skipLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
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