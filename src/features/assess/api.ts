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
    const errorMessage = typeof data?.error === 'string' ? data.error : 'assess_submit_failed';
    throw new Error(errorMessage);
  }

  return data as { status: 'ok'; summary: string };
}
