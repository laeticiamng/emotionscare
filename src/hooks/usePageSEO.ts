import { useEffect } from 'react';

interface PageSEOOptions {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
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
  structuredData
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

    // Open Graph
    updateOrCreateMeta('og:title', `${title} | EmotionsCare`, 'property');
    if (description) {
      updateOrCreateMeta('og:description', description, 'property');
    }
    if (ogImage) {
      updateOrCreateMeta('og:image', ogImage, 'property');
    }
    updateOrCreateMeta('og:type', 'website', 'property');

    // Twitter Card
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', `${title} | EmotionsCare`);
    if (description) {
      updateOrCreateMeta('twitter:description', description);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      updateOrCreateStructuredData(structuredData);
    }
  }, [title, description, keywords, ogImage, structuredData]);
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

function updateOrCreateStructuredData(data: Record<string, any>) {
  // Supprimer l'ancien script JSON-LD s'il existe
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Créer le nouveau script JSON-LD
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}

export default usePageSEO;
