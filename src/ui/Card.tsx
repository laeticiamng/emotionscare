import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}

export function Card({ title, subtitle, leading, actions, className, children, ...props }: CardProps) {
  return (
    <section
      {...props}
      className={clsx('ec-card', className)}
      role={props.role ?? 'region'}
    >
      {(title || subtitle || leading || actions) && (
        <header className="ec-card__header">
          {leading}
          <div>
            {title ? <h2 className="ec-card__title">{title}</h2> : null}
            {subtitle ? <p className="ec-card__subtitle">{subtitle}</p> : null}
          </div>
          {actions}
        </header>
      )}
      <div className="ec-card__content">{children}</div>
    </section>
  );
}
