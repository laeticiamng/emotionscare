import * as Sentry from '@sentry/nextjs';
import type { Event, Breadcrumb } from '@sentry/types';
import { redact } from './redact';

if (!Sentry.getCurrentHub().getClient()) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    beforeSend(event: Event | null) {
      if (!event) {
        return event;
      }
      return redact(event) as Event;
    },
    beforeBreadcrumb(breadcrumb: Breadcrumb | null) {
      if (!breadcrumb) {
        return breadcrumb;
      }
      return {
        ...breadcrumb,
        data: breadcrumb.data ? (redact(breadcrumb.data) as Breadcrumb['data']) : breadcrumb.data,
      };
    },
  });
}

export { Sentry };
