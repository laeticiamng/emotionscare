import { initializeSentry, monitorDOMErrors } from '@/lib/sentry-config';

if (typeof window !== 'undefined') {
  initializeSentry();
  monitorDOMErrors();
}
