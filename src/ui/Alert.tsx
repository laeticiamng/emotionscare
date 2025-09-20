import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function Alert({ tone = 'info', title, description, icon, actions, className, children, ...props }: AlertProps) {
  const role = tone === 'danger' ? 'alert' : 'status';
  const live = tone === 'danger' ? 'assertive' : 'polite';

  return (
    <div
      {...props}
      role={role}
      aria-live={live}
      className={clsx('ec-alert', className)}
      data-tone={tone}
    >
      {icon ? <span className="ec-alert__icon" aria-hidden="true">{icon}</span> : null}
      <div className="ec-alert__content">
        {title ? <h3 className="ec-alert__title">{title}</h3> : null}
        {description ? <p className="ec-alert__description">{description}</p> : null}
        {children}
        {actions ? <div>{actions}</div> : null}
      </div>
    </div>
  );
}
