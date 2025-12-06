import { toast } from 'sonner';
import i18n from '@/lib/i18n';
import type { AppError } from '@/lib/errors/types';

let lastToastKey: string | null = null;
let lastToastAt = 0;

const DEDUPE_WINDOW_MS = 3000;

export function toastError(error: AppError) {
  const key = `${error.code}:${error.messageKey}`;
  const now = Date.now();

  if (lastToastKey === key && now - lastToastAt < DEDUPE_WINDOW_MS) {
    return;
  }

  lastToastKey = key;
  lastToastAt = now;

  const title = i18n.t(error.messageKey);
  const description = resolveDescription(error);

  toast(title, {
    description,
    duration: 4000,
  });
}

function resolveDescription(error: AppError): string | undefined {
  if (error.code === 'RATE_LIMIT') {
    return i18n.t('tryAgain', { ns: 'errors' });
  }

  if (error.code === 'SERVER' || error.code === 'NETWORK' || error.code === 'TIMEOUT') {
    return i18n.t('tryAgain', { ns: 'errors' });
  }

  return undefined;
}
