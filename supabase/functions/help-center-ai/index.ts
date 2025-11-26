// @ts-nocheck
/**
 * help-center-ai - Centre d'aide avec recherche IA
 *
 * 🔒 SÉCURISÉ: Public (read) / Auth (feedback) + Rate limit IP 30/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  // IP-based rate limiting for public help center
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   req.headers.get('cf-connecting-ip') ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'help-center-ai',
    userId: `ip:${clientIP}`,
    limit: 30,
    windowMs: 60_000,
    description: 'Help center access - IP based',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
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

    // POST /help-center-ai/feedback (requires authentication)
    if (req.method === 'POST' && path.endsWith('/feedback')) {
      // Authenticate user for feedback submission
      const { user: authUser, error: authError } = await authenticateRequest(req);
      if (authError || !authUser) {
        return new Response(JSON.stringify({ error: 'Authentication required for feedback' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const body = await req.json();
      const { article_id, article_slug, rating, comment } = body;
      const user_id = authUser.id; // Use authenticated user's ID

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
