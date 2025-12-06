// @ts-nocheck
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRouteAllowed } from './guards';
import type { Guard } from './types';
import { routes } from '@/lib/routes';

export function withGuard<T>(
  Component: React.ComponentType<T>,
  guards?: Guard[],
  redirect: string = routes.auth.login(),
) {
  function GuardedComponent(props: T) {
    const { allowed, reason } = useRouteAllowed(guards);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!allowed) {
        let target = redirect;
        if (reason === 'role') {
          target = routes.special.forbidden();
        } else if (reason === 'consent') {
          target = routes.special.unauthorized?.() ?? routes.special.forbidden();
        } else if (reason === 'flag') {
          target = routes.special.notFound();
        } else if (reason === 'auth') {
          target = redirect;
        } else {
          target = routes.special.notFound();
        }

        if (location.pathname !== target) {
          navigate(target, { replace: true, state: { from: location.pathname, reason } });
        }
      }
    }, [allowed, reason, navigate, location.pathname, redirect]);

    if (!allowed) {
      return null;
    }

    return <Component {...props} />;
  }

  GuardedComponent.displayName = `WithGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
}
