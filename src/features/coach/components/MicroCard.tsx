// @ts-nocheck
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface MicroCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
}

export const MicroCard = forwardRef<HTMLButtonElement, MicroCardProps>(function MicroCard(
  { title, description, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'w-full rounded-lg border border-indigo-100 bg-white px-4 py-3 text-left shadow-sm transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
        'hover:border-indigo-300 hover:bg-indigo-50/60',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      <span className="block text-sm font-semibold text-indigo-900">{title}</span>
      <span className="mt-1 block text-sm text-indigo-700/90">{description}</span>
    </button>
  );
});

export default MicroCard;
