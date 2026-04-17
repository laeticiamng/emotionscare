// @ts-nocheck
/**
 * Non-regression: StructuredData builders emit valid, non-misleading JSON-LD.
 */
import { describe, it, expect } from 'vitest';
import {
  organizationSchema,
  websiteSchema,
  webPageSchema,
  faqPageSchema,
  breadcrumbListSchema,
} from '@/components/seo/StructuredData';

describe('StructuredData builders', () => {
  it('Organization schema includes legal name and contact', () => {
    const org = organizationSchema() as any;
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('EMOTIONSCARE SASU');
    expect(org.url).toMatch(/^https?:\/\//);
    expect(org.contactPoint?.email).toBe('contact@emotionscare.com');
  });

  it('WebSite schema references the Organization publisher', () => {
    const site = websiteSchema() as any;
    expect(site['@type']).toBe('WebSite');
    expect(site.publisher?.['@id']).toMatch(/#organization$/);
    expect(site.inLanguage).toBe('fr-FR');
  });

  it('WebPage schema resolves absolute URL and links to the WebSite', () => {
    const page = webPageSchema({
      url: '/about',
      name: 'À propos',
      description: 'EmotionsCare est une plateforme française de régulation émotionnelle.',
    }) as any;
    expect(page['@type']).toBe('WebPage');
    expect(page.url).toMatch(/\/about$/);
    expect(page.isPartOf?.['@id']).toMatch(/#website$/);
  });

  it('FAQPage schema maps questions/answers without fabrication', () => {
    const faq = faqPageSchema([
      { question: 'C’est gratuit ?', answer: 'Oui, version d’essai gratuite.' },
    ]) as any;
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain('gratuite');
  });

  it('BreadcrumbList schema numbers items from 1', () => {
    const crumbs = breadcrumbListSchema([
      { name: 'Accueil', url: '/' },
      { name: 'À propos', url: '/about' },
    ]) as any;
    expect(crumbs['@type']).toBe('BreadcrumbList');
    expect(crumbs.itemListElement[0].position).toBe(1);
    expect(crumbs.itemListElement[1].position).toBe(2);
  });
});
