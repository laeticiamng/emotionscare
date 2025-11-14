import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // POST /help-center-ai/feedback
    if (req.method === 'POST' && path.endsWith('/feedback')) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const body = await req.json();
      const { article_id, article_slug, rating, comment, user_id } = body;

      // Validate input
      if (!article_slug || !rating) {
        return new Response(JSON.stringify({ error: 'Missing required fields: article_slug, rating' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ error: 'Rating must be between 1 and 5' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Save feedback to database
      const { data, error } = await supabase
        .from('help_article_feedback')
        .insert({
          article_id: article_id || article_slug,
          article_slug,
          rating,
          comment: comment || null,
          user_id: user_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save feedback:', error);
        return new Response(JSON.stringify({ error: 'Failed to save feedback' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        feedback: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /help-center-ai/articles - Get all articles (for admin)
    if (path.endsWith('/articles')) {
      const allArticles = HELP_SECTIONS.flatMap(section =>
        section.articles.map(article => ({
          ...article,
          section: section.title,
          section_id: section.id,
        }))
      );

      return new Response(JSON.stringify({ articles: allArticles }), {
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
