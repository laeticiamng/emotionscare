import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Données fallback pour le centre d'aide
const HELP_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Commencer',
    description: 'Premiers pas avec EmotionsCare',
    icon: 'rocket',
    articles: [
      {
        id: 'welcome',
        title: 'Bienvenue sur EmotionsCare',
        content: 'Guide de démarrage rapide pour découvrir toutes les fonctionnalités de la plateforme.',
        slug: 'bienvenue',
      },
    ],
  },
  {
    id: 'features',
    title: 'Fonctionnalités',
    description: 'Découvrez toutes les fonctionnalités',
    icon: 'star',
    articles: [],
  },
  {
    id: 'account',
    title: 'Mon compte',
    description: 'Gérer votre compte et préférences',
    icon: 'user',
    articles: [],
  },
  {
    id: 'privacy',
    title: 'Confidentialité',
    description: 'Vos données et leur protection',
    icon: 'shield',
    articles: [],
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // GET /help-center-ai/sections
    if (path.endsWith('/sections')) {
      return new Response(JSON.stringify(HELP_SECTIONS), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /help-center-ai/search?q=...
    if (path.endsWith('/search')) {
      const query = url.searchParams.get('q');
      
      if (!query) {
        return new Response(JSON.stringify({ results: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Recherche simple dans les articles
      const results = HELP_SECTIONS.flatMap(section =>
        section.articles
          .filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase())
          )
          .map(article => ({
            ...article,
            section: section.title,
          }))
      );

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /help-center-ai/article/:slug
    const articleMatch = path.match(/\/article\/([^/]+)$/);
    if (articleMatch) {
      const slug = articleMatch[1];
      
      for (const section of HELP_SECTIONS) {
        const article = section.articles.find(a => a.slug === slug);
        if (article) {
          return new Response(JSON.stringify({
            ...article,
            section: section.title,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
