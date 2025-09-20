import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type BadgeTone = 'brand' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

export function Badge({ tone = 'brand', icon, className, children, ...props }: BadgeProps) {
  return (
    <span {...props} className={clsx('ec-badge', className)} data-tone={tone}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
