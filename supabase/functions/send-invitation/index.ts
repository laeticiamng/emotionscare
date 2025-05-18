
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { requireAuth } from "../_shared/auth.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
// Configuration
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const appBaseUrl = Deno.env.get('APP_BASE_URL') || 'https://emotionscare.com';
// Initialize clients
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
// Generate a secure random token
const generateToken = (): string => {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
// Handle invitation request
const handleInvitation = async (req: Request) => {
  try {
    const { email, role } = await req.json();
    
    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email et rôle sont requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    // Generate a secure token
    const token = generateToken();
    // Calculate expiration date (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    // Store invitation in database
    const { data: invitation, error: dbError } = await supabase
      .from('invitations')
      .insert([
        {
          email,
          role,
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        }
      ])
      .select()
      .single();
    if (dbError) {
      console.error('Database error:', dbError);
        JSON.stringify({ error: 'Erreur lors de la création de l\'invitation' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    // Generate invitation link
    const invitationLink = `${appBaseUrl}/invite?token=${token}`;
    // Send invitation email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'EmotionsCare <no-reply@emotionscare.com>',
      to: [email],
      subject: 'Votre invitation à rejoindre EmotionsCare 🌱',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bonjour,</h2>
          
          <p>Vous êtes invité(e) à rejoindre la plateforme EmotionsCare, votre nouvel espace dédié au bien-être et à l'équilibre professionnel.</p>
          <p>Cliquez simplement sur le lien sécurisé ci-dessous pour activer votre compte et commencer à découvrir vos ressources bien-être :</p>
          <p style="margin: 30px 0;">
            <a href="${invitationLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              🟢 Activer mon compte EmotionsCare
            </a>
          </p>
          <p style="color: #666;">Ce lien expire automatiquement sous 48 heures pour garantir votre sécurité.</p>
          <p>Cordialement,<br>L'équipe EmotionsCare</p>
        </div>
      `,
    });
    if (emailError) {
      console.error('Email error:', emailError);
      // Si l'email échoue, on garde l'invitation mais on signale l'erreur
        JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email d\'invitation', invitation }),
    // Log activity anonymously
    await supabase.from('user_activity_logs').insert({
      activity_type: 'invitation_sent',
      activity_details: { 
        role: role 
      },
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation envoyée avec succès',
        // Ne pas renvoyer le token au frontend pour des raisons de sécurité
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          created_at: invitation.created_at,
          expires_at: invitation.expires_at
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
      JSON.stringify({ error: 'Erreur inattendue lors du traitement de l\'invitation' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  }
// CORS preflight handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  
  const user = await requireAuth(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  // Only allow POST for security
  if (req.method !== 'POST') {
      JSON.stringify({ error: 'Méthode non autorisée' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  return handleInvitation(req);
});
