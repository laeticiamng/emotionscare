import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SEOAuditResult {
  url: string;
  title?: string;
  description?: string;
  h1Count: number;
  h2Count: number;
  internalLinks: string[];
  externalLinks: string[];
  images: { total: number; withoutAlt: number };
  wordCount: number;
  issues: string[];
  score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Starting SEO audit for:', formattedUrl);

    // Step 1: Map the website to get all URLs
    const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        limit: 50,
        includeSubdomains: false,
      }),
    });

    const mapData = await mapResponse.json();
    console.log('Map result:', mapData);

    const urls = mapData.links || [formattedUrl];
    const auditResults: SEOAuditResult[] = [];

    // Step 2: Scrape each page for SEO analysis (limit to first 10 pages)
    const pagesToAudit = urls.slice(0, 10);
    
    for (const pageUrl of pagesToAudit) {
      try {
        console.log('Auditing page:', pageUrl);
        
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: pageUrl,
            formats: ['markdown', 'html', 'links'],
            onlyMainContent: false,
          }),
        });

        const scrapeData = await scrapeResponse.json();
        const data = scrapeData.data || scrapeData;

        if (!data) continue;

        const html = data.html || '';
        const markdown = data.markdown || '';
        const metadata = data.metadata || {};
        const links = data.links || [];

        // Analyze SEO elements
        const issues: string[] = [];
        let score = 100;

        // Title check
        const title = metadata.title || '';
        if (!title) {
          issues.push('❌ Titre manquant');
          score -= 15;
        } else if (title.length < 30) {
          issues.push('⚠️ Titre trop court (< 30 caractères)');
          score -= 5;
        } else if (title.length > 60) {
          issues.push('⚠️ Titre trop long (> 60 caractères)');
          score -= 5;
        }

        // Meta description check
        const description = metadata.description || '';
        if (!description) {
          issues.push('❌ Meta description manquante');
          score -= 15;
        } else if (description.length < 120) {
          issues.push('⚠️ Meta description trop courte (< 120 caractères)');
          score -= 5;
        } else if (description.length > 160) {
          issues.push('⚠️ Meta description trop longue (> 160 caractères)');
          score -= 5;
        }

        // H1 check
        const h1Matches = html.match(/<h1[^>]*>/gi) || [];
        const h1Count = h1Matches.length;
        if (h1Count === 0) {
          issues.push('❌ Aucun H1 trouvé');
          score -= 10;
        } else if (h1Count > 1) {
          issues.push(`⚠️ ${h1Count} H1 trouvés (recommandé: 1)`);
          score -= 5;
        }

        // H2 check
        const h2Matches = html.match(/<h2[^>]*>/gi) || [];
        const h2Count = h2Matches.length;
        if (h2Count === 0) {
          issues.push('⚠️ Aucun H2 trouvé');
          score -= 5;
        }

        // Images without alt
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const imgWithoutAlt = imgMatches.filter((img: string) => !img.includes('alt=')).length;
        if (imgWithoutAlt > 0) {
          issues.push(`⚠️ ${imgWithoutAlt} image(s) sans attribut alt`);
          score -= Math.min(imgWithoutAlt * 2, 10);
        }

        // Word count
        const wordCount = markdown.split(/\s+/).filter((w: string) => w.length > 0).length;
        if (wordCount < 300) {
          issues.push('⚠️ Contenu trop court (< 300 mots)');
          score -= 5;
        }

        // Separate internal and external links
        const baseHost = new URL(formattedUrl).host;
        const internalLinks: string[] = [];
        const externalLinks: string[] = [];
        
        for (const link of links) {
          try {
            const linkUrl = new URL(link, formattedUrl);
            if (linkUrl.host === baseHost) {
              internalLinks.push(link);
            } else {
              externalLinks.push(link);
            }
          } catch {
            // Invalid URL, skip
          }
        }

        auditResults.push({
          url: pageUrl,
          title,
          description,
          h1Count,
          h2Count,
          internalLinks,
          externalLinks,
          images: { total: imgMatches.length, withoutAlt: imgWithoutAlt },
          wordCount,
          issues,
          score: Math.max(0, score),
        });
      } catch (err) {
        console.error('Error auditing page:', pageUrl, err);
      }
    }

    // Calculate overall score
    const overallScore = auditResults.length > 0
      ? Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length)
      : 0;

    const summary = {
      totalPages: urls.length,
      auditedPages: auditResults.length,
      overallScore,
      criticalIssues: auditResults.flatMap(r => r.issues.filter(i => i.startsWith('❌'))).length,
      warnings: auditResults.flatMap(r => r.issues.filter(i => i.startsWith('⚠️'))).length,
    };

    console.log('SEO audit completed');
    return new Response(
      JSON.stringify({
        success: true,
        summary,
        pages: auditResults,
        allUrls: urls,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in SEO audit:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform SEO audit';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
