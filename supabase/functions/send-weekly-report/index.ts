// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req: Request) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === "OPTIONS") {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'send-weekly-report',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Weekly report sending (admin)',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const body = await req.json();
    console.log("Report request received:", body);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Report logged successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
