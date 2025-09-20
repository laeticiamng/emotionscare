import { cloneElement, isValidElement, type ReactElement } from 'react';
import clsx from 'clsx';

export interface FocusRingProps {
  children: ReactElement;
  focusClassName?: string;
}

/**
 * Wraps interactive elements so that focus is always visible.
 * The focus styles rely on the `.ec-focus-ring` utility defined in the design tokens layer.
 */
export function FocusRing({ children, focusClassName = 'ec-focus-ring' }: FocusRingProps) {
  if (!isValidElement(children)) {
    throw new Error('FocusRing expects a single React element as a child.');
  }

  return cloneElement(children, {
    className: clsx(children.props.className, focusClassName),
    ref: (children as ReactElement & { ref?: unknown }).ref
  });
}
