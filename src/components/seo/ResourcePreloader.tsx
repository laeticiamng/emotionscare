/**
 * ResourcePreloader - Preload des ressources critiques pour optimisation Lighthouse
 */

import { useEffect } from 'react';

interface PreloadResource {
  href: string;
  as: 'image' | 'font' | 'script' | 'style';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

const CRITICAL_RESOURCES: PreloadResource[] = [
  // Fonts critiques
  {
    href: '/fonts/inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  // Images hero critiques
  {
    href: '/og-image.jpg',
    as: 'image',
  },
];

export const ResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload via JS pour navigateurs sans support link preload
    CRITICAL_RESOURCES.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;

      if (resource.type) {
        link.type = resource.type;
      }

      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }

      // Vérifier si le lien n'existe pas déjà
      const existingLink = document.querySelector(`link[href="${resource.href}"]`);
      if (!existingLink) {
        document.head.appendChild(link);
      }
    });
  }, []);

  return null;
};

/**
 * Preconnect aux domaines externes critiques
 */
export const DNSPreconnect: React.FC = () => {
  useEffect(() => {
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';

      const existingLink = document.querySelector(`link[href="${domain}"]`);
      if (!existingLink) {
        document.head.appendChild(link);
      }
    });
  }, []);

  return null;
};
