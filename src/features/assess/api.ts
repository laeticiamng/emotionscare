// @ts-nocheck
export interface AssessmentStartOptions {
  locale?: string;
  stage?: 'pre' | 'post';
}

export interface AssessmentItem {
  id: string;
  prompt: string;
  type: 'scale' | 'choice' | 'slider' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

export interface AssessmentStartResponse {
  instrument: string;
  locale: string;
  name: string;
  version: string;
  items: AssessmentItem[];
}

export async function startAssessment(
  instrument: string,
  options: AssessmentStartOptions = {},
): Promise<AssessmentStartResponse> {
  const res = await fetch('/functions/v1/assess-start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      instrument,
      locale: options.locale,
      stage: options.stage,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMessage = typeof (data as { error?: string })?.error === 'string' ? (data as { error?: string }).error : 'assess_start_failed';
    throw new Error(errorMessage);
  }

  return data as AssessmentStartResponse;
}

export async function submitAssessment(
  instrument: string,
  answers: Record<string, number>,
  ts?: string,
): Promise<{ status: 'ok'; summary: string }> {
  const res = await fetch('/functions/v1/assess-submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ instrument, answers, ts }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMessage = typeof (data as { error?: string })?.error === 'string' ? (data as { error?: string }).error : 'assess_submit_failed';
    throw new Error(errorMessage);
  }

  return data as { status: 'ok'; summary: string };
}
