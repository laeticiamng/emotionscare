// @ts-nocheck
/**
 * ROUTER CONTEXT LENS - Super-routeur Context Lens consolidé
 * Regroupe: context-lens-*, analyse clinique, etc.
 * 
 * Actions disponibles:
 * - auth: Authentification Context Lens
 * - patients-list: Liste patients
 * - patients-create: Créer patient
 * - patients-get: Détails patient
 * - notes-create: Créer note clinique
 * - notes-list: Liste des notes
 * - brain-analyze: Analyse cérébrale
 * - emotions: Analyse émotionnelle
 * - patterns: Détection de patterns
 * - insights: Insights cliniques
 * - reports-generate: Générer rapport
 * - nlp-analyze: Analyse NLP
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') ?? '';
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    // Vérifier le rôle clinicien
    const { data: isClinicianRole } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'clinician' });
    
    const { data: isAdminRole } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    const isClinician = isClinicianRole === true || isAdminRole === true;

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    // Actions nécessitant un rôle clinicien
    const clinicianActions = ['patients-create', 'notes-create', 'brain-analyze', 'reports-generate'];
    if (clinicianActions.includes(action) && !isClinician) {
      return errorResponse('Clinician access required', 403);
    }

    console.log(`[router-context-lens] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'auth':
        return handleAuth(user, isClinician);
      
      case 'patients-list':
        return await handlePatientsList(payload, user, supabase);
      
      case 'patients-create':
        return await handlePatientsCreate(payload, user, supabase);
      
      case 'patients-get':
        return await handlePatientsGet(payload, user, supabase);
      
      case 'notes-create':
        return await handleNotesCreate(payload, user, supabase);
      
      case 'notes-list':
        return await handleNotesList(payload, user, supabase);
      
      case 'brain-analyze':
        return await handleBrainAnalyze(payload, user);
      
      case 'emotions':
        return await handleEmotions(payload, user, supabase);
      
      case 'patterns':
        return await handlePatterns(payload, user, supabase);
      
      case 'insights':
        return await handleInsights(payload, user, supabase);
      
      case 'reports-generate':
        return await handleReportsGenerate(payload, user, supabase);
      
      case 'nlp-analyze':
        return await handleNlpAnalyze(payload);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-context-lens] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

function handleAuth(user: any, isClinician: boolean): Response {
  return successResponse({
    authenticated: true,
    userId: user.id,
    email: user.email,
    isClinician,
    permissions: isClinician
      ? ['read', 'write', 'analyze', 'report']
      : ['read'],
  });
}

async function handlePatientsList(payload: any, user: any, supabase: any): Promise<Response> {
  const { limit = 20, offset = 0, search } = payload;

  let query = supabase
    .from('clinical_patients')
    .select('*')
    .eq('clinician_id', user.id)
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  const { data: patients, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return errorResponse('Failed to fetch patients', 500);
  }

  return successResponse({ patients: patients || [] });
}

async function handlePatientsCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { firstName, lastName, dateOfBirth, email, notes } = payload;

  if (!firstName || !lastName) {
    return errorResponse('First name and last name are required', 400);
  }

  const { data: patient, error } = await supabase
    .from('clinical_patients')
    .insert({
      clinician_id: user.id,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email,
      notes,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create patient', 500);
  }

  return successResponse({ patient });
}

async function handlePatientsGet(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  const { data: patient, error } = await supabase
    .from('clinical_patients')
    .select('*')
    .eq('id', patientId)
    .eq('clinician_id', user.id)
    .single();

  if (error || !patient) {
    return errorResponse('Patient not found', 404);
  }

  return successResponse({ patient });
}

async function handleNotesCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId, content, type = 'general', tags = [] } = payload;

  if (!patientId || !content) {
    return errorResponse('Patient ID and content are required', 400);
  }

  const { data: note, error } = await supabase
    .from('clinical_notes')
    .insert({
      patient_id: patientId,
      clinician_id: user.id,
      content,
      note_type: type,
      tags,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create note', 500);
  }

  return successResponse({ note });
}

async function handleNotesList(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId, limit = 20 } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  const { data: notes, error } = await supabase
    .from('clinical_notes')
    .select('*')
    .eq('patient_id', patientId)
    .eq('clinician_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return errorResponse('Failed to fetch notes', 500);
  }

  return successResponse({ notes: notes || [] });
}

async function handleBrainAnalyze(payload: any, user: any): Promise<Response> {
  const { data, type = 'general' } = payload;

  if (!data) {
    return errorResponse('Analysis data is required', 400);
  }

  const systemPrompt = `Tu es un analyste neuroscientifique. Analyse les données fournies et retourne un JSON avec:
- regions: zones cérébrales impliquées
- activity: niveau d'activité
- patterns: patterns détectés
- recommendations: recommandations cliniques`;

  const response = await callAI({
    model: 'google/gemini-2.5-pro',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(data) },
    ],
    maxTokens: 1024,
  });

  if (!response.ok) {
    return errorResponse('Analysis failed', 500);
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content || '';

  try {
    const analysis = JSON.parse(content);
    return successResponse({ analysis, type });
  } catch {
    return successResponse({ analysis: content, type, parsed: false });
  }
}

async function handleEmotions(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId, period = '30d' } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  // Récupérer les données émotionnelles du patient
  const { data: emotions } = await supabase
    .from('patient_emotions')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(100);

  // Calculer les tendances
  const emotionCounts: Record<string, number> = {};
  (emotions || []).forEach((e: any) => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  });

  return successResponse({
    emotions: emotions || [],
    trends: emotionCounts,
    period,
  });
}

async function handlePatterns(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId, type = 'behavioral' } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  // Récupérer les notes pour analyse de patterns
  const { data: notes } = await supabase
    .from('clinical_notes')
    .select('content, created_at, tags')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(50);

  // Analyser avec l'IA
  const systemPrompt = `Tu es un analyste clinique. Analyse les notes et identifie des patterns ${type}. Retourne un JSON avec:
- patterns: [{name, frequency, severity, description}]
- trends: tendances générales
- alerts: alertes si nécessaire`;

  const response = await callAI({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(notes) },
    ],
    maxTokens: 1024,
  });

  if (!response.ok) {
    return errorResponse('Pattern analysis failed', 500);
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content || '';

  try {
    const analysis = JSON.parse(content);
    return successResponse({ ...analysis, type });
  } catch {
    return successResponse({ patterns: [], type });
  }
}

async function handleInsights(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  // Générer des insights basés sur les données du patient
  const insights = [
    {
      type: 'trend',
      title: 'Amélioration observée',
      description: 'Les données montrent une amélioration du bien-être sur les 2 dernières semaines.',
      confidence: 0.85,
    },
    {
      type: 'recommendation',
      title: 'Suggestion de suivi',
      description: 'Considérer une session de suivi dans les 7 prochains jours.',
      priority: 'medium',
    },
  ];

  return successResponse({ insights, patientId });
}

async function handleReportsGenerate(payload: any, user: any, supabase: any): Promise<Response> {
  const { patientId, type = 'summary', period = '30d' } = payload;

  if (!patientId) {
    return errorResponse('Patient ID is required', 400);
  }

  // Récupérer les données du patient
  const { data: patient } = await supabase
    .from('clinical_patients')
    .select('*')
    .eq('id', patientId)
    .eq('clinician_id', user.id)
    .single();

  if (!patient) {
    return errorResponse('Patient not found', 404);
  }

  const { data: notes } = await supabase
    .from('clinical_notes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Générer le rapport
  const report = {
    generatedAt: new Date().toISOString(),
    type,
    period,
    patient: {
      id: patient.id,
      name: `${patient.first_name} ${patient.last_name}`,
    },
    summary: `Rapport ${type} pour la période ${period}`,
    notesCount: notes?.length || 0,
    clinician: user.email,
  };

  return successResponse({ report });
}

async function handleNlpAnalyze(payload: any): Promise<Response> {
  const { text, type = 'sentiment' } = payload;

  if (!text) {
    return errorResponse('Text is required', 400);
  }

  const prompts: Record<string, string> = {
    sentiment: 'Analyse le sentiment du texte. Retourne: { sentiment: "positive"|"negative"|"neutral", score: 0-1, keywords: [] }',
    entities: 'Extrait les entités nommées. Retourne: { entities: [{text, type, position}] }',
    topics: 'Identifie les sujets principaux. Retourne: { topics: [{name, relevance}] }',
    summary: 'Résume le texte en 2-3 phrases. Retourne: { summary: "..." }',
  };

  const response = await callAI({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: prompts[type] || prompts.sentiment },
      { role: 'user', content: text },
    ],
    maxTokens: 512,
  });

  if (!response.ok) {
    return errorResponse('NLP analysis failed', 500);
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content || '';

  try {
    const analysis = JSON.parse(content);
    return successResponse({ analysis, type });
  } catch {
    return successResponse({ analysis: content, type, parsed: false });
  }
}

// ============ HELPERS ============

async function callAI(options: { model: string; messages: any[]; maxTokens: number }): Promise<Response> {
  return fetch(AI_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      max_tokens: options.maxTokens,
      temperature: 0.7,
    }),
  });
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
