import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { SkipLink } from './a11y/SkipLink';
import { FocusRing } from './a11y/FocusRing';

export interface NavbarItem {
  label: ReactNode;
  href: string;
  current?: boolean;
  description?: string;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  items: NavbarItem[];
  actions?: ReactNode;
  skipToId?: string;
}

export function Navbar({ brand, items, actions, skipToId = 'main', className, ...props }: NavbarProps) {
  return (
    <header {...props} className={clsx('ec-navbar', className)}>
      <SkipLink href={`#${skipToId}`} />
      <div className="ec-navbar__brand" aria-label="EmotionsCare">
        {brand}
      </div>
      <nav aria-label="Navigation principale">
        <ul className="ec-navbar__links">
          {items.map((item) => (
            <li key={item.href}>
              <FocusRing>
                <a
                  className="ec-navbar__link"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {item.description ? (
                    <span className="ec-navbar__link-description">{item.description}</span>
                  ) : null}
                </a>
              </FocusRing>
            </li>
          ))}
        </ul>
      </nav>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}
