import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestAnswer {
  question_id: string;
  value: number;
}

interface TestResult {
  test_type: string;
  score: number;
  severity_level: string;
  interpretation: string;
  recommendations: string[];
}

const calculatePhq9Score = (answers: TestAnswer[]): TestResult => {
  const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
  let level = 'minimal';
  let label = 'Symptômes minimaux';
  
  if (totalScore > 4 && totalScore <= 9) {
    level = 'mild';
    label = 'Dépression légère';
  } else if (totalScore > 9 && totalScore <= 14) {
    level = 'moderate';
    label = 'Dépression modérée';
  } else if (totalScore > 14 && totalScore <= 19) {
    level = 'moderately_severe';
    label = 'Dépression modérément sévère';
  } else if (totalScore > 19) {
    level = 'severe';
    label = 'Dépression sévère';
  }

  return {
    test_type: 'phq-9',
    score: totalScore,
    severity_level: level,
    interpretation: label,
    recommendations: generateRecommendations({ 'phq-9': level })
  };
};

const calculateGad7Score = (answers: TestAnswer[]): TestResult => {
  const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
  let level = 'minimal';
  let label = 'Anxiété minimale';
  
  if (totalScore > 4 && totalScore <= 9) {
    level = 'mild';
    label = 'Anxiété légère';
  } else if (totalScore > 9 && totalScore <= 14) {
    level = 'moderate';
    label = 'Anxiété modérée';
  } else if (totalScore > 14) {
    level = 'severe';
    label = 'Anxiété sévère';
  }

  return {
    test_type: 'gad-7',
    score: totalScore,
    severity_level: level,
    interpretation: label,
    recommendations: generateRecommendations({ 'gad-7': level })
  };
};

const calculateDass21Score = (answers: TestAnswer[]): TestResult => {
  const subscaleScores = { depression: 0, anxiety: 0, stress: 0 };
  
  const subscaleMap: Record<string, keyof typeof subscaleScores> = {
    'dass1': 'stress', 'dass2': 'anxiety', 'dass3': 'depression',
    'dass4': 'anxiety', 'dass5': 'depression', 'dass6': 'stress',
    'dass7': 'anxiety', 'dass8': 'stress', 'dass9': 'anxiety',
    'dass10': 'depression', 'dass11': 'stress', 'dass12': 'stress',
    'dass13': 'depression', 'dass14': 'stress', 'dass15': 'anxiety',
    'dass16': 'depression', 'dass17': 'depression', 'dass18': 'stress',
    'dass19': 'anxiety', 'dass20': 'anxiety', 'dass21': 'depression'
  };

  answers.forEach(answer => {
    const subscale = subscaleMap[answer.question_id];
    if (subscale) {
      subscaleScores[subscale] += answer.value;
    }
  });

  subscaleScores.depression *= 2;
  subscaleScores.anxiety *= 2;
  subscaleScores.stress *= 2;

  const getLevel = (score: number, type: string) => {
    if (type === 'depression') {
      if (score <= 9) return 'normal';
      if (score <= 13) return 'mild';
      if (score <= 20) return 'moderate';
      if (score <= 27) return 'severe';
      return 'extremely_severe';
    } else if (type === 'anxiety') {
      if (score <= 7) return 'normal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      if (score <= 19) return 'severe';
      return 'extremely_severe';
    } else {
      if (score <= 14) return 'normal';
      if (score <= 18) return 'mild';
      if (score <= 25) return 'moderate';
      if (score <= 33) return 'severe';
      return 'extremely_severe';
    }
  };

  const interpretations = {
    depression: getLevel(subscaleScores.depression, 'depression'),
    anxiety: getLevel(subscaleScores.anxiety, 'anxiety'),
    stress: getLevel(subscaleScores.stress, 'stress')
  };

  const totalScore = subscaleScores.depression + subscaleScores.anxiety + subscaleScores.stress;

  return {
    test_type: 'dass-21',
    score: totalScore,
    severity_level: JSON.stringify(interpretations),
    interpretation: `Dépression: ${interpretations.depression}, Anxiété: ${interpretations.anxiety}, Stress: ${interpretations.stress}`,
    recommendations: generateRecommendations(interpretations)
  };
};

const generateRecommendations = (levels: Record<string, string>): string[] => {
  const recommendations: string[] = [];
  
  Object.entries(levels).forEach(([key, level]) => {
    if (level === 'severe' || level === 'extremely_severe') {
      recommendations.push('Consulter un professionnel de santé mentale rapidement');
      recommendations.push('Envisager un suivi thérapeutique régulier');
    } else if (level === 'moderate' || level === 'moderately_severe') {
      recommendations.push('Pratiquer des techniques de relaxation quotidiennes');
      recommendations.push('Considérer une consultation avec un psychologue');
      recommendations.push('Maintenir une routine de sommeil régulière');
    } else if (level === 'mild') {
      recommendations.push('Pratiquer des exercices de respiration');
      recommendations.push('Faire de l\'exercice physique régulièrement');
      recommendations.push('Maintenir des liens sociaux');
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Continuer à prendre soin de votre bien-être mental');
    recommendations.push('Pratiquer la méditation et la pleine conscience');
  }

  return [...new Set(recommendations)];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    const action = path[path.length - 1];

    // GET /psychometric-tests/available
    if (req.method === 'GET' && action === 'available') {
      const availableTests = [
        { id: 'phq-9', name: 'PHQ-9 (Patient Health Questionnaire)', description: 'Évaluation de la dépression', question_count: 9 },
        { id: 'gad-7', name: 'GAD-7 (Generalized Anxiety Disorder)', description: 'Évaluation de l\'anxiété', question_count: 7 },
        { id: 'dass-21', name: 'DASS-21 (Depression Anxiety Stress Scales)', description: 'Évaluation de la dépression, anxiété et stress', question_count: 21 }
      ];

      return new Response(JSON.stringify(availableTests), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /psychometric-tests/test/{testType}
    if (req.method === 'GET' && path.includes('test')) {
      const testType = path[path.length - 1];
      
      // Retourner la structure du test demandé
      const tests: Record<string, any> = {
        'phq-9': {
          id: 'phq-9',
          name: 'PHQ-9',
          description: 'Évaluation de la dépression',
          questions: Array.from({ length: 9 }, (_, i) => ({
            id: `phq${i + 1}`,
            text: `Question PHQ-9 ${i + 1}`
          })),
          scale: [
            { value: 0, label: 'Jamais' },
            { value: 1, label: 'Plusieurs jours' },
            { value: 2, label: 'Plus de la moitié du temps' },
            { value: 3, label: 'Presque tous les jours' }
          ]
        },
        'gad-7': {
          id: 'gad-7',
          name: 'GAD-7',
          description: 'Évaluation de l\'anxiété',
          questions: Array.from({ length: 7 }, (_, i) => ({
            id: `gad${i + 1}`,
            text: `Question GAD-7 ${i + 1}`
          })),
          scale: [
            { value: 0, label: 'Jamais' },
            { value: 1, label: 'Plusieurs jours' },
            { value: 2, label: 'Plus de la moitié du temps' },
            { value: 3, label: 'Presque tous les jours' }
          ]
        },
        'dass-21': {
          id: 'dass-21',
          name: 'DASS-21',
          description: 'Évaluation DASS-21',
          questions: Array.from({ length: 21 }, (_, i) => ({
            id: `dass${i + 1}`,
            text: `Question DASS-21 ${i + 1}`
          })),
          scale: [
            { value: 0, label: 'Ne s\'applique pas du tout' },
            { value: 1, label: 'S\'applique un peu' },
            { value: 2, label: 'S\'applique beaucoup' },
            { value: 3, label: 'S\'applique énormément' }
          ]
        }
      };

      const test = tests[testType];
      if (!test) {
        return new Response(JSON.stringify({ error: 'Test not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(test), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /psychometric-tests/submit
    if (req.method === 'POST' && action === 'submit') {
      const { test_type, answers } = await req.json();

      if (!test_type || !answers || !Array.isArray(answers)) {
        throw new Error('Invalid request body');
      }

      let result: TestResult;
      if (test_type === 'phq-9') {
        result = calculatePhq9Score(answers);
      } else if (test_type === 'gad-7') {
        result = calculateGad7Score(answers);
      } else if (test_type === 'dass-21') {
        result = calculateDass21Score(answers);
      } else {
        throw new Error('Invalid test type');
      }

      const { data: savedResult, error: saveError } = await supabase
        .from('psychometric_test_results')
        .insert({
          user_id: user.id,
          test_type: result.test_type,
          score: result.score,
          severity_level: result.severity_level,
          interpretation: result.interpretation,
          recommendations: result.recommendations,
          answers: answers
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving test result:', saveError);
        throw saveError;
      }

      return new Response(JSON.stringify(savedResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /psychometric-tests/history
    if (req.method === 'GET' && action === 'history') {
      const { data: history, error: historyError } = await supabase
        .from('psychometric_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        throw historyError;
      }

      return new Response(JSON.stringify(history || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in psychometric-tests function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
