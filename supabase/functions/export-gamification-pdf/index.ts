// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`[export-gamification-pdf] Generating PDF for user ${user.id}`);

    // Fetch user's challenges history
    const { data: challenges, error: challengesError } = await supabaseClient
      .from('user_challenges_progress')
      .select(`
        *,
        challenge:daily_challenges(*)
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (challengesError) throw challengesError;

    // Fetch user's badges
    const { data: badges, error: badgesError } = await supabaseClient
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (badgesError) throw badgesError;

    // Fetch leaderboard position
    const { data: leaderboard, error: leaderboardError } = await supabaseClient
      .from('user_leaderboard')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (leaderboardError) console.error('Leaderboard error:', leaderboardError);

    // Calculate stats
    const completedChallenges = challenges?.filter((c: any) => c.completed) || [];
    const totalChallenges = challenges?.length || 0;
    const completionRate = totalChallenges > 0 
      ? ((completedChallenges.length / totalChallenges) * 100).toFixed(1)
      : '0.0';

    const unlockedBadges = badges?.filter((b: any) => b.unlocked) || [];

    // Generate HTML for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport Gamification - EmotionsCare</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #6366f1;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #6366f1;
              margin: 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
            }
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #6366f1;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-top: 5px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              color: #6366f1;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .badge-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
            }
            .badge {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .badge-icon {
              font-size: 40px;
              margin-bottom: 10px;
            }
            .challenge-item {
              background: #f9fafb;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 8px;
              border-left: 4px solid #6366f1;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏆 Rapport Gamification EmotionsCare</h1>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${completedChallenges.length}</div>
              <div class="stat-label">Défis complétés</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${completionRate}%</div>
              <div class="stat-label">Taux de complétion</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${unlockedBadges.length}</div>
              <div class="stat-label">Badges débloqués</div>
            </div>
          </div>

          ${leaderboard ? `
          <div class="section">
            <h2>📊 Classement</h2>
            <div class="stat-card">
              <div class="stat-value">#${leaderboard.rank || 'N/A'}</div>
              <div class="stat-label">
                Position au classement • ${leaderboard.total_badges || 0} badges totaux
              </div>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h2>🏅 Badges débloqués (${unlockedBadges.length})</h2>
            <div class="badge-grid">
              ${unlockedBadges.map((badge: any) => `
                <div class="badge">
                  <div class="badge-icon">${badge.badge_icon || '🏆'}</div>
                  <div style="font-weight: bold; font-size: 14px;">${badge.badge_name}</div>
                  <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">
                    ${new Date(badge.earned_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>✅ Défis récents (10 derniers)</h2>
            ${completedChallenges.slice(0, 10).map((challenge: any) => `
              <div class="challenge-item">
                <div style="font-weight: bold;">${challenge.challenge?.objective || 'Défi'}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                  Complété le ${new Date(challenge.completed_at).toLocaleDateString('fr-FR')} •
                  Type: ${challenge.challenge?.type || 'N/A'} •
                  Profil: ${challenge.challenge?.emotional_profile || 'N/A'}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>EmotionsCare © ${new Date().getFullYear()} • Rapport généré automatiquement</p>
            <p>Ce document contient vos données personnelles de gamification</p>
          </div>
        </body>
      </html>
    `;

    // Return HTML content as downloadable file
    // In production, you would use a PDF generation library like puppeteer
    // For now, we return HTML that can be printed as PDF
    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="emotionscare-gamification-${Date.now()}.html"`,
      },
    });

  } catch (error: any) {
    console.error('[export-gamification-pdf] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
