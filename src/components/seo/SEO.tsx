/**
 * Composant SEO réutilisable pour optimiser le référencement
 * Utilise react-helmet-async pour gérer les méta tags dynamiquement
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'EmotionsCare',
  description = 'Plateforme de bien-être émotionnel avec IA - Scan émotionnel, musique adaptative, coach IA et plus',
  image = '/og-image.jpg',
  url = 'https://emotionscare.app',
  type = 'website',
  keywords = ['bien-être', 'émotions', 'IA', 'santé mentale', 'musique thérapeutique'],
  author = 'EmotionsCare',
  publishedTime,
  modifiedTime,
}) => {
  const fullTitle = title === 'EmotionsCare' ? title : `${title} | EmotionsCare`;
  const fullUrl = url.startsWith('http') ? url : `https://emotionscare.app${url}`;
  const fullImage = image.startsWith('http') ? image : `https://emotionscare.app${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="EmotionsCare" />
      <meta property="og:locale" content="fr_FR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="EmotionsCare" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: fullTitle,
          description: description,
          url: fullUrl,
          image: fullImage,
          author: {
            '@type': 'Organization',
            name: author,
          },
          ...(publishedTime && { datePublished: publishedTime }),
          ...(modifiedTime && { dateModified: modifiedTime }),
        })}
      </script>
    </Helmet>
  );
};
