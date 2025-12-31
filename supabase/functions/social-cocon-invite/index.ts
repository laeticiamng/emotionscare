// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Invitee {
  id: string;
  type: 'member' | 'email';
  label: string;
}

interface InvitePayload {
  roomId: string;
  startsAt: string;
  reminderAt: string | null;
  deliveryChannel: 'email' | 'in-app';
  invitees: Invitee[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: InvitePayload = await req.json();
    const { roomId, startsAt, reminderAt, deliveryChannel, invitees } = payload;

    if (!roomId || !startsAt || !invitees?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: roomId, startsAt, invitees' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get room details
    const { data: room, error: roomError } = await supabaseClient
      .from('social_rooms')
      .select('id, name, topic, host_display_name')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      console.error('Room not found:', roomError);
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startsAtDate = new Date(startsAt);
    const formattedDate = startsAtDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const results: Array<{ invitee: string; status: 'sent' | 'queued' | 'skipped'; channel: string }> = [];

    for (const invitee of invitees) {
      if (deliveryChannel === 'email' && invitee.type === 'email') {
        // Queue email notification
        const { error: notifError } = await supabaseClient
          .from('notification_queue')
          .insert({
            type: 'social_cocon_invite',
            channel: 'email',
            recipient: invitee.id,
            payload: {
              roomName: room.name,
              roomTopic: room.topic,
              hostName: room.host_display_name || 'Un membre',
              startsAt: formattedDate,
              reminderAt,
              inviteLabel: invitee.label,
            },
            scheduled_for: reminderAt || new Date().toISOString(),
          });

        if (notifError) {
          console.error('Failed to queue email:', notifError);
          results.push({ invitee: invitee.id, status: 'skipped', channel: 'email' });
        } else {
          results.push({ invitee: invitee.id, status: 'queued', channel: 'email' });
        }
      } else if (deliveryChannel === 'in-app' && invitee.type === 'member') {
        // Create in-app notification
        const { error: inAppError } = await supabaseClient
          .from('notifications')
          .insert({
            user_id: invitee.id,
            type: 'social_cocon_invite',
            title: `Pause partagée dans "${room.name}"`,
            message: `${room.host_display_name || 'Quelqu\'un'} vous invite à une pause le ${formattedDate}.`,
            data: {
              roomId: room.id,
              startsAt,
              roomName: room.name,
            },
            read: false,
          });

        if (inAppError) {
          console.error('Failed to create in-app notification:', inAppError);
          results.push({ invitee: invitee.id, status: 'skipped', channel: 'in-app' });
        } else {
          results.push({ invitee: invitee.id, status: 'sent', channel: 'in-app' });
        }
      } else {
        results.push({ invitee: invitee.id, status: 'skipped', channel: deliveryChannel });
      }
    }

    // Log event
    await supabaseClient.from('social_room_events').insert({
      event_type: 'invite_sent',
      room_ref: roomId.slice(0, 8),
      role: 'system',
    });

    console.log('Invitations processed:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing invitations:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
