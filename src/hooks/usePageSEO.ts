import { useEffect } from 'react';

const BASE_URL = 'https://emotionscare.com';
const SITE_NAME = 'EmotionsCare';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  "Première plateforme française de régulation émotionnelle pour soignants et étudiants en santé. Protocoles de 2 à 5 minutes basés sur les neurosciences.";

/** Marker attribute so the hook only removes JSON-LD it owns */
const JSONLD_MARKER = 'data-seo-hook';

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
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  includeOrganization?: boolean;
}

/**
 * Hook pour gérer le SEO d'une page.
 * - Title, meta description, OG, Twitter Card, canonical, robots.
 * - JSON-LD structuré (ne supprime que les scripts qu'il a lui-même créés).
 */
export const usePageSEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterImage,
  canonical,
  noIndex = false,
  structuredData,
  includeOrganization = false,
}: PageSEOOptions) => {
  useEffect(() => {
    // ── Title ──
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // ── Meta ──
    upsertMeta('description', description);
    if (keywords) upsertMeta('keywords', keywords);

    // ── Robots ──
    upsertMeta('robots', noIndex ? 'noindex, follow' : 'index, follow');

    // ── Canonical ──
    const canonicalUrl = canonical ?? `${BASE_URL}${window.location.pathname}`;
    upsertLink('canonical', canonicalUrl);

    // ── hreflang ──
    upsertLinkAlternate('fr', canonicalUrl);
    upsertLinkAlternate('x-default', canonicalUrl);

    // ── Open Graph ──
    upsertMeta('og:title', fullTitle, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:image', resolveUrl(ogImage), 'property');
    if (ogImageAlt) upsertMeta('og:image:alt', ogImageAlt, 'property');
    upsertMeta('og:type', ogType, 'property');
    upsertMeta('og:url', canonicalUrl, 'property');
    upsertMeta('og:locale', 'fr_FR', 'property');
    upsertMeta('og:site_name', SITE_NAME, 'property');

    // ── Twitter Card ──
    upsertMeta('twitter:card', twitterCard);
    upsertMeta('twitter:title', fullTitle);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', resolveUrl(twitterImage ?? ogImage));

    // ── JSON-LD ──
    const schemas: Record<string, unknown>[] = [];

    if (includeOrganization) schemas.push(getOrganizationSchema());

    if (structuredData) {
      if (Array.isArray(structuredData)) {
        schemas.push(...structuredData);
      } else {
        schemas.push(structuredData);
      }
    }

    // BreadcrumbList auto
    const breadcrumbs = generateBreadcrumbs();
    if (breadcrumbs.itemListElement.length > 1) schemas.push(breadcrumbs);

    if (schemas.length > 0) injectJsonLd(schemas);

    // Cleanup only hook-owned JSON-LD on unmount
    return () => {
      document.querySelectorAll(`script[${JSONLD_MARKER}]`).forEach((s) => s.remove());
    };
  }, [title, description, keywords, ogImage, ogImageAlt, ogType, twitterCard, twitterImage, canonical, noIndex, structuredData, includeOrganization]);
};

/* ── Helpers ── */

function resolveUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${BASE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertLinkAlternate(hreflang: string, href: string) {
  let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'alternate';
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(data: Record<string, unknown>[]) {
  // Remove only hook-owned scripts
  document.querySelectorAll(`script[${JSONLD_MARKER}]`).forEach((s) => s.remove());

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute(JSONLD_MARKER, 'true');
  script.textContent = JSON.stringify(
    { '@context': 'https://schema.org', '@graph': data },
    null,
    2,
  );
  document.head.appendChild(script);
}

function getOrganizationSchema(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'EMOTIONSCARE SASU',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description: DEFAULT_DESCRIPTION,
    foundingDate: '2024',
    areaServed: { '@type': 'Place', name: 'France' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@emotionscare.com',
      url: `${BASE_URL}/contact`,
      availableLanguage: ['French', 'English'],
    },
    sameAs: [],
  };
}

function generateBreadcrumbs(): { '@type': string; itemListElement: Record<string, unknown>[] } {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);

  const items: Record<string, unknown>[] = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
  ];

  let currentPath = '';
  segments.forEach((seg, i) => {
    currentPath += `/${seg}`;
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: seg.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      item: `${BASE_URL}${currentPath}`,
    });
  });

  return { '@type': 'BreadcrumbList', itemListElement: items };
}

export default usePageSEO;
