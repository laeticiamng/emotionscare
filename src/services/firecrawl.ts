/**
 * Firecrawl Web Scraping Service
 * Extraction intelligente de contenu bien-être
 */

import { supabase } from '@/integrations/supabase/client';

export type ScrapeFormat = 'markdown' | 'html' | 'rawHtml' | 'screenshot' | 'links';

export interface ScrapeOptions {
  formats?: ScrapeFormat[];
  onlyMainContent?: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  waitFor?: number;
}

export interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  allowedDomains?: string[];
}

export interface ScrapeResult {
  success: boolean;
  data: {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    screenshot?: string;
    links?: string[];
    metadata?: {
      title?: string;
      description?: string;
      language?: string;
      sourceURL?: string;
    };
  };
}

export interface CrawlResult {
  success: boolean;
  data: ScrapeResult['data'][];
}

export interface SearchResult {
  success: boolean;
  data: Array<{
    url: string;
    markdown?: string;
    metadata?: {
      title?: string;
      description?: string;
    };
  }>;
}

/**
 * Extrait le contenu d'une page web
 */
export async function scrapePage(
  url: string,
  options: ScrapeOptions = {}
): Promise<ScrapeResult> {
  const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
    body: {
      action: 'scrape',
      url,
      formats: options.formats || ['markdown'],
      onlyMainContent: options.onlyMainContent ?? true,
      includeTags: options.includeTags,
      excludeTags: options.excludeTags,
      waitFor: options.waitFor,
    },
  });

  if (error) {
    throw new Error(`Firecrawl Scrape error: ${error.message}`);
  }

  return data;
}

/**
 * Crawle un site web en profondeur
 */
export async function crawlSite(
  url: string,
  options: CrawlOptions = {}
): Promise<CrawlResult> {
  const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
    body: {
      action: 'crawl',
      url,
      maxDepth: options.maxDepth || 2,
      maxPages: options.maxPages || 10,
      allowedDomains: options.allowedDomains,
    },
  });

  if (error) {
    throw new Error(`Firecrawl Crawl error: ${error.message}`);
  }

  return data;
}

/**
 * Recherche et extrait du contenu web
 */
export async function searchAndScrape(
  query: string,
  limit: number = 5
): Promise<SearchResult> {
  const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
    body: {
      action: 'search',
      query,
      limit,
    },
  });

  if (error) {
    throw new Error(`Firecrawl Search error: ${error.message}`);
  }

  return data;
}

/**
 * Extrait des articles de bien-être depuis des sources fiables
 */
export async function scrapeWellnessArticle(url: string): Promise<{
  title: string;
  content: string;
  source: string;
}> {
  const result = await scrapePage(url, {
    formats: ['markdown'],
    onlyMainContent: true,
    excludeTags: ['nav', 'footer', 'aside', 'script', 'style'],
  });

  return {
    title: result.data.metadata?.title || 'Article',
    content: result.data.markdown || '',
    source: result.data.metadata?.sourceURL || url,
  };
}

/**
 * Recherche des ressources de bien-être
 */
export async function searchWellnessResources(
  topic: string
): Promise<SearchResult> {
  const query = `${topic} site:who.int OR site:has-sante.fr OR site:psychologies.com OR site:passeportsante.net`;
  return searchAndScrape(query, 5);
}

export const firecrawlService = {
  scrapePage,
  crawlSite,
  searchAndScrape,
  scrapeWellnessArticle,
  searchWellnessResources,
};
