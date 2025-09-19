import React from 'react';
import { deriveActionSuggestion } from './utils';

interface ActionSuggestionProps {
  summary: string;
  backendSuggestion?: string;
}

export function ActionSuggestion({ summary, backendSuggestion }: ActionSuggestionProps) {
  const suggestion = React.useMemo(
    () => deriveActionSuggestion(summary, backendSuggestion),
    [summary, backendSuggestion],
  );

  return (
    <div
      className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
      role="note"
      aria-label="Action concrète suggérée"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Action concrète</p>
      <p className="mt-1 leading-relaxed line-clamp-2" data-testid="action-suggestion">
        {suggestion}
      </p>
    </div>
  );
}
