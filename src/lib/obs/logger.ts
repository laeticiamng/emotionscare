import { redact } from './redact';

type LogMethod = (message: string, meta?: unknown) => void;

function safeLog(method: (...args: unknown[]) => void, message: string, meta?: unknown) {
  if (meta === undefined) {
    method.call(console, message);
    return;
  }
  method.call(console, message, redact(meta));
}

export const log: Record<'info' | 'warn' | 'error', LogMethod> = {
  info: (message, meta) => safeLog(console.info, message, meta),
  warn: (message, meta) => safeLog(console.warn, message, meta),
  error: (message, meta) => safeLog(console.error, message, meta),
};
