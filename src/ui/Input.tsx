import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { FocusRing } from './a11y/FocusRing';
import { VisuallyHidden } from './a11y/VisuallyHidden';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel = false, className, id, wrapperClassName, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('ec-form-field', wrapperClassName)}>
      {hideLabel ? (
        <VisuallyHidden asChild>
          <label htmlFor={fieldId}>{label}</label>
        </VisuallyHidden>
      ) : (
        <label className="ec-form-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <FocusRing>
        <input
          {...props}
          ref={ref}
          id={fieldId}
          className={clsx('ec-input', className)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
      </FocusRing>
      {hint ? (
        <p id={hintId} className="ec-form-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ec-form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
