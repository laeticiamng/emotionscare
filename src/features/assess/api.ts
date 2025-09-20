import type { InstrumentCatalog, InstrumentCode, LocaleCode } from '@/lib/assess/types';

export async function startAssessment(
  instrument: InstrumentCode,
  locale: LocaleCode = 'fr',
  fetchImpl: typeof fetch = fetch,
): Promise<InstrumentCatalog> {
  const response = await fetchImpl('/functions/v1/assess-start', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ instrument, locale }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const reason = typeof data?.error === 'string' ? data.error : 'assess_start_failed';
    throw new Error(reason);
  }

  return response.json() as Promise<InstrumentCatalog>;
}
