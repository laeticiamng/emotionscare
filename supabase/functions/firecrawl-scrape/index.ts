// @ts-nocheck
/**
 * Firecrawl Web Scraping Edge Function
 * Extraction intelligente de contenu pour les ressources bien-être
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  url: string;
  formats?: ('markdown' | 'html' | 'rawHtml' | 'screenshot' | 'links')[];
  onlyMainContent?: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  waitFor?: number;
}

interface CrawlRequest {
  url: string;
  maxDepth?: number;
  maxPages?: number;
  allowedDomains?: string[];
}

interface SearchRequest {
  query: string;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    const body = await req.json();
    const { action = 'scrape' } = body;

    let apiUrl: string;
    let requestBody: Record<string, unknown>;

    switch (action) {
      case 'scrape': {
        const { url, formats, onlyMainContent, includeTags, excludeTags, waitFor }: ScrapeRequest = body;
        
        if (!url) {
          return new Response(
            JSON.stringify({ error: 'URL is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        apiUrl = 'https://api.firecrawl.dev/v1/scrape';
        requestBody = {
          url,
          formats: formats || ['markdown'],
          onlyMainContent: onlyMainContent ?? true,
          includeTags,
          excludeTags,
          waitFor,
        };
        break;
      }

      case 'crawl': {
        const { url, maxDepth, maxPages, allowedDomains }: CrawlRequest = body;
        
        if (!url) {
          return new Response(
            JSON.stringify({ error: 'URL is required for crawling' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        apiUrl = 'https://api.firecrawl.dev/v1/crawl';
        requestBody = {
          url,
          maxDepth: maxDepth || 2,
          limit: maxPages || 10,
          allowedDomains,
          scrapeOptions: {
            formats: ['markdown'],
            onlyMainContent: true,
          },
        };
        break;
      }

      case 'search': {
        const { query, limit }: SearchRequest = body;
        
        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Query is required for search' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        apiUrl = 'https://api.firecrawl.dev/v1/search';
        requestBody = {
          query,
          limit: limit || 5,
          scrapeOptions: {
            formats: ['markdown'],
            onlyMainContent: true,
          },
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: scrape, crawl, or search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error:', errorText);
      throw new Error(`Firecrawl API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        success: data.success,
        data: data.data,
        metadata: data.metadata,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Firecrawl error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
