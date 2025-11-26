// @ts-nocheck
/**
 * html-to-pdf - Conversion HTML vers PDF
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "../_shared/supabase.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'html-to-pdf',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'HTML to PDF conversion',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { html, fileName, reportId } = await req.json();
    const userId = user.id; // Use authenticated user's ID

    if (!html) {
      throw new Error('HTML content is required');
    }

    console.log(`Converting HTML to PDF for report: ${reportId}`);

    // Opciones de conversión:
    // 1. Usar una API externa como html2pdf.app o PDFShift
    // 2. Usar Puppeteer/Chrome en Deno (más complejo)
    // 3. Generar PDF directamente con pdf-lib

    // Para producción, usar una API como PDFShift es más confiable
    const pdfShiftApiKey = Deno.env.get('PDFSHIFT_API_KEY');

    let pdfBuffer: Uint8Array;

    if (pdfShiftApiKey) {
      // Opción 1: Usar PDFShift API (recomendado para producción)
      console.log('Using PDFShift API for PDF conversion');

      const pdfShiftResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${pdfShiftApiKey}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: html,
          sandbox: false,
          landscape: false,
          use_print: true,
          format: 'A4',
          margin: '20px',
        }),
      });

      if (!pdfShiftResponse.ok) {
        throw new Error(`PDFShift API error: ${pdfShiftResponse.status}`);
      }

      pdfBuffer = new Uint8Array(await pdfShiftResponse.arrayBuffer());

    } else {
      // Opción 2: Generación simple con texto plano (fallback)
      // En producción, esto debería usar una librería real de PDF
      console.warn('No PDF conversion API configured, using fallback');

      // Crear un PDF básico usando pdf-lib
      // Nota: En producción, debería instalar: import { PDFDocument } from 'npm:pdf-lib@1.17.1';
      // Por ahora, guardar como HTML y retornar URL

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const htmlFileName = `${fileName || 'report'}.html`;
      const filePath = `ai_reports/${userId}/${htmlFileName}`;

      // Upload HTML
      const { error: uploadError } = await supabaseClient.storage
        .from('reports')
        .upload(filePath, new TextEncoder().encode(html), {
          contentType: 'text/html',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabaseClient.storage
        .from('reports')
        .getPublicUrl(filePath);

      return new Response(JSON.stringify({
        success: true,
        url: urlData.publicUrl,
        format: 'html',
        message: 'PDF conversion not available, HTML report generated instead'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upload PDF to Supabase Storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const pdfFileName = `${fileName || 'report'}.pdf`;
    const filePath = `ai_reports/${userId}/${pdfFileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('reports')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabaseClient.storage
      .from('reports')
      .getPublicUrl(filePath);

    console.log(`PDF generated successfully: ${urlData.publicUrl}`);

    return new Response(JSON.stringify({
      success: true,
      url: urlData.publicUrl,
      format: 'pdf',
      size: pdfBuffer.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in html-to-pdf function:', error);
    const err = error as Error;
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
