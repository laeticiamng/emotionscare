import * as Sentry from '@sentry/react';
import type { AppError } from './types';

export function captureHandledError(error: AppError, context?: Record<string, unknown>) {
  if (!Sentry.getCurrentHub().getClient()) {
    return;
  }

  Sentry.withScope(scope => {
    scope.setTag('app.error_code', error.code);
    if (error.httpStatus) {
      scope.setTag('http.status', String(error.httpStatus));
    }
    const mergedContext = {
      ...(error.context ?? {}),
      ...(context ?? {}),
    };

    const route = mergedContext.route ?? mergedContext.path ?? mergedContext.url;
    if (route) {
      scope.setTag('route', String(route));
    }

    const feature = mergedContext.feature ?? mergedContext.featureFlag ?? mergedContext.feature_flag;
    if (feature) {
      scope.setTag('feature_flag', String(feature));
    }

    if (mergedContext.userMode ?? mergedContext.user_mode) {
      scope.setTag('user_mode', String(mergedContext.userMode ?? mergedContext.user_mode));
    }

    scope.setFingerprint([error.code, error.messageKey]);
    scope.setLevel('error');

    if (Object.keys(mergedContext).length > 0) {
      scope.setContext('app.error_context', mergedContext);
    }

    if (error.cause) {
      scope.setContext('app.error_cause', { cause: error.cause });
    }

    const sentryError = new Error(error.messageKey);
    sentryError.name = `AppError:${error.code}`;
    Sentry.captureException(sentryError);
  });
}

export function addErrorBreadcrumb(message: string, data?: Record<string, unknown>) {
  if (!Sentry.getCurrentHub().getClient()) {
    return;
  }

  Sentry.addBreadcrumb({
    category: 'error',
    level: 'error',
    message,
    data,
  });
}

export function applyErrorTags(tags: Record<string, string | number | boolean | undefined>) {
  if (!Sentry.getCurrentHub().getClient()) {
    return;
  }

  Sentry.configureScope(scope => {
    Object.entries(tags).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      scope.setTag(key, String(value));
    });
  });
}
