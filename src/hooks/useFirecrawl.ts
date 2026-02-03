/**
 * Hook pour Firecrawl Web Scraping
 * Extraction intelligente de contenu
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  scrapePage,
  crawlSite,
  searchAndScrape,
  scrapeWellnessArticle,
  searchWellnessResources,
  type ScrapeOptions,
  type CrawlOptions,
  type ScrapeResult,
  type SearchResult,
} from '@/services/firecrawl';
import { toast } from 'sonner';

interface UseFirecrawlOptions {
  onError?: (error: Error) => void;
}

export function useFirecrawl(options: UseFirecrawlOptions = {}) {
  const { onError } = options;
  
  const [lastScrapeResult, setLastScrapeResult] = useState<ScrapeResult | null>(null);
  const [lastSearchResult, setLastSearchResult] = useState<SearchResult | null>(null);

  // Mutation pour scraper une page
  const scrapeMutation = useMutation({
    mutationFn: async ({ url, scrapeOptions }: { url: string; scrapeOptions?: ScrapeOptions }) => {
      return scrapePage(url, scrapeOptions);
    },
    onSuccess: (result) => {
      setLastScrapeResult(result);
    },
    onError: (error: Error) => {
      toast.error('Erreur d\'extraction de contenu');
      onError?.(error);
    },
  });

  // Mutation pour crawler un site
  const crawlMutation = useMutation({
    mutationFn: async ({ url, crawlOptions }: { url: string; crawlOptions?: CrawlOptions }) => {
      return crawlSite(url, crawlOptions);
    },
    onError: (error: Error) => {
      toast.error('Erreur de crawl');
      onError?.(error);
    },
  });

  // Mutation pour recherche web
  const searchMutation = useMutation({
    mutationFn: async ({ query, limit }: { query: string; limit?: number }) => {
      return searchAndScrape(query, limit);
    },
    onSuccess: (result) => {
      setLastSearchResult(result);
    },
    onError: (error: Error) => {
      toast.error('Erreur de recherche web');
      onError?.(error);
    },
  });

  // Mutation pour article bien-être
  const articleMutation = useMutation({
    mutationFn: async (url: string) => {
      return scrapeWellnessArticle(url);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Mutation pour ressources bien-être
  const wellnessMutation = useMutation({
    mutationFn: async (topic: string) => {
      return searchWellnessResources(topic);
    },
    onSuccess: setLastSearchResult,
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Fonctions d'action
  const scrape = useCallback((url: string, scrapeOptions?: ScrapeOptions) => {
    scrapeMutation.mutate({ url, scrapeOptions });
  }, [scrapeMutation]);

  const crawl = useCallback((url: string, crawlOptions?: CrawlOptions) => {
    crawlMutation.mutate({ url, crawlOptions });
  }, [crawlMutation]);

  const search = useCallback((query: string, limit?: number) => {
    searchMutation.mutate({ query, limit });
  }, [searchMutation]);

  return {
    // État
    scrapeResult: lastScrapeResult,
    searchResult: lastSearchResult,
    isLoading: 
      scrapeMutation.isPending || 
      crawlMutation.isPending || 
      searchMutation.isPending ||
      articleMutation.isPending ||
      wellnessMutation.isPending,
    
    // Actions
    scrape,
    crawl,
    search,
    scrapeArticle: (url: string) => articleMutation.mutateAsync(url),
    searchWellness: (topic: string) => wellnessMutation.mutate(topic),
    
    // Data brutes
    articleData: articleMutation.data,
    crawlData: crawlMutation.data,
    
    // Reset
    clearResults: () => {
      setLastScrapeResult(null);
      setLastSearchResult(null);
    },
  };
}

/**
 * Hook pour rechercher des ressources bien-être avec cache
 */
export function useWellnessResources(topic: string, enabled = true) {
  return useQuery({
    queryKey: ['wellness-resources', topic],
    queryFn: () => searchWellnessResources(topic),
    enabled: enabled && topic.length > 3,
    staleTime: 1000 * 60 * 60, // 1 heure
    gcTime: 1000 * 60 * 60 * 24, // 24 heures
  });
}

export default useFirecrawl;
