import { useEffect, useRef, useCallback, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { FocusRing } from './a11y/FocusRing';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  labelledBy?: string;
  describedBy?: string;
  className?: string;
}

function getFocusableElements(container: HTMLElement) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  labelledBy,
  describedBy,
  className
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const generatedHeadingId = useId();
  const headingId = labelledBy ?? generatedHeadingId;
  const descriptionId = description ? describedBy ?? `${headingId}-description` : undefined;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!dialogRef.current) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = getFocusableElements(dialogRef.current);
        if (focusable.length === 0) {
          dialogRef.current.focus();
          event.preventDefault();
          return;
        }
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    lastFocusedElement.current = document.activeElement as HTMLElement;

    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    const focusable = getFocusableElements(dialog);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialog.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus({ preventScroll: true });
      }
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="ec-modal__backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={clsx('ec-modal', className)}
      >
        <header className="ec-modal__header">
          <div>
            <h2 id={headingId} className="ec-modal__title">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="ec-modal__description">
                {description}
              </p>
            ) : null}
          </div>
          <FocusRing>
            <button
              type="button"
              className="ec-modal__close"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
            >
              ×
            </button>
          </FocusRing>
        </header>
        <div>{children}</div>
      </section>
    </div>,
    document.body
  );
}
