import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { VisuallyHidden } from './a11y/VisuallyHidden';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Spinner({ label = 'Chargement en cours', className, ...props }: SpinnerProps) {
  return (
    <div
      {...props}
      className={clsx('ec-spinner', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="ec-spinner__circle" aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </div>
  );
}
