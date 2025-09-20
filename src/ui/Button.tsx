import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { FocusRing } from './a11y/FocusRing';

export type ButtonVariant = 'primary' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  pressed?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, pressed, className, type = 'button', children, ...rest },
  ref
) {
  const { ['aria-pressed']: ariaPressedProp, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement> & {
    ['aria-pressed']?: boolean | 'true' | 'false';
  };

  const computedPressed = pressed ?? ariaPressedProp;

  return (
    <FocusRing>
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        className={clsx('ec-button', className)}
        data-variant={variant}
        data-size={size}
        data-pressed={computedPressed === true || computedPressed === 'true' ? 'true' : undefined}
        aria-pressed={computedPressed}
      >
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{children}</span>
      </button>
    </FocusRing>
  );
});
