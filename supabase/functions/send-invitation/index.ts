// @ts-nocheck

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { sendEmail, generateInvitationEmail } from '../_shared/email-service.ts';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérification de l'autorisation (seuls les admins peuvent envoyer des invitations)
    const authResult = await authorizeRole(req, ['b2b_admin', 'admin']);
    if (authResult.status !== 200) {
      await logUnauthorizedAccess(req, authResult.error || 'Authorization failed');
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    // Rate limiting plus strict pour les invitations
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'send-invitation',
      userId: authResult.user.id,
      limit: 5,
      windowMs: 300_000,
      description: 'send-invitation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: 'Limite d’invitations atteinte. Veuillez patienter.',
      });
    }

    const { email, role, organizationId } = await req.json();
    
    // Validation des données
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!role || !['b2b_user', 'b2b_admin'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Rôle invalide' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier si l'email n'est pas déjà invité
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('id')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return new Response(
        JSON.stringify({ error: 'Une invitation est déjà en cours pour cet email' }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Créer l'invitation
    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert({
        email,
        role,
        organization_id: organizationId,
        invited_by: authResult.user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création invitation:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'invitation' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Récupérer les informations de l'organisation et de l'inviteur
    const { data: organization } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    const { data: inviter } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', authResult.user.id)
      .single();

    // Générer l'URL d'invitation
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://app.emotionscare.com';
    const inviteUrl = `${frontendUrl}/accept-invitation/${invitation.id}`;

    // Générer et envoyer l'email d'invitation
    const emailContent = generateInvitationEmail({
      inviterName: inviter?.full_name || inviter?.email,
      organizationName: organization?.name || 'EmotionsCare',
      role: role === 'b2b_admin' ? 'Administrateur' : 'Utilisateur',
      inviteUrl,
      expiresAt: invitation.expires_at
    });

    const emailResult = await sendEmail({
      to: email,
      subject: `✉️ Invitation à rejoindre ${organization?.name || 'une équipe'} sur EmotionsCare`,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      console.error(`Failed to send invitation email to ${email}:`, emailResult.error);
      // Marquer l'invitation comme failed
      await supabase
        .from('invitations')
        .update({ status: 'failed', error_message: emailResult.error })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({
          error: 'Invitation créée mais l\'email n\'a pas pu être envoyé. Veuillez contacter le support.',
          invitationId: invitation.id
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`Invitation créée et email envoyé pour ${email} avec le rôle ${role}`);

    return new Response(
      JSON.stringify({
        message: 'Invitation envoyée avec succès',
        invitationId: invitation.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans send-invitation:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'invitation' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
