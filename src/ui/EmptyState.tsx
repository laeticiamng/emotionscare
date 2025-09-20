import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return (
    <section {...props} className={clsx('ec-empty-state', className)} role="status" aria-live="polite">
      {icon ? <div aria-hidden="true">{icon}</div> : null}
      <h2 className="ec-empty-state__title">{title}</h2>
      <p className="ec-empty-state__description">{description}</p>
      {action}
    </section>
  );
}
