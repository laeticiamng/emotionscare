
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { requireAuth } from '../_shared/auth.ts';
// Constants and helpers
const EMOTION_POINTS: Record<string, number> = {
  'happy': 10,
  'joy': 10,
  'calm': 8,
  'relaxed': 8,
  'sad': 5,
  'angry': 5,
  'anxious': 5,
  'neutral': 3
};
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  const user = await requireAuth(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  
  try {
    const { emotion, user_id } = await req.json();
    
    if (!emotion || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    // Get base emotion name for scoring
    const baseEmotion = emotion.toLowerCase().split(' ')[0];
    // Calculate points for this emotion
    const basePoints = EMOTION_POINTS[baseEmotion] || 5;
    // Calculate streak
    const { data: emotionData } = await supabase
      .from('emotions')
      .select('date')
      .eq('user_id', user_id)
      .order('date', { ascending: false });
      
    let streakDays = calculateStreak(emotionData || []);
    let streakPoints = 0;
    // Check if this is the first entry of today
    const isFirstToday = isFirstEntryToday(emotionData || []);
    // Only award streak points for the first entry of the day
    if (isFirstToday) {
      streakPoints = Math.min(streakDays * 2, 50); // Cap streak points at 50
    // Check for streak milestones and award badges if needed
    const earnedBadges: string[] = [];
      for (const milestone of STREAK_MILESTONES) {
        if (streakDays === milestone) {
          // Check if badge already exists
          const { data: existingBadge } = await supabase
            .from('badges')
            .select('id')
            .eq('user_id', user_id)
            .eq('name', `Série de ${milestone} jours`)
            .single();
            
          if (!existingBadge) {
            // Create new badge
            await supabase
              .from('badges')
              .insert({
                user_id,
                name: `Série de ${milestone} jours`,
                description: `Scanner vos émotions pendant ${milestone} jours consécutifs`,
                image_url: `/badges/streak-${milestone}.png`,
              });
              
            earnedBadges.push(`Série de ${milestone} jours`);
          }
        }
      }
    // Check for emotion diversity badges
    const { data: distinctEmotions } = await supabase
      .select('emojis')
      .not('emojis', 'is', null);
    const uniqueEmotions = new Set((distinctEmotions || []).map(d => d.emojis));
    const diversityMilestones = [5, 10, 15];
    for (const milestone of diversityMilestones) {
      if (uniqueEmotions.size === milestone) {
        // Check if badge already exists
        const { data: existingBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', user_id)
          .eq('name', `${milestone} émotions explorées`)
          .single();
          
        if (!existingBadge) {
          // Create new badge
          await supabase
            .insert({
              user_id,
              name: `${milestone} émotions explorées`,
              description: `Vous avez exploré ${milestone} émotions différentes`,
              image_url: `/badges/diversity-${milestone}.png`,
            });
          earnedBadges.push(`${milestone} émotions explorées`);
    // Get total scan count
    const { count } = await supabase
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);
    // Check for scan count badges
    const countMilestones = [1, 10, 25, 50, 100, 250, 500, 1000];
    for (const milestone of countMilestones) {
      if (count === milestone) {
          .eq('name', `${milestone} scans émotionnels`)
              name: `${milestone} scans émotionnels`,
              description: `Vous avez complété ${milestone} scans émotionnels`,
              image_url: `/badges/scan-${milestone}.png`,
          earnedBadges.push(`${milestone} scans émotionnels`);
    const totalPointsEarned = basePoints + streakPoints;
    return new Response(
      JSON.stringify({
        success: true,
        points_earned: totalPointsEarned,
        streak_days: streakDays,
        earned_badges: earnedBadges
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing emotion gamification:', error);
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
});
// Calculate consecutive days streak
function calculateStreak(emotions: any[]): number {
  if (emotions.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streakDays = 0;
  let currentDate = new Date(today);
  // Check for consecutive days with entries
  while (true) {
    // Format the date as yyyy-MM-dd to match with dates in the database
    const dateString = currentDate.toISOString().split('T')[0];
    // Find if there's an entry for this date
    const hasEntryForDate = emotions.some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toISOString().split('T')[0] === dateString;
    if (hasEntryForDate) {
      streakDays++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
  return streakDays;
}
// Check if this is the first entry of today
function isFirstEntryToday(emotions: any[]): boolean {
  if (emotions.length === 0) return true;
  const today = new Date().toISOString().split('T')[0];
  // Count entries from today
  const todayEntries = emotions.filter(entry => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0];
    return entryDate === today;
  });
  return todayEntries.length === 0;
