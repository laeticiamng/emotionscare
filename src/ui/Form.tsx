import { useId, type FormHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
}

export function Form({
  title,
  description,
  actions,
  successMessage,
  errorMessage,
  className,
  children,
  id,
  ...props
}: FormProps) {
  const generatedId = useId();
  const formId = id ?? `ec-form-${generatedId}`;
  const titleId = title ? `${formId}-title` : undefined;
  const descriptionId = description ? `${formId}-description` : undefined;

  return (
    <form
      {...props}
      id={formId}
      className={clsx('ec-form', className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      noValidate={props.noValidate ?? true}
    >
      {title ? (
        <h1 id={titleId} className="ec-form__title">
          {title}
        </h1>
      ) : null}
      {description ? (
        <p id={descriptionId} className="ec-form__description">
          {description}
        </p>
      ) : null}
      <div className="ec-form__body">{children}</div>
      {successMessage ? (
        <div className="ec-form__status ec-form__status--success" role="status" aria-live="polite">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="ec-form__status ec-form__status--error" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      ) : null}
      {actions ? <div className="ec-form__actions">{actions}</div> : null}
    </form>
  );
}
