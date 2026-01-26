import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabase } from '../_shared/supa_client.ts';
import { getUserHash, json } from '../_shared/http.ts';
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user: authUser, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!authUser) {
      return json(status, { error: 'Unauthorized' });
    }

    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    getUserHash(jwt);
    
    // Get current week start (Monday)
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const weekStart = monday.toISOString().split('T')[0];
    
    // Generate mock weekly data - in production this would query real user metrics
    const generateDayData = (dayOffset: number) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayOffset);
      
      // Simulate glow score based on user activity patterns
      const baseScore = 45 + Math.random() * 50; // 45-95 range
      const score = Math.floor(baseScore);
      
      let bucket: 'low' | 'medium' | 'high';
      if (score < 50) bucket = 'low';
      else if (score < 70) bucket = 'medium';
      else bucket = 'high';
      
      const tips = {
        low: ['Écran-silk 90 s ?', 'Fais une marche de 5 min.', 'Respire 4-6-8 1 min.'],
        medium: ['Continue comme ça !', 'Peut-être une micro-pause ?', 'Écoute ton corps.'],
        high: ['Garde le rythme ✨', 'Tu rayonnes !', 'Bel équilibre !']
      };
      
      return {
        date: date.toISOString().split('T')[0],
        glow_score: score,
        glow_bucket: bucket,
        tip: tips[bucket][Math.floor(Math.random() * tips[bucket].length)]
      };
    };

    // Generate 7 days of data
    const days = Array.from({ length: 7 }, (_, i) => generateDayData(i));
    const today = days[new Date().getDay() - 1] || days[0]; // Current day or Monday

    const weeklyData = {
      week_start: weekStart,
      days,
      today
    };

    return json(200, weeklyData);

  } catch (err) {
    console.error('dashboard-weekly error', err);
    return json(500, { error: 'server_error' });
  }
});