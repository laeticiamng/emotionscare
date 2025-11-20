import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html, fileName, reportId, userId } = await req.json();

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
