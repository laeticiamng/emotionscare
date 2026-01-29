import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  locale?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = "Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.",
  keywords,
  canonical,
  ogImage = '/images/vr-banner-bg.jpg',
  ogType = 'website',
  noIndex = false,
  locale = 'fr_FR'
}) => {
  const siteName = 'EmotionsCare';
  const baseUrl = 'https://emotionscare.com';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Title and description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex,follow" />}
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@EmotionsCare" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Performance optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//api.emotionscare.com" />
      
      {/* Font optimizations */}
      <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <style>
        {`
          @font-face {
            font-family: 'System';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('System'), local('SF Pro Display'), local('Segoe UI'), local('Roboto');
          }
        `}
      </style>
    </Helmet>
  );
};

export default SeoHead;