import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pixel transparent 1x1
const TRACKING_PIXEL = Uint8Array.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
  0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00,
  0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
  0x44, 0x01, 0x00, 0x3b,
]);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const emailType = url.searchParams.get("type");

    if (email && emailType) {
      // Log l'ouverture d'email
      console.log(`📬 Email opened: ${email} - Type: ${emailType}`);

      // Stocker le tracking (table à créer si besoin)
      // await supabase.from('email_tracking').insert({
      //   email,
      //   email_type: emailType,
      //   opened_at: new Date().toISOString(),
      //   user_agent: req.headers.get('user-agent'),
      //   ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      // });
    }

    // Retourner le pixel de tracking
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("❌ Error tracking email open:", error);
    
    // Même en cas d'erreur, retourner le pixel
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
      },
    });
  }
});
