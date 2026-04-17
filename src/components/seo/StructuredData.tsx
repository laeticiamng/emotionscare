// @ts-nocheck
/**
 * StructuredData — JSON-LD centralisé (schema.org)
 *
 * Fournit :
 *   - <StructuredData> : composant React qui injecte un script application/ld+json
 *     dans <head> via react-helmet-async (SSR-friendly).
 *   - Helpers builders (Organization, WebSite, WebPage, FAQPage, BreadcrumbList).
 *
 * Règle d'or : ne jamais émettre de données trompeuses. Les builders n'utilisent
 * que des champs vérifiables (URL, nom, description, FAQ visibles à l'écran).
 */
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'https://emotionscare.com';

const SITE_NAME = 'EmotionsCare';
const ORG_LEGAL_NAME = 'EMOTIONSCARE SASU';

type JsonLdNode = Record<string, unknown>;

export interface StructuredDataProps {
  /** Une ou plusieurs entités schema.org. Sera émis dans un @graph. */
  data: JsonLdNode | JsonLdNode[];
  /** Identifiant unique pour Helmet (évite les collisions multi-instances). */
  id?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data, id = 'structured-data' }) => {
  const json = useMemo(() => {
    const graph = Array.isArray(data) ? data : [data];
    return JSON.stringify(
      { '@context': 'https://schema.org', '@graph': graph },
      null,
      2,
    );
  }, [data]);

  return (
    <Helmet>
      <script type="application/ld+json" data-id={id}>
        {json}
      </script>
    </Helmet>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
 * Builders
 * ════════════════════════════════════════════════════════════════════════════ */

export function organizationSchema(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: ORG_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    foundingDate: '2024',
    areaServed: { '@type': 'Place', name: 'France' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@emotionscare.com',
      url: `${BASE_URL}/contact`,
      availableLanguage: ['French', 'English'],
    },
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export interface WebPageOptions {
  url: string;
  name: string;
  description: string;
  inLanguage?: string;
}

export function webPageSchema({ url, name, description, inLanguage = 'fr-FR' }: WebPageOptions): JsonLdNode {
  const absoluteUrl = /^https?:\/\//.test(url) ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name,
    description,
    inLanguage,
    isPartOf: { '@id': `${BASE_URL}/#website` },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageSchema(entries: FaqEntry[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: /^https?:\/\//.test(item.url) ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export default StructuredData;
