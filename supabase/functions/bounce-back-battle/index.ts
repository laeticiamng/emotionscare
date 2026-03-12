// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { authorizeRole } from '../_shared/auth.ts';

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Stimuli templates for all 4 modes
const STIMULI_TEMPLATES = {
  quick: [
    { kind: 'mail', payload: { subject: 'Rappel: Réunion bientôt', sender: 'team@work.com' }, at: 10 },
    { kind: 'notif', payload: { app: 'Calendar', message: 'Événement dans 15 min' }, at: 25 },
    { kind: 'timer', payload: { label: 'Pause café', remaining: 120 }, at: 40 },
    { kind: 'mail', payload: { subject: 'Re: Question rapide', sender: 'colleague@work.com' }, at: 55 },
    { kind: 'notif', payload: { app: 'Tasks', message: '2 tâches en attente' }, at: 70 },
  ],
  standard: [
    { kind: 'mail', payload: { subject: 'URGENT: Réunion dans 5 minutes!', sender: 'manager@work.com' }, at: 15 },
    { kind: 'notif', payload: { app: 'News', message: 'Alerte: Marché en chute libre!' }, at: 35 },
    { kind: 'timer', payload: { label: 'Deadline projet', remaining: 300 }, at: 55 },
    { kind: 'mail', payload: { subject: 'Re: Où est le rapport?', sender: 'client@company.com' }, at: 80 },
    { kind: 'notif', payload: { app: 'Social', message: '15 nouvelles notifications' }, at: 100 },
    { kind: 'mail', payload: { subject: 'Erreur critique détectée!', sender: 'system@alert.com' }, at: 130 },
    { kind: 'notif', payload: { app: 'Calendar', message: 'Conflit d\'agenda détecté' }, at: 150 },
    { kind: 'timer', payload: { label: 'Appel important', remaining: 60 }, at: 170 },
  ],
  zen: [
    { kind: 'notif', payload: { app: 'Wellness', message: 'Moment de respiration' }, at: 30 },
    { kind: 'mail', payload: { subject: 'Newsletter hebdomadaire', sender: 'info@newsletter.com' }, at: 70 },
    { kind: 'timer', payload: { label: 'Pause méditation', remaining: 300 }, at: 110 },
    { kind: 'notif', payload: { app: 'Health', message: 'Objectif pas atteint' }, at: 150 },
    { kind: 'mail', payload: { subject: 'Rappel abonnement', sender: 'service@app.com' }, at: 190 },
    { kind: 'notif', payload: { app: 'Weather', message: 'Changement météo prévu' }, at: 220 },
  ],
  challenge: [
    { kind: 'mail', payload: { subject: 'CRITIQUE: Serveur en panne!', sender: 'ops@emergency.com' }, at: 10 },
    { kind: 'notif', payload: { app: 'Bank', message: 'Transaction inhabituelle détectée' }, at: 25 },
    { kind: 'timer', payload: { label: 'Présentation CEO', remaining: 180 }, at: 40 },
    { kind: 'mail', payload: { subject: 'Re: Re: Re: Besoin de votre réponse!!!', sender: 'angry@client.com' }, at: 55 },
    { kind: 'notif', payload: { app: 'Health', message: 'Fréquence cardiaque élevée' }, at: 70 },
    { kind: 'mail', payload: { subject: 'Votre vol a été annulé', sender: 'airline@travel.com' }, at: 90 },
    { kind: 'notif', payload: { app: 'Work', message: '3 personnes attendent votre réponse' }, at: 110 },
    { kind: 'timer', payload: { label: 'Deadline finale', remaining: 120 }, at: 130 },
    { kind: 'mail', payload: { subject: 'Mise à jour contrat urgente', sender: 'legal@company.com' }, at: 150 },
    { kind: 'notif', payload: { app: 'News', message: 'Breaking: Crise économique' }, at: 170 },
    { kind: 'mail', payload: { subject: 'Erreur dans votre rapport!', sender: 'qa@work.com' }, at: 190 },
    { kind: 'timer', payload: { label: 'Fin imminente', remaining: 30 }, at: 210 },
    { kind: 'notif', payload: { app: 'Security', message: 'Tentative de connexion suspecte' }, at: 240 },
    { kind: 'mail', payload: { subject: 'URGENT: Appel immédiat requis', sender: 'ceo@company.com' }, at: 270 },
    { kind: 'timer', payload: { label: 'Dernière chance', remaining: 15 }, at: 290 },
  ]
};

// Duration map for modes (in seconds)
const DURATION_MAP: Record<string, number> = {
  quick: 90,
  standard: 180,
  zen: 240,
  challenge: 300
};

// Coaching messages based on coping scores
const COACHING_MESSAGES = {
  excellent: [
    "Impressionnant ! Vous avez gardé votre calme sous la pression. 🌟",
    "Bravo ! Vos stratégies de coping sont remarquables.",
    "Excellent travail ! Vous maîtrisez l'art de la résilience."
  ],
  good: [
    "Bien joué ! Vous progressez dans la gestion du stress. 💪",
    "Bonne performance ! Quelques ajustements et vous serez au top.",
    "Vous avez bien géré cette épreuve. Continuez ainsi !"
  ],
  average: [
    "C'est un bon début ! La résilience se construit pas à pas. 🚀",
    "Vous avez tenu bon. La prochaine fois sera encore meilleure.",
    "Chaque défi est une occasion d'apprendre. Vous êtes sur la bonne voie."
  ],
  needsWork: [
    "Ce n'est pas grave ! La résilience demande de la pratique. 🌱",
    "Les difficultés font partie du chemin. Réessayez demain !",
    "Chaque tentative vous renforce. Ne lâchez rien !"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'start': {
        const { mode = 'standard' } = body;
        
        // Create battle in database
        const { data: battle, error: battleError } = await supabase
          .from('bounce_battles')
          .insert({
            user_id: user.id,
            mode,
            status: 'active',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (battleError) throw battleError;

        // Generate stimuli with unique IDs
        const stimuliTemplate = STIMULI_TEMPLATES[mode as keyof typeof STIMULI_TEMPLATES] || STIMULI_TEMPLATES.standard;
        const stimuli = stimuliTemplate.map((s, i) => ({
          ...s,
          id: `${battle.id}-stim-${i}`,
          at: s.at + (Math.random() * 10 - 5) // Add randomness
        }));

        return new Response(JSON.stringify({
          success: true,
          battle_id: battle.id,
          stimuli,
          duration: DURATION_MAP[mode] || 180
        }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      case 'event': {
        const { battle_id, event_type, ts, data = {} } = body;

        // Log event
        const { error: eventError } = await supabase
          .from('bounce_events')
          .insert({
            battle_id,
            event_type,
            timestamp: ts,
            event_data: data
          });

        if (eventError) throw eventError;

        // Update battle status if needed
        if (event_type === 'pause') {
          await supabase
            .from('bounce_battles')
            .update({ status: 'paused' })
            .eq('id', battle_id);
        } else if (event_type === 'resume') {
          await supabase
            .from('bounce_battles')
            .update({ status: 'active' })
            .eq('id', battle_id);
        } else if (event_type === 'end') {
          await supabase
            .from('bounce_battles')
            .update({ 
              status: 'completed',
              ended_at: new Date().toISOString()
            })
            .eq('id', battle_id);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      case 'debrief': {
        const { battle_id, answers, hrv } = body;

        // Save coping responses
        for (const answer of answers) {
          await supabase
            .from('bounce_coping_responses')
            .insert({
              battle_id,
              question_id: answer.id,
              response_value: answer.value + 1 // Convert 0-3 to 1-4
            });
        }

        // Calculate score
        const totalScore = answers.reduce((sum: number, a: { value: number }) => sum + a.value, 0);
        const maxScore = answers.length * 3;
        const scorePercent = (totalScore / maxScore) * 100;

        // Get coaching message
        let messageCategory: keyof typeof COACHING_MESSAGES;
        if (scorePercent >= 80) messageCategory = 'excellent';
        else if (scorePercent >= 60) messageCategory = 'good';
        else if (scorePercent >= 40) messageCategory = 'average';
        else messageCategory = 'needsWork';

        const messages = COACHING_MESSAGES[messageCategory];
        const coachMsg = messages[Math.floor(Math.random() * messages.length)];

        // Update battle with duration
        const { data: battle } = await supabase
          .from('bounce_battles')
          .select('started_at')
          .eq('id', battle_id)
          .single();

        if (battle?.started_at) {
          const duration = Math.floor((Date.now() - new Date(battle.started_at).getTime()) / 1000);
          await supabase
            .from('bounce_battles')
            .update({ 
              duration_seconds: duration,
              status: 'completed'
            })
            .eq('id', battle_id);
        }

        // Generate pair token for social feature
        const pairToken = scorePercent >= 50 ? crypto.randomUUID().slice(0, 8) : undefined;

        if (pairToken) {
          await supabase
            .from('bounce_pair_tips')
            .insert({
              battle_id,
              pair_token: pairToken
            });
        }

        return new Response(JSON.stringify({
          success: true,
          coach_msg: coachMsg,
          score: scorePercent,
          pair_token: pairToken
        }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      case 'pair': {
        const { pair_token, tip } = body;

        // Find and update pair tip
        const { data: pairTip, error: findError } = await supabase
          .from('bounce_pair_tips')
          .select('*')
          .eq('pair_token', pair_token)
          .is('tip_content', null)
          .single();

        if (findError || !pairTip) {
          // Try to find as receiver
          const { data: receiverTip, error: recvError } = await supabase
            .from('bounce_pair_tips')
            .select('*')
            .eq('pair_token', pair_token)
            .not('tip_content', 'is', null)
            .is('received_tip', null)
            .single();

          if (!recvError && receiverTip) {
            // This user receives the tip
            await supabase
              .from('bounce_pair_tips')
              .update({ received_tip: tip })
              .eq('id', receiverTip.id);

            return new Response(JSON.stringify({
              success: true,
              received_tip: receiverTip.tip_content,
              paired: true
            }), {
              headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ 
            success: false, 
            error: 'pair_not_found' 
          }), {
            status: 404,
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
          });
        }

        // This user sends the tip
        await supabase
          .from('bounce_pair_tips')
          .update({ tip_content: tip, sent_at: new Date().toISOString() })
          .eq('id', pairTip.id);

        return new Response(JSON.stringify({
          success: true,
          waiting_for_pair: true
        }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      case 'stats': {
        // Get user statistics
        const { data: battles } = await supabase
          .from('bounce_battles')
          .select('*')
          .eq('user_id', user.id);

        const total = battles?.length || 0;
        const completed = battles?.filter(b => b.status === 'completed').length || 0;
        const totalDuration = battles?.reduce((sum, b) => sum + (b.duration_seconds || 0), 0) || 0;

        // Get coping responses
        const battleIds = battles?.map(b => b.id) || [];
        const { data: copingResponses } = await supabase
          .from('bounce_coping_responses')
          .select('*')
          .in('battle_id', battleIds);

        // Calculate coping averages
        const copingAvg: Record<string, number> = {};
        const copingCounts: Record<string, number[]> = {};

        copingResponses?.forEach(resp => {
          if (!copingCounts[resp.question_id]) copingCounts[resp.question_id] = [];
          copingCounts[resp.question_id].push(resp.response_value);
        });

        Object.keys(copingCounts).forEach(key => {
          const values = copingCounts[key];
          copingAvg[key] = values.reduce((a, b) => a + b, 0) / values.length;
        });

        return new Response(JSON.stringify({
          success: true,
          stats: {
            total_battles: total,
            completed_battles: completed,
            completion_rate: total > 0 ? (completed / total * 100).toFixed(1) : 0,
            total_duration_seconds: totalDuration,
            average_duration_seconds: completed > 0 ? Math.round(totalDuration / completed) : 0,
            coping_averages: copingAvg
          }
        }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      case 'history': {
        const { limit = 10 } = body;

        const { data: battles, error } = await supabase
          .from('bounce_battles')
          .select('id, mode, status, duration_seconds, started_at, ended_at')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          battles: battles || []
        }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in bounce-back-battle function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
