import { cloneElement, isValidElement, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

const styles: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px'
};

type VisuallyHiddenProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export function VisuallyHidden({ children, className, style, asChild = false, ...props }: VisuallyHiddenProps) {
  if (asChild && isValidElement(children)) {
    const childStyle = (children.props as { style?: CSSProperties }).style ?? {};
    const childClassName = (children.props as { className?: string }).className;
    return cloneElement(children, {
      ...props,
      className: [childClassName, className].filter(Boolean).join(' '),
      style: { ...styles, ...childStyle, ...style }
    });
  }

  return (
    <span
      {...props}
      className={className}
      style={{ ...styles, ...style }}
    >
      {children}
    </span>
  );
}
