import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { FocusRing } from './FocusRing';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export function SkipLink({ children = 'Aller directement au contenu principal', className, ...props }: SkipLinkProps) {
  return (
    <FocusRing>
      <a
        {...props}
        className={className ? `${className} ec-skip-link` : 'ec-skip-link'}
      >
        {children}
      </a>
    </FocusRing>
  );
}
