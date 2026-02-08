import { useEffect } from 'react';

interface PageSEOOptions {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  twitterCard?: string;
  twitterImage?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
  includeOrganization?: boolean;
}

/**
 * Hook pour gérer le SEO d'une page
 * Ajoute automatiquement title, meta description, balises Open Graph et JSON-LD structured data
 * 
 * @example
 * usePageSEO({
 *   title: 'Dashboard Particulier',
 *   description: 'Suivez vos émotions et progressez avec EmotionsCare',
 *   keywords: 'émotions, bien-être, dashboard',
 *   structuredData: {
 *     '@context': 'https://schema.org',
 *     '@type': 'WebApplication',
 *     name: 'EmotionsCare'
 *   }
 * });
 */
export const usePageSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterImage,
  canonical,
  structuredData,
  includeOrganization = false
}: PageSEOOptions) => {
  useEffect(() => {
    // Title
    document.title = `${title} | EmotionsCare`;

    // Meta description
    if (description) {
      updateOrCreateMeta('description', description);
    }

    // Meta keywords
    if (keywords) {
      updateOrCreateMeta('keywords', keywords);
    }

    // Canonical URL
    if (canonical) {
      updateOrCreateLink('canonical', canonical);
    } else {
      // Auto-générer l'URL canonique basée sur l'URL actuelle
      const currentUrl = `${window.location.origin}${window.location.pathname}`;
      updateOrCreateLink('canonical', currentUrl);
    }

    // Open Graph
    updateOrCreateMeta('og:title', `${title} | EmotionsCare`, 'property');
    if (description) {
      updateOrCreateMeta('og:description', description, 'property');
    }
    if (ogImage) {
      updateOrCreateMeta('og:image', ogImage, 'property');
      if (ogImageAlt) {
        updateOrCreateMeta('og:image:alt', ogImageAlt, 'property');
      }
    }
    updateOrCreateMeta('og:type', ogType, 'property');
    updateOrCreateMeta('og:url', canonical || window.location.href, 'property');

    // Twitter Card
    updateOrCreateMeta('twitter:card', twitterCard);
    updateOrCreateMeta('twitter:title', `${title} | EmotionsCare`);
    if (description) {
      updateOrCreateMeta('twitter:description', description);
    }
    if (twitterImage) {
      updateOrCreateMeta('twitter:image', twitterImage);
    }

    // Structured Data (JSON-LD)
    const allStructuredData: any[] = [];

    // Ajouter Organization schema si demandé
    if (includeOrganization) {
      allStructuredData.push(getOrganizationSchema());
    }

    // Ajouter les données structurées personnalisées
    if (structuredData) {
      allStructuredData.push(structuredData);
    }

    // Ajouter BreadcrumbList automatiquement
    const breadcrumbs = generateBreadcrumbs();
    if (breadcrumbs.itemListElement.length > 1) {
      allStructuredData.push(breadcrumbs);
    }

    // Injecter tous les schémas
    if (allStructuredData.length > 0) {
      updateOrCreateStructuredData(allStructuredData);
    }
  }, [title, description, keywords, ogImage, ogImageAlt, ogType, twitterCard, twitterImage, canonical, structuredData, includeOrganization]);
};

function updateOrCreateMeta(
  name: string, 
  content: string, 
  attribute: 'name' | 'property' = 'name'
) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateOrCreateStructuredData(data: any | any[]) {
  // Supprimer tous les anciens scripts JSON-LD
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Si on a un tableau de données, créer un graphe JSON-LD
  if (Array.isArray(data)) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': data
    }, null, 2);
    document.head.appendChild(script);
  } else {
    // Sinon créer un script simple
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }
}

function updateOrCreateLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
}

/**
 * Génère le schema Organization pour EmotionsCare
 */
function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': 'https://emotionscare.com/#organization',
    name: 'EmotionsCare',
    url: 'https://emotionscare.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://emotionscare.com/logo.svg',
      width: 512,
      height: 512
    },
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@emotionscare.com',
      availableLanguage: ['fr', 'en']
    },
    description: 'Plateforme d\'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.',
    foundingDate: '2023',
    slogan: 'Transformez votre bien-être émotionnel avec l\'IA'
  };
}

/**
 * Génère automatiquement le schema BreadcrumbList basé sur l'URL
 */
function generateBreadcrumbs() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: window.location.origin
    }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name,
      item: `${window.location.origin}${currentPath}`
    });
  });

  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };
}

export default usePageSEO;
