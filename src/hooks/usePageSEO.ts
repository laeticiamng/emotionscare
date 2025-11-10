import { useEffect } from 'react';

interface PageSEOOptions {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

/**
 * Hook pour gérer le SEO d'une page
 * Ajoute automatiquement title, meta description, et balises Open Graph
 * 
 * @example
 * usePageSEO({
 *   title: 'Dashboard Particulier',
 *   description: 'Suivez vos émotions et progressez avec EmotionsCare',
 *   keywords: 'émotions, bien-être, dashboard'
 * });
 */
export const usePageSEO = ({ 
  title, 
  description, 
  keywords,
  ogImage 
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
  }, [title, description, keywords, ogImage]);
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

export default usePageSEO;
