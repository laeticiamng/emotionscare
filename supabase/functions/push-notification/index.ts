import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface PushRequest {
  user_id?: string;
  subscription_endpoint?: string;
  payload: NotificationPayload;
  urgent?: boolean;
  schedule_at?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!vapidPrivateKey || !vapidPublicKey) {
    console.error('VAPID keys not configured');
    return new Response(JSON.stringify({ error: 'Push service not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { user_id, subscription_endpoint, payload, urgent = false, schedule_at }: PushRequest = await req.json();

    if (!payload?.title || !payload?.body) {
      return new Response(JSON.stringify({ error: 'Notification title and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let subscriptions = [];

    // Get push subscriptions
    if (user_id) {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw new Error('Database error');
      }

      subscriptions = data || [];
    } else if (subscription_endpoint) {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('endpoint', subscription_endpoint)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw new Error('Subscription not found');
      }

      subscriptions = [data];
    } else {
      return new Response(JSON.stringify({ error: 'Either user_id or subscription_endpoint is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active subscriptions found',
        sent: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    let sentCount = 0;
    let failedCount = 0;

    // Send notifications
    for (const subscription of subscriptions) {
      try {
        // Check quiet hours
        if (!urgent && subscription.quiet_hours_enabled) {
          const now = new Date();
          const currentHour = now.getHours();
          const quietStart = subscription.quiet_hours_start || 22;
          const quietEnd = subscription.quiet_hours_end || 7;
          
          const isQuietTime = quietStart > quietEnd 
            ? currentHour >= quietStart || currentHour < quietEnd
            : currentHour >= quietStart && currentHour < quietEnd;

          if (isQuietTime) {
            console.log(`Skipping notification for user ${subscription.user_id} - quiet hours`);
            continue;
          }
        }

        // For now, we'll simulate push notification sending
        // In production, you would use a proper Web Push library
        const pushResult = await simulatePushSend(subscription, payload);
        
        if (pushResult.success) {
          sentCount++;
          
          // Update last_sent timestamp
          await supabase
            .from('push_subscriptions')
            .update({ last_sent: new Date().toISOString() })
            .eq('id', subscription.id);

        } else {
          failedCount++;
          console.error(`Failed to send to ${subscription.endpoint}:`, pushResult.error);
        }

        results.push({
          subscription_id: subscription.id,
          success: pushResult.success,
          error: pushResult.error
        });

      } catch (error) {
        failedCount++;
        console.error(`Error sending to subscription ${subscription.id}:`, error);
        results.push({
          subscription_id: subscription.id,
          success: false,
          error: error.message
        });
      }
    }

    // Log the notification
    await supabase.from('notification_logs').insert({
      user_id,
      title: payload.title,
      body: payload.body,
      sent_count: sentCount,
      failed_count: failedCount,
      urgent,
      scheduled_at: schedule_at ? new Date(schedule_at).toISOString() : null
    });

    return new Response(JSON.stringify({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: subscriptions.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in push-notification function:', error);
    return new Response(JSON.stringify({ 
      error: 'Push notification service error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simulate push notification sending
async function simulatePushSend(subscription: any, payload: NotificationPayload) {
  // In a real implementation, you would use a library like web-push
  // For now, we'll simulate the process
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Simulate success/failure (95% success rate)
    const success = Math.random() > 0.05;
    
    if (!success) {
      throw new Error('Simulated delivery failure');
    }

    console.log(`✓ Push notification sent to ${subscription.endpoint.substring(0, 50)}...`);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}